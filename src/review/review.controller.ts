import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { ReviewService } from './review.service';

@ApiTags('Reviews')
@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('products/:productId/reviews')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create product review' })
  create(@Request() req, @Param('productId') productId: string, @Body() dto: CreateReviewDto) {
    return this.reviewService.create(req.user.id, productId, dto);
  }

  @Get('products/:productId/reviews')
  @ApiOperation({ summary: 'Get approved product reviews' })
  productReviews(@Param('productId') productId: string) {
    return this.reviewService.productReviews(productId);
  }

  @Get('reviews')
  @ApiOperation({ summary: 'Get all reviews (admin)' })
  findAll() {
    return this.reviewService.findAll();
  }

  @Get('reviews/pending')
  @ApiOperation({ summary: 'Get pending reviews' })
  pending() {
    return this.reviewService.pending();
  }

  @Patch('reviews/:id')
  @ApiOperation({ summary: 'Update review' })
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewService.update(id, dto);
  }

  @Patch('reviews/:id/approve')
  @ApiOperation({ summary: 'Approve review' })
  approve(@Param('id') id: string) {
    return this.reviewService.approve(id);
  }

  @Delete('reviews/:id')
  @ApiOperation({ summary: 'Delete review' })
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
