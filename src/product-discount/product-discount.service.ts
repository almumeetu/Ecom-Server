import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDiscountDto, ListProductDiscountsQueryDto, UpdateProductDiscountDto } from './dto/product-discount.dto';

@Injectable()
export class ProductDiscountService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDiscountDto) {
    const { productIds, ...data } = dto;

    if (data.endDate && data.startDate && new Date(data.endDate) <= new Date(data.startDate)) {
      throw new BadRequestException('End date must be after start date');
    }

    await this.validateProductsExist(productIds);

    if (data.type === 'fixed') {
      const validation = await this.validateFixedDiscountValue(productIds, data.value);
      if (!validation.valid) {
        return {
          success: false,
          message: `Fixed discount value (${data.value}) exceeds the retail price for ${validation.invalidProducts.length} product(s)`,
          invalidProducts: validation.invalidProducts,
        };
      }
    }

    return this.prisma.productDiscount.create({
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        products: {
          create: productIds.map((productId) => ({ productId })),
        },
      },
      include: {
        products: {
          include: {
            product: {
              include: {
                variants: { take: 1, orderBy: { price: 'asc' } },
              },
            },
          },
        },
      },
    });
  }

  async findAll(query: ListProductDiscountsQueryDto = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: Prisma.ProductDiscountWhereInput = {};

    if (query.search) {
      where.name = { contains: query.search.trim(), mode: 'insensitive' };
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.productDiscount.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { products: true } } },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.productDiscount.count({ where }),
    ]);

    return { data, meta: { page, limit, total } };
  }

  async findOne(id: string) {
    const discount = await this.prisma.productDiscount.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: {
              include: {
                variants: { orderBy: { price: 'asc' } },
                brand: true,
                category: true,
              },
            },
          },
        },
      },
    });
    if (!discount) throw new NotFoundException(`Product discount with ID ${id} not found`);
    return discount;
  }

  async update(id: string, dto: UpdateProductDiscountDto) {
    const existing = await this.prisma.productDiscount.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Product discount with ID ${id} not found`);

    const { productIds, ...data } = dto;

    if (data.endDate && data.startDate && new Date(data.endDate) <= new Date(data.startDate)) {
      throw new BadRequestException('End date must be after start date');
    }

    if (productIds) {
      await this.validateProductsExist(productIds);
    }

    const currentType = data.type ?? existing.type;
    const currentValue = data.value ?? Number(existing.value);
    const idsToCheck = productIds ?? await this.getLinkedProductIds(id);

    if (currentType === 'fixed') {
      const validation = await this.validateFixedDiscountValue(idsToCheck, currentValue);
      if (!validation.valid) {
        return {
          success: false,
          message: `Fixed discount value (${currentValue}) exceeds the retail price for ${validation.invalidProducts.length} product(s)`,
          invalidProducts: validation.invalidProducts,
        };
      }
    }

    return this.prisma.productDiscount.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        products: productIds
          ? {
              deleteMany: {},
              create: productIds.map((productId) => ({ productId })),
            }
          : undefined,
      },
      include: {
        products: {
          include: {
            product: {
              include: {
                variants: { orderBy: { price: 'asc' } },
                brand: true,
                category: true,
              },
            },
          },
        },
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.productDiscount.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Product discount with ID ${id} not found`);
    await this.prisma.discountProduct.deleteMany({ where: { discountId: id } });
    await this.prisma.productDiscount.delete({ where: { id } });
    return { message: 'Product discount deleted successfully' };
  }

  private async getLinkedProductIds(discountId: string): Promise<string[]> {
    const links = await this.prisma.discountProduct.findMany({
      where: { discountId },
      select: { productId: true },
    });
    return links.map(l => l.productId);
  }

  private async validateProductsExist(productIds: string[]) {
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true },
    });
    if (products.length !== productIds.length) {
      throw new BadRequestException('One or more product IDs are invalid');
    }
  }

  private async validateFixedDiscountValue(
    productIds: string[],
    value: number,
  ): Promise<
    | { valid: true }
    | { valid: false; invalidProducts: Array<{ productId: string; lowestPrice: number }> }
  > {
    const lowestPrices = await this.prisma.productVariant.groupBy({
      by: ['productId'],
      where: { productId: { in: productIds } },
      _min: { price: true },
    });

    const invalid = lowestPrices
      .filter((v) => Number(v._min.price) < value)
      .map((v) => ({ productId: v.productId, lowestPrice: Number(v._min.price) }));

    return invalid.length > 0
      ? { valid: false, invalidProducts: invalid }
      : { valid: true };
  }
}
