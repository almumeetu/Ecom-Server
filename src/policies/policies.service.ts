import { Injectable } from '@nestjs/common';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PoliciesService {
  constructor(private readonly prisma: PrismaService) {}

  async findFirst() {
    return this.prisma.policy.findFirst();
  }

  async upsert(dto: UpdatePolicyDto) {
    const policy = await this.findFirst();

    if (!policy) {
      return this.prisma.policy.create({ data: dto as any });
    }

    return this.prisma.policy.update({
      where: { id: policy.id },
      data: dto,
    });
  }
}
