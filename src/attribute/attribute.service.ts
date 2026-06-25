import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAttributeDto,
  CreateAttributeValueDto,
  UpdateAttributeDto,
  UpdateAttributeValueDto,
} from './dto/attribute.dto';

@Injectable()
export class AttributeService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateAttributeDto) {
    return this.prisma.attribute.create({ data: dto });
  }

  findAll() {
    return this.prisma.attribute.findMany({ include: { values: true } });
  }

  async findOne(id: string) {
    const attribute = await this.prisma.attribute.findUnique({
      where: { id },
      include: { values: true },
    });
    if (!attribute) throw new NotFoundException(`Attribute with ID ${id} not found`);
    return attribute;
  }

  async update(id: string, dto: UpdateAttributeDto) {
    await this.findOne(id);
    return this.prisma.attribute.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.attribute.delete({ where: { id } });
    return { message: 'Attribute deleted successfully' };
  }

  async createValue(attributeId: string, dto: CreateAttributeValueDto) {
    await this.findOne(attributeId);
    return this.prisma.attributeValue.create({ data: { ...dto, attributeId } });
  }

  listValues(attributeId: string) {
    return this.prisma.attributeValue.findMany({ where: { attributeId } });
  }

  async updateValue(id: string, dto: UpdateAttributeValueDto) {
    const value = await this.prisma.attributeValue.findUnique({ where: { id } });
    if (!value) throw new NotFoundException(`Attribute value with ID ${id} not found`);
    return this.prisma.attributeValue.update({ where: { id }, data: dto });
  }

  async removeValue(id: string) {
    const value = await this.prisma.attributeValue.findUnique({ where: { id } });
    if (!value) throw new NotFoundException(`Attribute value with ID ${id} not found`);
    await this.prisma.attributeValue.delete({ where: { id } });
    return { message: 'Attribute value deleted successfully' };
  }
}
