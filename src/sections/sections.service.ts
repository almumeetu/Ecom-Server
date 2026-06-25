import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateSectionDto) {
    return (this.prisma as any).section.create({ data: dto });
  }

  findAll() {
    return (this.prisma as any).section.findMany({
      orderBy: { position: 'asc' },
    });
  }

  async findOne(id: string) {
    const section = await (this.prisma as any).section.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    return section;
  }

  async update(id: string, dto: UpdateSectionDto) {
    await this.findOne(id);
    return (this.prisma as any).section.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return (this.prisma as any).section.delete({ where: { id } });
  }
}
