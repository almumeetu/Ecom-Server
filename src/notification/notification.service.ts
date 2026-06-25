import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateNotificationDto) {
    return this.prisma.notification.create({ data: dto });
  }

  findAll(userId: string) {
    return this.prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }

  async markRead(userId: string, id: string) {
    const notification = await this.prisma.notification.findFirst({ where: { id, userId } });
    if (!notification) throw new NotFoundException(`Notification with ID ${id} not found`);
    return this.prisma.notification.update({ where: { id }, data: { isRead: true } });
  }

  markAllRead(userId: string) {
    return this.prisma.notification.updateMany({ where: { userId }, data: { isRead: true } });
  }

  async remove(userId: string, id: string) {
    const notification = await this.prisma.notification.findFirst({ where: { id, userId } });
    if (!notification) throw new NotFoundException(`Notification with ID ${id} not found`);
    await this.prisma.notification.delete({ where: { id } });
    return { message: 'Notification deleted successfully' };
  }
}
