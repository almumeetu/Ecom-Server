import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { ProductDiscountService } from '../product-discount/product-discount.service';
import { CreateCampaignDto, UpdateCampaignDto } from './dto/campaign.dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status.dto';

@Injectable()
export class CampaignService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
    private readonly productDiscountService: ProductDiscountService,
  ) {}

  async create(dto: CreateCampaignDto, files?: Express.Multer.File[]) {
    await this.validateSection(dto.sectionId);

    if (dto.hasDiscount) {
      if (!dto.discountId) {
        throw new BadRequestException('discountId is required when hasDiscount is true');
      }
      await this.validateDiscount(dto.discountId);
    }

    const startAt = dto.startAt ? new Date(dto.startAt) : new Date();
    const endAt = dto.endAt ? new Date(dto.endAt) : null;

    if (endAt && endAt <= startAt) {
      throw new BadRequestException('End date must be after start date');
    }

    let imageUrls: string[] = [];
    if (files && files.length > 0) {
      imageUrls = await Promise.all(
        files.map((file) => this.uploadService.uploadFile(file, 'campaigns')),
      );
    }

    const data: any = {
      title: dto.title,
      description: dto.description,
      hasDiscount: dto.hasDiscount ?? false,
      startAt,
      endAt,
      status: dto.status ?? 'active',
      section: { connect: { id: dto.sectionId } },
    };

    if (dto.hasDiscount && dto.discountId) {
      data.discount = { connect: { id: dto.discountId } };
    }

    if (imageUrls.length > 0) {
      data.images = { create: { images: imageUrls } };
    }

    return this.prisma.campaign.create({
      data,
      include: {
        section: true,
        images: true,
        discount: {
          include: { products: { include: { product: { include: { variants: { orderBy: { price: 'asc' as const } } } } } } },
        },
      },
    });
  }

  findAll() {
    return this.prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        section: true,
        images: true,
        discount: true,
      },
    });
  }

  async findOne(id: string) {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        section: true,
        images: true,
        discount: {
          include: { products: { include: { product: { include: { variants: { orderBy: { price: 'asc' as const } } } } } } },
        },
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID ${id} not found`);
    }

    return campaign;
  }

  async update(id: string, dto: UpdateCampaignDto, files?: Express.Multer.File[]) {
    await this.findOne(id);

    if (dto.sectionId) {
      await this.validateSection(dto.sectionId);
    }

    if (dto.hasDiscount) {
      if (!dto.discountId) {
        throw new BadRequestException('discountId is required when hasDiscount is true');
      }
      await this.validateDiscount(dto.discountId);
    }

    if (dto.startAt && dto.endAt && new Date(dto.endAt) <= new Date(dto.startAt)) {
      throw new BadRequestException('End date must be after start date');
    }

    const data: any = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.hasDiscount !== undefined) data.hasDiscount = dto.hasDiscount;
    if (dto.discountId !== undefined) {
      data.discount = dto.hasDiscount
        ? { connect: { id: dto.discountId } }
        : { disconnect: true };
    }
    if (dto.startAt !== undefined) data.startAt = new Date(dto.startAt);
    if (dto.endAt !== undefined) data.endAt = dto.endAt ? new Date(dto.endAt) : null;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.sectionId !== undefined) data.section = { connect: { id: dto.sectionId } };

    if (dto.keepImages !== undefined || (files && files.length > 0)) {
      let keepUrls: string[] = [];
      if (dto.keepImages) {
        try { keepUrls = JSON.parse(dto.keepImages); } catch {}
      }

      const existingCampaignImages = await this.prisma.campaignImage.findMany({ where: { campaignId: id } });
      for (const img of existingCampaignImages) {
        const urls: string[] = (img.images as string[]) || [];
        for (const url of urls) {
          if (!keepUrls.includes(url)) {
            await this.uploadService.deleteFile(url).catch(() => {});
          }
        }
      }
      await this.prisma.campaignImage.deleteMany({ where: { campaignId: id } });

      const newUrls = files?.length
        ? await Promise.all(files.map((file) => this.uploadService.uploadFile(file, 'campaigns')))
        : [];

      const allUrls = [...keepUrls, ...newUrls];
      if (allUrls.length > 0) {
        data.images = { create: { images: allUrls } };
      }
    }

    return this.prisma.campaign.update({
      where: { id },
      data,
      include: {
        section: true,
        images: true,
        discount: {
          include: { products: { include: { product: { include: { variants: { orderBy: { price: 'asc' as const } } } } } } },
        },
      },
    });
  }

  async changeStatus(id: string, dto: UpdateCampaignStatusDto) {
    await this.findOne(id);

    return this.prisma.campaign.update({
      where: { id },
      data: { status: dto.status },
      include: {
        section: true,
        images: true,
        discount: true,
      },
    });
  }

  async remove(id: string) {
    const campaign = await this.findOne(id);

    const existingImages = await this.prisma.campaignImage.findMany({ where: { campaignId: id } });
    for (const img of existingImages) {
      const urls: string[] = (img.images as string[]) || [];
      for (const url of urls) {
        await this.uploadService.deleteFile(url).catch(() => {});
      }
    }
    await this.prisma.campaignImage.deleteMany({ where: { campaignId: id } });

    await this.prisma.campaign.delete({ where: { id } });
    return { message: 'Campaign deleted successfully' };
  }

  getSections() {
    return this.prisma.section.findMany({
      orderBy: { position: 'asc' },
    });
  }

  private async validateSection(sectionId: string) {
    const section = await this.prisma.section.findUnique({ where: { id: sectionId } });
    if (!section) {
      throw new NotFoundException(`Section with ID ${sectionId} not found`);
    }
  }

  private async validateDiscount(discountId: string) {
    try {
      await this.productDiscountService.findOne(discountId);
    } catch {
      throw new NotFoundException(`Product discount with ID ${discountId} not found`);
    }
  }
}
