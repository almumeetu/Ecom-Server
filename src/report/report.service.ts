import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  private getDateRange(startDate?: string, endDate?: string) {
    const now = new Date();
    const start = startDate ? new Date(startDate) : new Date(now.getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate) : now;
    return { start, end };
  }

  private paginate<T>(items: T[], page = 1, limit = 20) {
    const total = items.length;
    const start = (page - 1) * limit;
    const data = items.slice(start, start + limit);
    return {
      items: data,
      meta: { page, limit, total },
    };
  }

  async getSalesReport(startDate?: string, endDate?: string, page?: number, limit?: number) {
    const { start, end } = this.getDateRange(startDate, endDate);
    const pg = page ?? 1;
    const lim = limit ?? 20;

    const where = {
      paymentStatus: 'paid' as const,
      placedAt: { gte: start, lte: end },
    };

    const [allOrders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: { select: { id: true, name: true } },
              variant: { select: { id: true, sku: true } },
            },
          },
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { placedAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const avgOrderValue = total > 0 ? totalRevenue / total : 0;

    const productBreakdown: Record<string, any> = {};
    for (const order of allOrders) {
      for (const item of order.items) {
        const key = item.product.id;
        if (!productBreakdown[key]) {
          productBreakdown[key] = {
            productId: item.product.id,
            productName: item.product.name,
            sku: item.variant.sku,
            quantity: 0,
            revenue: 0,
          };
        }
        productBreakdown[key].quantity += item.quantity;
        productBreakdown[key].revenue += Number(item.totalPrice);
      }
    }

    const paginated = this.paginate(allOrders, pg, lim);

    return {
      summary: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders: total,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        period: { start, end },
      },
      productBreakdown: Object.values(productBreakdown),
      orders: {
        items: paginated.items.map((o) => ({
          orderId: o.id,
          orderNumber: o.orderNumber,
          customer: o.user?.name ?? ((o.shippingAddress as any)?.fullName) ?? 'Guest',
          total: Number(o.total),
          discount: Number(o.discount),
          placedAt: o.placedAt,
          items: o.items.map((i) => ({
            product: i.product.name,
            sku: i.variant.sku,
            quantity: i.quantity,
            unitPrice: Number(i.unitPrice),
            totalPrice: Number(i.totalPrice),
          })),
        })),
        meta: paginated.meta,
      },
    };
  }

  async getUserReport(startDate?: string, endDate?: string, page?: number, limit?: number) {
    const { start, end } = this.getDateRange(startDate, endDate);
    const pg = page ?? 1;
    const lim = limit ?? 20;
    const now = new Date();

    const weekStart = new Date(now);
    const dayOfWeek = now.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    weekStart.setDate(now.getDate() - diff);
    weekStart.setHours(0, 0, 0, 0);

    const customerWhere = {
      deletedAt: null,
      OR: [
        { roleId: null },
        { role: { name: { notIn: ['superadmin', 'admin'] } } },
      ],
    };

    const [allUsers, totalCustomers, newCustomersThisWeek] = await Promise.all([
      this.prisma.user.findMany({
        where: {
          ...customerWhere,
          createdAt: { gte: start, lte: end },
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          createdAt: true,
          role: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: customerWhere }),
      this.prisma.user.count({
        where: {
          ...customerWhere,
          createdAt: { gte: weekStart },
        },
      }),
    ]);

    const paginated = this.paginate(allUsers, pg, lim);

    return {
      summary: {
        totalNewUsers: allUsers.length,
        totalCustomers,
        newCustomersThisWeek,
        period: { start, end },
      },
      users: {
        items: paginated.items.map((u) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone,
          role: u.role?.name ?? 'N/A',
          registeredAt: u.createdAt,
        })),
        meta: paginated.meta,
      },
    };
  }

  async getInventoryReport(startDate?: string, endDate?: string, page?: number, limit?: number) {
    const { start, end } = this.getDateRange(startDate, endDate);
    const pg = page ?? 1;
    const lim = limit ?? 20;

    const logWhere = {
      createdAt: { gte: start, lte: end },
    };

    const [allLogs, allVariants] = await Promise.all([
      this.prisma.inventoryLog.findMany({
        where: logWhere,
        include: {
          variant: {
            include: {
              product: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.productVariant.findMany({
        include: {
          product: { select: { id: true, name: true } },
        },
      }),
    ]);

    const lowStockVariants = allVariants.filter((v) => v.stockQuantity <= v.stockAlertThreshold);
    const totalStockIn = allLogs.filter((l) => l.change > 0).reduce((s, l) => s + l.change, 0);
    const totalStockOut = allLogs.filter((l) => l.change < 0).reduce((s, l) => s + Math.abs(l.change), 0);

    const paginated = this.paginate(allLogs, pg, lim);

    return {
      summary: {
        totalStockIn,
        totalStockOut,
        totalTransactions: allLogs.length,
        lowStockAlerts: lowStockVariants.length,
        period: { start, end },
      },
      stockChanges: {
        items: paginated.items.map((l) => ({
          id: l.id,
          product: l.variant.product.name,
          sku: l.variant.sku,
          change: l.change,
          reason: l.reason,
          note: l.note,
          currentStock: l.variant.stockQuantity,
          date: l.createdAt,
        })),
        meta: paginated.meta,
      },
      lowStockAlerts: lowStockVariants.map((v) => ({
        product: v.product.name,
        sku: v.sku,
        currentStock: v.stockQuantity,
        alertThreshold: v.stockAlertThreshold,
      })),
    };
  }

  async getPurchaseReport(startDate?: string, endDate?: string, page?: number, limit?: number) {
    const { start, end } = this.getDateRange(startDate, endDate);
    const pg = page ?? 1;
    const lim = limit ?? 20;

    const where = {
      reason: 'restock' as const,
      createdAt: { gte: start, lte: end },
    };

    const [allLogs, total] = await Promise.all([
      this.prisma.inventoryLog.findMany({
        where,
        include: {
          variant: {
            include: {
              product: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inventoryLog.count({ where }),
    ]);

    const totalUnits = allLogs.reduce((s, l) => s + l.change, 0);
    const totalCost = allLogs.reduce((s, l) => s + (l.change * Number(l.variant.cost ?? 0)), 0);

    const paginated = this.paginate(allLogs, pg, lim);

    return {
      summary: {
        totalPurchases: total,
        totalUnits,
        totalCost: Math.round(totalCost * 100) / 100,
        period: { start, end },
      },
      purchases: {
        items: paginated.items.map((l) => ({
          id: l.id,
          product: l.variant.product.name,
          sku: l.variant.sku,
          quantity: l.change,
          unitCost: Number(l.variant.cost ?? 0),
          totalCost: Math.round(l.change * Number(l.variant.cost ?? 0) * 100) / 100,
          note: l.note,
          date: l.createdAt,
        })),
        meta: paginated.meta,
      },
    };
  }

  async getDiscountReport(startDate?: string, endDate?: string, page?: number, limit?: number) {
    const { start, end } = this.getDateRange(startDate, endDate);
    const pg = page ?? 1;
    const lim = limit ?? 20;

    const orderWhere = {
      discount: { gt: 0 },
      placedAt: { gte: start, lte: end },
    };

    const [allOrders, totalDiscountedOrders, coupons] = await Promise.all([
      this.prisma.order.findMany({
        where: orderWhere,
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { placedAt: 'desc' },
      }),
      this.prisma.order.count({ where: orderWhere }),
      this.prisma.coupon.findMany({
        where: {
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: start } },
          ],
        },
        orderBy: { usedCount: 'desc' },
      }),
    ]);

    const totalDiscountGiven = allOrders.reduce((s, o) => s + Number(o.discount), 0);

    const couponBreakdown = coupons.map((c) => ({
      id: c.id,
      code: c.code,
      type: c.type,
      value: Number(c.value),
      usedCount: c.usedCount,
      maxUsage: c.maxUsage,
      expiresAt: c.expiresAt,
    }));

    const paginated = this.paginate(allOrders, pg, lim);

    // --- Product-level discount tracking on sold products ---
    const soldItems = await this.prisma.orderItem.findMany({
      where: {
        order: {
          paymentStatus: 'paid',
          placedAt: { gte: start, lte: end },
        },
      },
      select: {
        productId: true,
        quantity: true,
        totalPrice: true,
        product: { select: { id: true, name: true } },
      },
    });

    const soldProductMap = new Map<string, { productId: string; productName: string; totalSold: number; revenue: number }>();
    for (const item of soldItems) {
      const existing = soldProductMap.get(item.productId);
      if (existing) {
        existing.totalSold += item.quantity;
        existing.revenue += Number(item.totalPrice);
      } else {
        soldProductMap.set(item.productId, {
          productId: item.product.id,
          productName: item.product.name,
          totalSold: item.quantity,
          revenue: Number(item.totalPrice),
        });
      }
    }

    const productIds = [...soldProductMap.keys()];
    let productDiscountBreakdown: any[] = [];

    if (productIds.length > 0) {
      const discountLinks = await this.prisma.discountProduct.findMany({
        where: { productId: { in: productIds } },
        include: { discount: true },
      });

      const discountGroup = new Map<string, { discount: any; products: any[] }>();
      for (const link of discountLinks) {
        const sold = soldProductMap.get(link.productId);
        if (!sold) continue;
        const existing = discountGroup.get(link.discountId);
        if (existing) {
          existing.products.push(sold);
        } else {
          discountGroup.set(link.discountId, {
            discount: link.discount,
            products: [sold],
          });
        }
      }

      productDiscountBreakdown = [...discountGroup.values()].map(({ discount, products }) => ({
        discountId: discount.id,
        discountName: discount.name,
        type: discount.type,
        value: Number(discount.value),
        status: discount.status,
        startDate: discount.startDate,
        endDate: discount.endDate,
        products,
      }));
    }

    return {
      summary: {
        totalDiscountGiven: Math.round(totalDiscountGiven * 100) / 100,
        ordersWithDiscount: totalDiscountedOrders,
        totalCoupons: coupons.length,
        period: { start, end },
      },
      couponBreakdown,
      discountedOrders: {
        items: paginated.items.map((o) => ({
          orderId: o.id,
          orderNumber: o.orderNumber,
          customer: o.user?.name ?? ((o.shippingAddress as any)?.fullName) ?? 'Guest',
          discountAmount: Number(o.discount),
          orderTotal: Number(o.total),
          placedAt: o.placedAt,
        })),
        meta: paginated.meta,
      },
      productDiscountBreakdown,
    };
  }

  async getOverview(startDate?: string, endDate?: string) {
    const [sales, users, discounts, inventory, purchases] = await Promise.all([
      this.getSalesReport(startDate, endDate),
      this.getUserReport(startDate, endDate),
      this.getDiscountReport(startDate, endDate),
      this.getInventoryReport(startDate, endDate),
      this.getPurchaseReport(startDate, endDate),
    ]);

    return {
      period: sales.summary.period,
      sales: sales.summary,
      customers: users.summary,
      discounts: discounts.summary,
      inventory: inventory.summary,
      purchases: purchases.summary,
    };
  }
}
