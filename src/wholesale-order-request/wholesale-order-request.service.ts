import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';
import {
  ConvertToOrderDto,
  CreateWholesaleOrderRequestDto,
  ListWholesaleRequestsQueryDto,
  UpdateWholesaleRequestStatusDto,
} from './dto/wholesale-order-request.dto';

type WholesaleStatus =
  | 'pending'
  | 'info_requested'
  | 'approved'
  | 'rejected'
  | 'converted';

// Allowed status transitions enforced by updateStatus().
// `converted` is reachable only through the convert endpoint, never via updateStatus.
const ALLOWED_TRANSITIONS: Record<WholesaleStatus, WholesaleStatus[]> = {
  pending: ['approved', 'rejected', 'info_requested'],
  info_requested: ['approved', 'rejected', 'info_requested'],
  approved: ['rejected'],
  rejected: [],
  converted: [],
};

const requestInclude = {
  user: { select: { id: true, name: true, email: true, phone: true } },
  items: { include: { product: true, variant: true } },
  order: true,
};

// Detail view additionally embeds the customer's saved addresses so an admin can
// pick a delivery address when converting (the address API is self-scoped only).
const requestDetailInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      addresses: true,
    },
  },
  items: { include: { product: true, variant: true } },
  order: { include: { items: true, address: true } },
};

// Local copy of the order include shape (the order service keeps its own private const).
const orderInclude = {
  user: { select: { id: true, name: true, email: true, phone: true } },
  address: true,
  items: { include: { product: true, variant: true } },
  statusLogs: { orderBy: { createdAt: 'desc' as const } },
};

@Injectable()
export class WholesaleOrderRequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationService,
  ) {}

  // ---------------------------------------------------------------------------
  // Customer
  // ---------------------------------------------------------------------------

  async create(userId: string, dto: CreateWholesaleOrderRequestDto) {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('At least one item is required');
    }

    // Reject duplicate product/variant pairs in the same request.
    const seen = new Set<string>();
    for (const item of dto.items) {
      const key = `${item.productId}:${item.variantId ?? 'default'}`;
      if (seen.has(key)) {
        throw new BadRequestException(
          'Duplicate product/variant in items; combine them into a single line',
        );
      }
      seen.add(key);
    }

    // Validate referenced products exist.
    const productIds = [...new Set(dto.items.map((i) => i.productId))];
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });
    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products were not found');
    }

    // Validate any explicit variants exist and belong to their product.
    const variantIds = dto.items
      .map((i) => i.variantId)
      .filter((v): v is string => Boolean(v));
    if (variantIds.length > 0) {
      const variants = await this.prisma.productVariant.findMany({
        where: { id: { in: variantIds } },
        select: { id: true, productId: true },
      });
      const variantById = new Map(variants.map((v) => [v.id, v]));
      for (const item of dto.items) {
        if (!item.variantId) continue;
        const variant = variantById.get(item.variantId);
        if (!variant) {
          throw new NotFoundException(`Variant ${item.variantId} was not found`);
        }
        if (variant.productId !== item.productId) {
          throw new BadRequestException(
            `Variant ${item.variantId} does not belong to product ${item.productId}`,
          );
        }
      }
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true },
    });

    const request = await this.prisma.wholesaleOrderRequest.create({
      data: {
        requestNumber: `WSR-${Date.now()}`,
        status: 'pending',
        customerNote: dto.customerNote,
        contactPhone: dto.contactPhone ?? user?.phone ?? null,
        userId,
        items: {
          create: dto.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            requestedQuantity: item.requestedQuantity,
            targetPrice: item.targetPrice ?? null,
            note: item.note ?? null,
          })),
        },
      },
      include: requestInclude,
    });

    await this.notifyAdmins(
      'New wholesale order request',
      `Request ${request.requestNumber} was submitted and is awaiting review.`,
    );

    return request;
  }

  findMine(userId: string) {
    return this.prisma.wholesaleOrderRequest.findMany({
      where: { userId },
      include: requestInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(id: string, userId: string) {
    const request = await this.prisma.wholesaleOrderRequest.findFirst({
      where: { id, userId },
      include: requestDetailInclude,
    });
    if (!request) {
      throw new NotFoundException(`Wholesale request with ID ${id} not found`);
    }
    return request;
  }

  // ---------------------------------------------------------------------------
  // Admin
  // ---------------------------------------------------------------------------

  findAll(query: ListWholesaleRequestsQueryDto) {
    return this.prisma.wholesaleOrderRequest.findMany({
      where: query.status ? { status: query.status } : {},
      include: requestInclude,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const request = await this.prisma.wholesaleOrderRequest.findUnique({
      where: { id },
      include: requestDetailInclude,
    });
    if (!request) {
      throw new NotFoundException(`Wholesale request with ID ${id} not found`);
    }
    return request;
  }

  async updateStatus(id: string, dto: UpdateWholesaleRequestStatusDto) {
    const request = await this.findOne(id);
    const from = request.status as WholesaleStatus;
    const to = dto.status as WholesaleStatus;

    if (!ALLOWED_TRANSITIONS[from].includes(to)) {
      throw new BadRequestException(
        `Invalid status transition from ${from} to ${to}`,
      );
    }

    const data: {
      status: WholesaleStatus;
      reviewedAt: Date;
      infoRequestMessage?: string | null;
      adminNote?: string | null;
    } = { status: to, reviewedAt: new Date() };

    if (to === 'info_requested') {
      data.infoRequestMessage = dto.note ?? null;
    } else if (dto.note) {
      data.adminNote = dto.note;
    }

    const updated = await this.prisma.wholesaleOrderRequest.update({
      where: { id },
      data,
      include: requestDetailInclude,
    });

    await this.notifyCustomer(request.userId, to, request.requestNumber, dto.note);

    return updated;
  }

  // ---------------------------------------------------------------------------
  // Convert approved request -> wholesale Order
  // ---------------------------------------------------------------------------

  async convertToOrder(id: string, dto: ConvertToOrderDto) {
    const request = await this.findOne(id);

    if (request.status !== 'approved') {
      throw new BadRequestException('Only approved requests can be converted');
    }
    if (request.orderId) {
      throw new BadRequestException('This request has already been converted');
    }

    const address = await this.prisma.address.findFirst({
      where: { id: dto.addressId, userId: request.userId },
    });
    if (!address) {
      throw new NotFoundException('Address not found for this customer');
    }

    const order = await this.prisma.$transaction(async (tx) => {
      // 1. Resolve each line to a concrete { productId, variantId, quantity, unitPrice }.
      const resolved: {
        productId: string;
        variantId: string;
        quantity: number;
        unitPrice: number;
        sku: string;
      }[] = [];

      for (const line of dto.items) {
        let productId = line.productId;
        let variantId = line.variantId;

        if (line.requestItemId) {
          const requestItem = request.items.find(
            (ri) => ri.id === line.requestItemId,
          );
          if (!requestItem) {
            throw new BadRequestException(
              `Request item ${line.requestItemId} is not part of this request`,
            );
          }
          productId = requestItem.productId;
          variantId = variantId ?? requestItem.variantId ?? undefined;
        }

        if (!productId) {
          throw new BadRequestException(
            'Each item needs a requestItemId or a productId',
          );
        }

        // Resolve the variant: explicit -> default -> oldest.
        let variant = variantId
          ? await tx.productVariant.findUnique({ where: { id: variantId } })
          : await tx.productVariant.findFirst({
              where: { productId, isDefault: true },
            });
        if (!variant) {
          variant = await tx.productVariant.findFirst({
            where: { productId },
            orderBy: { createdAt: 'asc' },
          });
        }
        if (!variant) {
          throw new BadRequestException(
            `No variant found for product ${productId}`,
          );
        }
        if (variant.productId !== productId) {
          throw new BadRequestException(
            `Variant ${variant.id} does not belong to product ${productId}`,
          );
        }

        resolved.push({
          productId,
          variantId: variant.id,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          sku: variant.sku,
        });
      }

      // 2. Reject duplicate resolved variants (would double-decrement stock).
      const variantSet = new Set<string>();
      for (const r of resolved) {
        if (variantSet.has(r.variantId)) {
          throw new BadRequestException(
            'Duplicate variant across conversion items',
          );
        }
        variantSet.add(r.variantId);
      }

      // 3. Validate stock against fresh figures inside the transaction.
      const variants = await tx.productVariant.findMany({
        where: { id: { in: resolved.map((r) => r.variantId) } },
        select: { id: true, stockQuantity: true, sku: true },
      });
      const stockById = new Map(variants.map((v) => [v.id, v]));
      for (const r of resolved) {
        const v = stockById.get(r.variantId);
        if (!v || v.stockQuantity < r.quantity) {
          throw new BadRequestException(`Insufficient stock for SKU ${r.sku}`);
        }
      }

      // 4. Totals (mirror order.service: arithmetic via Number()).
      const subtotal = resolved.reduce(
        (sum, r) => sum + Number(r.unitPrice) * r.quantity,
        0,
      );
      const discount = Number(dto.discount ?? 0);
      const shippingCost = Number(dto.shippingCost ?? 0);
      const tax = Number(dto.tax ?? 0);
      const total = subtotal - discount + shippingCost + tax;
      if (total < 0) {
        throw new BadRequestException('Order total cannot be negative');
      }

      // 5. Create the wholesale order.
      const createdOrder = await tx.order.create({
        data: {
          orderNumber: `ORD-${Date.now()}`,
          orderType: 'wholesale',
          userId: request.userId,
          addressId: dto.addressId,
          paymentStatus: dto.paymentStatus ?? 'unpaid',
          total,
          discount,
          shippingCost,
          tax,
          items: {
            create: resolved.map((r) => ({
              productId: r.productId,
              variantId: r.variantId,
              quantity: r.quantity,
              unitPrice: r.unitPrice,
              totalPrice: Number(r.unitPrice) * r.quantity,
            })),
          },
          statusLogs: {
            create: {
              status: 'pending',
              note: `Wholesale order created from request ${request.requestNumber}`,
            },
          },
        },
        include: orderInclude,
      });

      // 6. Decrement stock + write inventory logs.
      for (const r of resolved) {
        await tx.productVariant.update({
          where: { id: r.variantId },
          data: { stockQuantity: { decrement: r.quantity } },
        });
        await tx.inventoryLog.create({
          data: {
            variantId: r.variantId,
            change: -r.quantity,
            reason: 'sale',
            referenceId: createdOrder.id,
            note: `Wholesale order ${createdOrder.orderNumber}`,
          },
        });
      }

      // 7. Mark the request converted and link the order.
      await tx.wholesaleOrderRequest.update({
        where: { id: request.id },
        data: {
          status: 'converted',
          orderId: createdOrder.id,
          reviewedAt: new Date(),
        },
      });

      return createdOrder;
    });

    // Notify the customer outside the transaction so a notify failure can't roll back the order.
    await this.notifications.create({
      userId: request.userId,
      title: 'Wholesale order created',
      message: `Your request ${request.requestNumber} was approved and order ${order.orderNumber} was created.`,
    });

    return order;
  }

  // ---------------------------------------------------------------------------
  // Notifications (DB-only)
  // ---------------------------------------------------------------------------

  private async notifyAdmins(title: string, message: string) {
    const admins = await this.prisma.user.findMany({
      where: { role: { name: 'admin' } },
      select: { id: true },
    });
    await Promise.all(
      admins.map((admin) =>
        this.notifications.create({ userId: admin.id, title, message }),
      ),
    );
  }

  private notifyCustomer(
    userId: string,
    status: WholesaleStatus,
    requestNumber: string,
    note?: string,
  ) {
    const messages: Record<string, string> = {
      approved: `Your wholesale request ${requestNumber} was approved.`,
      rejected: `Your wholesale request ${requestNumber} was rejected.`,
      info_requested: `More information is needed for your wholesale request ${requestNumber}.`,
    };
    const base = messages[status] ?? `Your wholesale request ${requestNumber} was updated.`;
    return this.notifications.create({
      userId,
      title: 'Wholesale request update',
      message: note ? `${base} ${note}` : base,
    });
  }
}
