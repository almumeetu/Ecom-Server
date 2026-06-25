import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTagDto) {
    const existing = await (this.prisma as any).tag.findUnique({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new ConflictException('Tag slug already exists');
    }

    return (this.prisma as any).tag.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
      include: { _count: { select: { products: true } } },
    });
  }

  findAll() {
    return (this.prisma as any).tag.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { products: true } } },
    });
  }

  async findOne(id: string) {
    const tag = await (this.prisma as any).tag.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  async update(id: string, dto: UpdateTagDto) {
    await this.findOne(id);

    if (dto.slug) {
      const existing = await (this.prisma as any).tag.findUnique({
        where: { slug: dto.slug },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Tag slug already exists');
      }
    }

    return (this.prisma as any).tag.update({
      where: { id },
      data: dto,
      include: { _count: { select: { products: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return (this.prisma as any).tag.delete({ where: { id } });
  }
}
