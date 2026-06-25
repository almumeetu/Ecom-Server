import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  ConfirmPaymentDto,
  CreateManualPaymentDto,
  InitiatePaymentDto,
} from './dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(private readonly prisma: PrismaService) {}

  async initiate(dto: InitiatePaymentDto) {
    const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException(`Order with ID ${dto.orderId} not found`);
    return this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        amount: order.total,
        method: dto.method,
        status: dto.method === 'cod' ? 'pending' : 'pending',
      },
    });
  }

  async createManual(dto: CreateManualPaymentDto) {
    const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException(`Order with ID ${dto.orderId} not found`);
    return this.prisma.payment.create({ data: dto });
  }

  async confirm(dto: ConfirmPaymentDto) {
    const payment = await this.prisma.payment.findUnique({ where: { id: dto.paymentId } });
    if (!payment) throw new NotFoundException(`Payment with ID ${dto.paymentId} not found`);

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { id: dto.paymentId },
        data: {
          status: dto.status,
          transactionId: dto.transactionId,
          paidAt: dto.status === 'success' ? new Date() : undefined,
        },
      });
      if (dto.status === 'success') {
        await tx.order.update({
          where: { id: payment.orderId },
          data: { paymentStatus: 'paid' },
        });
      }
      return updated;
    });
  }

  orderPayments(orderId: string) {
    return this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { paidAt: 'desc' },
    });
  }

  webhook(payload: any) {
    return { received: true, payload };
  }
}
