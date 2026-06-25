import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import {
  CreateProductDto,
  CreateProductMediaDto,
  CreateVariantDto,
  ProductQueryDto,
  UpdateProductDto,
  UpdateProductMediaDto,
  UpdateVariantDto,
} from './dto/product.dto';

interface DiscountAttachment {
  id: string;
  type: 'percentage' | 'fixed';
  value: number;
}

interface DiscountCandidate {
  id: string;
  type: 'percentage' | 'fixed';
  value: number | string | { toNumber(): number };
}

interface DiscountableProduct {
  id: string;
  variants?: Array<{ price: number | string | { toNumber(): number } }>;
}

interface VariantDiscount {
  discountAmount: number;
  discountedPrice: number;
}

const productInclude = {
  brand: true,
  category: true,
  unit: true,
  tags: true,
  media: { include: { media: true }, orderBy: { sortOrder: 'asc' as const } },
  variants: {
    include: {
      attributes: {
        include: { attributeValue: { include: { attribute: true } } },
      },
    },
  },
};

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async create(dto: CreateProductDto) {
    const { tagIds, variants, ...productData } = dto;
    await this.ensureBrandCategoryAndUnit(dto.brandId, dto.categoryId, dto.unitId);

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          ...productData,
          tags: tagIds?.length
            ? { connect: tagIds.map((id) => ({ id })) }
            : undefined,
        },
      });

      if (variants?.length) {
        for (const v of variants) {
          const { attributeValueIds, ...variantData } = v;
          await tx.productVariant.create({
            data: {
              ...variantData,
              productId: product.id,
              attributes: attributeValueIds?.length
                ? { create: attributeValueIds.map((id) => ({ attributeValueId: id })) }
                : undefined,
            },
          });
        }
      } else {
        await tx.productVariant.create({
          data: {
            sku: `${product.slug}-default`,
            price: 0,
            stockQuantity: 0,
            isDefault: true,
            productId: product.id,
          },
        });
      }

      return tx.product.findUniqueOrThrow({
        where: { id: product.id },
        include: productInclude,
      });
    });
  }

  async findAll(query: ProductQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: any = { deletedAt: null };

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { slug: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.brandId) where.brandId = query.brandId;
    if (query.categoryId) where.categoryId = query.categoryId;
    if (query.status) where.status = query.status;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: productInclude,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    const enriched = await this.enrichWithDiscounts(data);

    return { data: enriched, meta: { page, limit, total } };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: productInclude,
    });
    if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
    return this.enrichWithDiscounts(product);
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, deletedAt: null },
      include: productInclude,
    });
    if (!product) throw new NotFoundException(`Product with slug ${slug} not found`);
    return this.enrichWithDiscounts(product);
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id);
    const { tagIds, variants, ...productData } = dto;
    if (dto.brandId || dto.categoryId || dto.unitId) {
      const current = await this.prisma.product.findUniqueOrThrow({ where: { id } });
      await this.ensureBrandCategoryAndUnit(
        dto.brandId ?? current.brandId,
        dto.categoryId ?? current.categoryId,
        dto.unitId ?? (current as any).unitId,
      );
    }
    return this.prisma.product.update({
      where: { id },
      data: {
        ...productData,
        tags: tagIds ? { set: tagIds.map((tagId) => ({ id: tagId })) } : undefined,
      },
      include: productInclude,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date(), status: 'inactive' },
    });
    return { message: 'Product deleted successfully' };
  }

  async addMedia(productId: string, dto: CreateProductMediaDto, file: Express.Multer.File) {
    await this.findOne(productId);
    if (!file) throw new BadRequestException('Media file is required');

    const url = await this.uploadService.uploadFile(file, 'products');

    return this.prisma.$transaction(async (tx) => {
      if (dto.isFeatured) {
        await tx.productMedia.updateMany({
          where: { productId },
          data: { isFeatured: false },
        });
      }

      const media = await tx.media.create({
        data: {
          url,
          type: dto.type ?? 'image',
          provider: process.env.STORAGE_PROVIDER === 's3' ? 's3' : 'local',
        },
      });

      return tx.productMedia.create({
        data: {
          productId,
          mediaId: media.id,
          isFeatured: dto.isFeatured ?? false,
          sortOrder: dto.sortOrder ?? 0,
        },
        include: { media: true },
      });
    });
  }

  listMedia(productId: string) {
    return this.prisma.productMedia.findMany({
      where: { productId },
      include: { media: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async updateMedia(id: string, dto: UpdateProductMediaDto) {
    const existing = await this.prisma.productMedia.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`Product media with ID ${id} not found`);

    return this.prisma.$transaction(async (tx) => {
      if (dto.isFeatured) {
        await tx.productMedia.updateMany({
          where: { productId: existing.productId },
          data: { isFeatured: false },
        });
      }
      return tx.productMedia.update({
        where: { id },
        data: dto,
        include: { media: true },
      });
    });
  }

  async removeMedia(id: string) {
    const existing = await this.prisma.productMedia.findUnique({
      where: { id },
      include: { media: true },
    });
    if (!existing) throw new NotFoundException(`Product media with ID ${id} not found`);

    await this.prisma.productMedia.delete({ where: { id } });
    await this.prisma.media.delete({ where: { id: existing.mediaId } });
    await this.uploadService.deleteFile(existing.media.url);
    return { message: 'Product media deleted successfully' };
  }

  async createVariant(productId: string, dto: CreateVariantDto) {
    await this.findOne(productId);
    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await tx.productVariant.updateMany({
          where: { productId },
          data: { isDefault: false },
        });
      }

      return tx.productVariant.create({
        data: {
          sku: dto.sku,
          price: dto.price,
          cost: dto.cost,
          stockQuantity: dto.stockQuantity ?? 0,
          stockAlertThreshold: dto.stockAlertThreshold ?? 10,
          isDefault: dto.isDefault ?? false,
          productId,
          attributes: dto.attributeValueIds?.length
            ? {
                create: dto.attributeValueIds.map((attributeValueId) => ({
                  attributeValueId,
                })),
              }
            : undefined,
        },
        include: { attributes: { include: { attributeValue: true } } },
      });
    });
  }

  listVariants(productId: string) {
    return this.prisma.productVariant.findMany({
      where: { productId },
      include: { attributes: { include: { attributeValue: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findVariant(id: string) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id },
      include: { product: true, attributes: { include: { attributeValue: true } } },
    });
    if (!variant) throw new NotFoundException(`Variant with ID ${id} not found`);
    return variant;
  }

  async updateVariant(id: string, dto: UpdateVariantDto) {
    const existing = await this.findVariant(id);
    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await tx.productVariant.updateMany({
          where: { productId: existing.productId },
          data: { isDefault: false },
        });
      }
      if (dto.attributeValueIds) {
        await tx.productVariantAttribute.deleteMany({ where: { variantId: id } });
      }
      return tx.productVariant.update({
        where: { id },
        data: {
          sku: dto.sku,
          price: dto.price,
          cost: dto.cost,
          stockQuantity: dto.stockQuantity,
          stockAlertThreshold: dto.stockAlertThreshold,
          isDefault: dto.isDefault,
          attributes: dto.attributeValueIds
            ? {
                create: dto.attributeValueIds.map((attributeValueId) => ({
                  attributeValueId,
                })),
              }
            : undefined,
        },
        include: { attributes: { include: { attributeValue: true } } },
      });
    });
  }

  async removeVariant(id: string) {
    await this.findVariant(id);
    await this.prisma.productVariant.delete({ where: { id } });
    return { message: 'Variant deleted successfully' };
  }

  private async enrichWithDiscounts<T extends DiscountableProduct | DiscountableProduct[]>(
    products: T,
  ): Promise<T> {
    const list: DiscountableProduct[] = Array.isArray(products) ? products : [products];
    if (!list.length) return products;

    const now = new Date();
    const discountProducts = await this.prisma.discountProduct.findMany({
      where: {
        productId: { in: list.map(p => p.id).filter(Boolean) },
        discount: {
          status: 'active',
          AND: [
            { OR: [{ startDate: null }, { startDate: { lte: now } }] },
            { OR: [{ endDate: null }, { endDate: { gte: now } }] },
          ],
        },
      },
      include: { discount: true },
    });

    if (!discountProducts.length) return products;

    const discountMap = new Map<string, DiscountCandidate[]>();
    for (const { productId, discount } of discountProducts) {
      const existing = discountMap.get(productId);
      if (existing) existing.push(discount as DiscountCandidate);
      else discountMap.set(productId, [discount as DiscountCandidate]);
    }

    const enriched = list.map(product => {
      const discounts = discountMap.get(product.id);
      if (!discounts?.length) return product;

      const best = this.pickBestDiscount(discounts, product.variants);
      if (!best) return product;

      return {
        ...product,
        discount: {
          id: best.id,
          type: best.type,
          value: Number(best.value),
        } as DiscountAttachment,
        variants: product.variants?.map(v => {
          const price = Number(v.price);
          const { discountAmount, discountedPrice } = this.calculateDiscount(
            price,
            best.type,
            Number(best.value),
          );
          return { ...v, discountAmount, discountedPrice };
        }),
      };
    });

    return (Array.isArray(products) ? enriched : enriched[0]) as T;
  }

  private pickBestDiscount(
    discounts: DiscountCandidate[],
    variants: Array<{ price: number | string | { toNumber(): number } }> | undefined,
  ) {
    if (discounts.length === 1) return discounts[0];
    const lowestPrice = variants?.length
      ? Math.min(...variants.map(v => Number(v.price)))
      : 0;
    return discounts.reduce((best, current) => {
      const amount = (d: DiscountCandidate) =>
        d.type === 'percentage'
          ? lowestPrice * (Number(d.value) / 100)
          : Number(d.value);
      return amount(current) > amount(best) ? current : best;
    });
  }

  private calculateDiscount(price: number, type: 'percentage' | 'fixed', value: number) {
    const discountAmount = type === 'percentage'
      ? price * (value / 100)
      : value;
    const actualDiscount = Math.min(discountAmount, price);
    return {
      discountAmount: Math.round(actualDiscount * 100) / 100,
      discountedPrice: Math.round((price - actualDiscount) * 100) / 100,
    };
  }

  private async ensureBrandCategoryAndUnit(brandId: string, categoryId: string, unitId?: string) {
    const [brand, category, unit] = await Promise.all([
      this.prisma.brand.findUnique({ where: { id: brandId } }),
      this.prisma.category.findUnique({ where: { id: categoryId } }),
      unitId ? (this.prisma as any).unit.findUnique({ where: { id: unitId } }) : null,
    ]);
    if (!brand) throw new BadRequestException(`Brand with ID ${brandId} not found`);
    if (!category) throw new BadRequestException(`Category with ID ${categoryId} not found`);
    if (unitId && !unit) throw new BadRequestException(`Unit with ID ${unitId} not found`);
  }
}
