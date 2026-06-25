import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplyCouponDto, CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCouponDto) {
    return this.prisma.coupon.create({
      data: { ...dto, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined },
    });
  }

  findAll() {
    return this.prisma.coupon.findMany({ orderBy: { expiresAt: 'desc' } });
  }

  async findByCode(code: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon) throw new NotFoundException(`Coupon ${code} not found`);
    return coupon;
  }

  async update(id: string, dto: UpdateCouponDto) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException(`Coupon with ID ${id} not found`);
    return this.prisma.coupon.update({
      where: { id },
      data: { ...dto, expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined },
    });
  }

  async remove(id: string) {
    const coupon = await this.prisma.coupon.findUnique({ where: { id } });
    if (!coupon) throw new NotFoundException(`Coupon with ID ${id} not found`);
    await this.prisma.coupon.delete({ where: { id } });
    return { message: 'Coupon deleted successfully' };
  }

  async apply(dto: ApplyCouponDto) {
    const coupon = await this.findByCode(dto.code);
    if (coupon.expiresAt && coupon.expiresAt < new Date()) throw new BadRequestException('Coupon expired');
    if (coupon.usedCount >= coupon.maxUsage) throw new BadRequestException('Coupon usage limit reached');

    const discount = coupon.type === 'percentage'
      ? dto.subtotal * (Number(coupon.value) / 100)
      : Number(coupon.value);

    return {
      coupon,
      discount: Math.min(discount, dto.subtotal),
      total: Math.max(dto.subtotal - discount, 0),
    };
  }
}
