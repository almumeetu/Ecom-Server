import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, productId: string, dto: CreateReviewDto) {
    const product = await this.prisma.product.findFirst({ where: { id: productId, deletedAt: null } });
    if (!product) throw new NotFoundException(`Product with ID ${productId} not found`);
    return this.prisma.review.create({ data: { ...dto, userId, productId } });
  }

  // Admin: every review (approved + pending) with product & author context.
  findAll() {
    return this.prisma.review.findMany({
      include: {
        product: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  productReviews(productId: string) {
    return this.prisma.review.findMany({
      where: { productId, isApproved: true },
      include: { user: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  pending() {
    return this.prisma.review.findMany({
      where: { isApproved: false },
      include: { product: true, user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, dto: UpdateReviewDto) {
    await this.ensureReview(id);
    return this.prisma.review.update({ where: { id }, data: dto });
  }

  async approve(id: string) {
    await this.ensureReview(id);
    return this.prisma.review.update({ where: { id }, data: { isApproved: true } });
  }

  async remove(id: string) {
    await this.ensureReview(id);
    await this.prisma.review.delete({ where: { id } });
    return { message: 'Review deleted successfully' };
  }

  private async ensureReview(id: string) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException(`Review with ID ${id} not found`);
    return review;
  }
}
