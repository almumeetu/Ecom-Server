import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto, UpdateUnitDto } from './dto/unit.dto';

@Injectable()
export class UnitService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUnitDto) {
    const existing = await (this.prisma as any).unit.findUnique({
      where: { code: dto.code },
    });

    if (existing) {
      throw new ConflictException('Unit code already exists');
    }

    return (this.prisma as any).unit.create({
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        isActive: dto.isActive ?? true,
      },
      include: { _count: { select: { products: true } } },
    });
  }

  findAll() {
    return (this.prisma as any).unit.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { products: true } } },
    });
  }

  async findOne(id: string) {
    const unit = await (this.prisma as any).unit.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });

    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    return unit;
  }

  async update(id: string, dto: UpdateUnitDto) {
    await this.findOne(id);

    if (dto.code) {
      const existing = await (this.prisma as any).unit.findUnique({
        where: { code: dto.code },
      });

      if (existing && existing.id !== id) {
        throw new ConflictException('Unit code already exists');
      }
    }

    return (this.prisma as any).unit.update({
      where: { id },
      data: dto,
      include: { _count: { select: { products: true } } },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return (this.prisma as any).unit.delete({ where: { id } });
  }
}
