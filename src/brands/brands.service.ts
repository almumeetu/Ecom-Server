import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class BrandsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) { }

  async create(createBrandDto: CreateBrandDto, file?: Express.Multer.File) {
    let logoUrl = createBrandDto.logoUrl;

    if (file) {
      logoUrl = await this.uploadService.uploadFile(file, 'brands');
    }

    return this.prisma.brand.create({
      data: {
        ...createBrandDto,
        logoUrl,
      },
    });
  }

  findAll() {
    return this.prisma.brand.findMany();
  }

  async findOne(id: string) {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto, file?: Express.Multer.File) {
    const existingBrand = await this.findOne(id);
    let logoUrl: string | null | undefined = updateBrandDto.logoUrl;

    if (file) {
      // Delete old logo if it exists
      if (existingBrand.logoUrl) {
        await this.uploadService.deleteFile(existingBrand.logoUrl);
      }
      logoUrl = await this.uploadService.uploadFile(file, 'brands');
    } else if (updateBrandDto.logoUrl === '') {
      if (existingBrand.logoUrl) {
        await this.uploadService.deleteFile(existingBrand.logoUrl);
      }
      logoUrl = null;
    }

    return this.prisma.brand.update({
      where: { id },
      data: {
        ...updateBrandDto,
        logoUrl,
      },
    });
  }

  async uploadLogo(id: string, file: Express.Multer.File) {
    const existingBrand = await this.findOne(id);

    // Delete old logo if it exists
    if (existingBrand.logoUrl) {
      await this.uploadService.deleteFile(existingBrand.logoUrl);
    }

    const logoUrl = await this.uploadService.uploadFile(file, 'brands');

    return this.prisma.brand.update({
      where: { id },
      data: { logoUrl },
    });
  }

  async remove(id: string) {
    const brand = await this.findOne(id);

    // Delete logo if it exists
    if (brand.logoUrl) {
      await this.uploadService.deleteFile(brand.logoUrl);
    }

    return this.prisma.brand.delete({
      where: { id },
    });
  }
}
