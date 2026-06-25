import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { DashboardQueryDto } from './dto/dashboard-query.dto';

type DateRange = {
  start: Date;
  end: Date;
  prevStart: Date;
  prevEnd: Date;
};

type Metric = { value: number; trend: number | null };

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Percentage change of `current` vs `previous`, rounded to 1 decimal.
 * Returns null when there is no meaningful baseline (previous === 0).
 */
function pctChange(current: number, previous: number): number | null {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Resolve the selected reporting window plus the immediately-preceding
   * window of equal length (used to compute trend percentages).
   */
  private resolveDateRange(query: DashboardQueryDto): DateRange {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (query.period) {
      case 'today':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'yesterday': {
        const y = new Date(now.getTime() - DAY_MS);
        start = startOfDay(y);
        end = endOfDay(y);
        break;
      }
      case 'week':
        start = startOfDay(new Date(now.getTime() - 6 * DAY_MS));
        end = endOfDay(now);
        break;
      case 'custom':
        start = query.startDate
          ? startOfDay(new Date(query.startDate))
          : startOfDay(new Date(now.getTime() - 29 * DAY_MS));
        end = query.endDate ? endOfDay(new Date(query.endDate)) : endOfDay(now);
        break;
      case 'month':
      default:
        start = startOfDay(new Date(now.getTime() - 29 * DAY_MS));
        end = endOfDay(now);
        break;
    }

    const span = end.getTime() - start.getTime();
    const prevEnd = new Date(start.getTime() - 1);
    const prevStart = new Date(prevEnd.getTime() - span);

    return { start, end, prevStart, prevEnd };
  }

  async summary(query: DashboardQueryDto) {
    const { start, end, prevStart, prevEnd } = this.resolveDateRange(query);
    const inRange = { gte: start, lte: end };
    const inPrev = { gte: prevStart, lte: prevEnd };

    const [
      // current window
      salesCur,
      ordersCur,
      pendingCur,
      refundCur,
      customersCur,
      // previous window (for trend)
      salesPrev,
      ordersPrev,
      pendingPrev,
      refundPrev,
      customersPrev,
      // point-in-time totals (not window scoped)
      totalCustomers,
      totalProducts,
      lowStockRows,
      recentOrders,
    ] = await Promise.all([
      this.prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'paid', placedAt: inRange } }),
      this.prisma.order.count({ where: { placedAt: inRange } }),
      this.prisma.order.count({ where: { status: 'pending', placedAt: inRange } }),
      this.prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'refunded', placedAt: inRange } }),
      this.prisma.user.count({ where: { createdAt: inRange } }),

      this.prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'paid', placedAt: inPrev } }),
      this.prisma.order.count({ where: { placedAt: inPrev } }),
      this.prisma.order.count({ where: { status: 'pending', placedAt: inPrev } }),
      this.prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: 'refunded', placedAt: inPrev } }),
      this.prisma.user.count({ where: { createdAt: inPrev } }),

      this.prisma.user.count(),
      this.prisma.product.count({ where: { deletedAt: null } }),
      this.prisma.$queryRaw<{ count: number }[]>(
        Prisma.sql`SELECT COUNT(*)::int AS count FROM product_variants WHERE "stockQuantity" <= "stockAlertThreshold"`,
      ),
      this.prisma.order.findMany({
        take: 8,
        where: { placedAt: inRange },
        orderBy: { placedAt: 'desc' },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          paymentStatus: true,
          total: true,
          placedAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
      }),
    ]);

    const totalSales = Number(salesCur._sum.total ?? 0);
    const refundAmount = Number(refundCur._sum.total ?? 0);
    const lowStockProducts = lowStockRows[0]?.count ?? 0;

    const metric = (value: number, prev: number): Metric => ({
      value,
      trend: pctChange(value, prev),
    });

    const salesPrevTotal = Number(salesPrev._sum.total ?? 0);
    const avgOrderValue = ordersCur ? totalSales / ordersCur : 0;
    const avgOrderValuePrev = ordersPrev ? salesPrevTotal / ordersPrev : 0;

    return {
      range: { start, end },
      totalSales: metric(totalSales, salesPrevTotal),
      totalOrders: metric(ordersCur, ordersPrev),
      pendingOrders: metric(pendingCur, pendingPrev),
      avgOrderValue: metric(Math.round(avgOrderValue), Math.round(avgOrderValuePrev)),
      refundAmount: metric(refundAmount, Number(refundPrev._sum.total ?? 0)),
      newCustomers: metric(customersCur, customersPrev),
      lowStockProducts: { value: lowStockProducts, trend: null },
      totalCustomers: { value: totalCustomers, trend: null },
      totalProducts: { value: totalProducts, trend: null },
      recentOrders: recentOrders.map((o) => ({ ...o, total: Number(o.total) })),
    };
  }

  /**
   * Revenue bucketed by day or month over the selected window (paid orders only).
   */
  async salesTrend(query: DashboardQueryDto) {
    const { start, end } = this.resolveDateRange(query);
    const unit =
      query.granularity === 'yearly'
        ? 'year'
        : query.granularity === 'monthly'
          ? 'month'
          : 'day';

    const rows = await this.prisma.$queryRaw<
      { bucket: Date; total: number; orders: number }[]
    >(Prisma.sql`
      SELECT date_trunc(${unit}, "placedAt") AS bucket,
             COALESCE(SUM("total"), 0)::float AS total,
             COUNT(*)::int AS orders
      FROM orders
      WHERE "paymentStatus" = 'paid'
        AND "placedAt" BETWEEN ${start} AND ${end}
      GROUP BY 1
      ORDER BY 1
    `);

    return rows.map((r) => ({
      date: r.bucket,
      total: Number(r.total),
      orders: Number(r.orders),
    }));
  }

  /**
   * Best-selling products by units sold within the window (paid orders only).
   */
  async topProducts(query: DashboardQueryDto) {
    const { start, end } = this.resolveDateRange(query);

    const paidOrders = await this.prisma.order.findMany({
      where: { paymentStatus: 'paid', placedAt: { gte: start, lte: end } },
      select: { id: true },
    });
    const orderIds = paidOrders.map((o) => o.id);
    if (orderIds.length === 0) return [];

    const grouped = await this.prisma.orderItem.groupBy({
      by: ['productId'],
      where: { orderId: { in: orderIds } },
      _sum: { quantity: true, totalPrice: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const productIds = grouped.map((g) => g.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: {
        media: { include: { media: true }, orderBy: { sortOrder: 'asc' } },
        variants: { orderBy: { isDefault: 'desc' } },
      },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));

    return grouped
      .map((g) => {
        const product = productMap.get(g.productId);
        if (!product) return null;
        const featured =
          product.media.find((m) => m.isFeatured)?.media.url ??
          product.media[0]?.media.url ??
          null;
        const stock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          imageUrl: featured,
          unitsSold: g._sum.quantity ?? 0,
          revenue: Number(g._sum.totalPrice ?? 0),
          stock,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);
  }
}
