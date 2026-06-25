import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateAddressDto) {
    // If this is set as default, unset other default addresses for this user
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: [
        { isDefault: 'desc' }, // Default addresses first
        { createdAt: 'desc' }, // Most recent first
      ],
    });
  }

  async findOne(id: string, userId: string) {
    const address = await this.prisma.address.findFirst({
      where: { id, userId },
    });

    if (!address) {
      throw new NotFoundException('Address not found');
    }

    return address;
  }

  async update(id: string, userId: string, dto: UpdateAddressDto) {
    // Check if address exists and belongs to user
    const existingAddress = await this.findOne(id, userId);

    // If this is set as default, unset other default addresses for this user
    if (dto.isDefault) {
      await this.prisma.address.updateMany({
        where: { 
          userId,
          id: { not: id }, // Exclude current address
        },
        data: { isDefault: false },
      });
    }

    return this.prisma.address.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    // Check if address exists and belongs to user
    await this.findOne(id, userId);

    // Check if there are any orders using this address
    const ordersUsingAddress = await this.prisma.order.findFirst({
      where: { addressId: id },
    });

    if (ordersUsingAddress) {
      throw new ForbiddenException('Cannot delete address that is used in orders');
    }

    await this.prisma.address.delete({
      where: { id },
    });

    return { message: 'Address deleted successfully' };
  }

  async setDefault(id: string, userId: string) {
    // Check if address exists and belongs to user
    await this.findOne(id, userId);

    // Unset all other default addresses for this user
    await this.prisma.address.updateMany({
      where: { 
        userId,
        id: { not: id }, // Exclude current address
      },
      data: { isDefault: false },
    });

    // Set this address as default
    return this.prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });
  }
}
