import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';

const userSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  role: {
    select: {
      id: true,
      name: true,
      permissions: { select: { id: true, name: true } },
    },
  },
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        phone: dto.phone,
        roleId: dto.roleId,
      },
      select: userSelect,
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: userSelect,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        phone: true,
        role: {
          select: {
            id: true,
            name: true,
            permissions: { select: { id: true, name: true } },
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const existing = await this.findOne(id);

    if (
      existing.role?.name === 'superadmin' &&
      dto.roleId !== undefined &&
      dto.roleId !== existing.role.id
    ) {
      throw new BadRequestException('A superadmin account cannot be demoted to another role');
    }

    const data: any = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.email !== undefined) data.email = dto.email;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.roleId !== undefined) data.roleId = dto.roleId;
    if (dto.password !== undefined) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: userSelect,
    });
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    if (user.role?.name === 'superadmin') {
      throw new BadRequestException('Superadmin accounts cannot be deleted');
    }
    await this.prisma.user.delete({ where: { id } });
    return { message: 'User deleted successfully' };
  }
}
