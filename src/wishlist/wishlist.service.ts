import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddWishlistDto } from './dto/wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async add(userId: string, dto: AddWishlistDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, deletedAt: null },
    });
    if (!product) throw new NotFoundException(`Product with ID ${dto.productId} not found`);
    return this.prisma.wishlist.upsert({
      where: { userId_productId: { userId, productId: dto.productId } },
      update: {},
      create: { userId, productId: dto.productId },
      include: { product: true },
    });
  }

  findAll(userId: string) {
    return this.prisma.wishlist.findMany({
      where: { userId },
      include: { product: { include: { media: { include: { media: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(userId: string, productId: string) {
    await this.prisma.wishlist.delete({
      where: { userId_productId: { userId, productId } },
    });
    return { message: 'Wishlist item removed successfully' };
  }
}
