import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShipmentDto, UpdateShipmentDto } from './dto/shipment.dto';

@Injectable()
export class ShipmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateShipmentDto) {
    const order = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
    if (!order) throw new NotFoundException(`Order with ID ${dto.orderId} not found`);
    return this.prisma.shipment.create({ data: dto });
  }

  findByOrder(orderId: string) {
    return this.prisma.shipment.findMany({ where: { orderId } });
  }

  async update(id: string, dto: UpdateShipmentDto) {
    await this.ensureShipment(id);
    return this.prisma.shipment.update({ where: { id }, data: dto });
  }

  async markShipped(id: string) {
    await this.ensureShipment(id);
    return this.prisma.shipment.update({ where: { id }, data: { shippedAt: new Date() } });
  }

  async markDelivered(id: string) {
    await this.ensureShipment(id);
    return this.prisma.shipment.update({ where: { id }, data: { deliveredAt: new Date() } });
  }

  private async ensureShipment(id: string) {
    const shipment = await this.prisma.shipment.findUnique({ where: { id } });
    if (!shipment) throw new NotFoundException(`Shipment with ID ${id} not found`);
    return shipment;
  }
}
