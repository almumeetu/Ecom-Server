import { Body, Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddWishlistDto } from './dto/wishlist.dto';
import { WishlistService } from './wishlist.service';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Post()
  @ApiOperation({ summary: 'Add product to wishlist' })
  add(@Request() req, @Body() dto: AddWishlistDto) {
    return this.wishlistService.add(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user wishlist' })
  findAll(@Request() req) {
    return this.wishlistService.findAll(req.user.id);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Remove product from wishlist' })
  remove(@Request() req, @Param('productId') productId: string) {
    return this.wishlistService.remove(req.user.id, productId);
  }
}
