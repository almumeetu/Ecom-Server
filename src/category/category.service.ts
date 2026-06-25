import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly uploadService: UploadService,
  ) {}

  async create(
    createCategoryDto: CreateCategoryDto,
    image?: Express.Multer.File,
  ) {
    const {
      parentId,
      imageUrl: _imageUrl,
      image: _image,
      ...data
    } = createCategoryDto;
    // Only set imageUrl when an actual image file is uploaded; otherwise null.
    let finalImageUrl: string | null = null;

    // If parentId is provided, validate that the parent category exists
    if (parentId) {
      const parentCategory = await this.prisma.category.findUnique({
        where: { id: parentId },
      });

      if (!parentCategory) {
        throw new BadRequestException(
          `Parent category with ID ${parentId} not found`,
        );
      }
    }

    if (image) {
      finalImageUrl = await this.uploadService.uploadFile(image, 'categories');
    }

    try {
      return await this.prisma.category.create({
        data: {
          ...data,
          imageUrl: finalImageUrl,
          parent: parentId
            ? {
                connect: { id: parentId },
              }
            : undefined,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `A category with slug "${data.slug}" already exists`,
        );
      }
      throw error;
    }
  }

  findAll() {
    return this.prisma.category.findMany({
      where: {
        parentId: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        children: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            children: {
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        },
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
    image?: Express.Multer.File,
  ) {
    const existingCategory = await this.findOne(id);
    const { parentId, imageUrl, image: _image, ...data } = updateCategoryDto;
    let finalImageUrl: string | null | undefined = imageUrl;

    // If parentId is provided, validate that the parent category exists
    if (parentId !== undefined) {
      if (parentId) {
        const parentCategory = await this.prisma.category.findUnique({
          where: { id: parentId },
        });

        if (!parentCategory) {
          throw new BadRequestException(
            `Parent category with ID ${parentId} not found`,
          );
        }
      }
    }

    if (image) {
      // Delete old image if it exists
      if (existingCategory.imageUrl) {
        await this.uploadService.deleteFile(existingCategory.imageUrl);
      }
      finalImageUrl = await this.uploadService.uploadFile(image, 'categories');
    } else if (imageUrl === '') {
      if (existingCategory.imageUrl) {
        await this.uploadService.deleteFile(existingCategory.imageUrl);
      }
      finalImageUrl = null;
    }

    try {
      return await this.prisma.category.update({
        where: {
          id,
        },
        data: {
          ...data,
          imageUrl: finalImageUrl,
          parent:
            parentId !== undefined
              ? parentId
                ? {
                    connect: { id: parentId },
                  }
                : {
                    disconnect: true,
                  }
              : undefined,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `A category with slug "${data.slug}" already exists`,
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    // Delete image if it exists
    if (category.imageUrl) {
      await this.uploadService.deleteFile(category.imageUrl);
    }

    return this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
