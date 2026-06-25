import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';

const cartInclude = {
  items: {
    include: {
      variant: { include: { product: { include: { media: { include: { media: true } } } } } },
    },
  },
};

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId, true);
    return this.withTotals(cart);
  }

  async addItem(userId: string, dto: AddCartItemDto) {
    const variant = await this.prisma.productVariant.findUnique({ where: { id: dto.variantId } });
    if (!variant) throw new NotFoundException(`Variant with ID ${dto.variantId} not found`);
    if (variant.stockQuantity < dto.quantity) throw new BadRequestException('Insufficient stock');

    const cart = await this.getOrCreateCart(userId);

    const existing = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, variantId: dto.variantId },
    });

    if (existing) {
      const quantity = existing.quantity + dto.quantity;
      if (variant.stockQuantity < quantity) throw new BadRequestException('Insufficient stock');
      await this.prisma.cartItem.update({ where: { id: existing.id }, data: { quantity } });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, variantId: dto.variantId, quantity: dto.quantity },
      });
    }

    return this.getCart(userId);
  }

  async updateItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const item = await this.getOwnedItem(userId, itemId);
    const variant = await this.prisma.productVariant.findUniqueOrThrow({
      where: { id: item.variantId },
    });
    if (variant.stockQuantity < dto.quantity) throw new BadRequestException('Insufficient stock');

    await this.prisma.cartItem.update({ where: { id: itemId }, data: { quantity: dto.quantity } });
    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    await this.getOwnedItem(userId, itemId);
    await this.prisma.cartItem.delete({ where: { id: itemId } });
    return this.getCart(userId);
  }

  async clear(userId: string) {
    const cart = await this.prisma.cart.findFirst({ where: { userId } });
    if (cart) await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { message: 'Cart cleared successfully' };
  }

  private async getOrCreateCart(userId: string, includeItems = false) {
    const existing = await this.prisma.cart.findFirst({
      where: { userId },
      include: includeItems ? cartInclude : undefined,
      orderBy: { createdAt: 'desc' },
    });
    if (existing) return existing;
    return this.prisma.cart.create({
      data: { userId },
      include: includeItems ? cartInclude : undefined,
    });
  }

  private async getOwnedItem(userId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cart: { userId } },
    });
    if (!item) throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    return item;
  }

  private withTotals(cart: any) {
    const subtotal = cart.items.reduce(
      (sum: number, item: any) => sum + Number(item.variant.price) * item.quantity,
      0,
    );
    return { ...cart, subtotal };
  }
}
