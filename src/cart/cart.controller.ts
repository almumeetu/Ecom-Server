import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddCartItemDto, UpdateCartItemDto } from './dto/cart.dto';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user cart' })
  getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  addItem(@Request() req, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(req.user.id, dto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update cart item quantity' })
  updateItem(@Request() req, @Param('id') id: string, @Body() dto: UpdateCartItemDto) {
    return this.cartService.updateItem(req.user.id, id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Remove item from cart' })
  removeItem(@Request() req, @Param('id') id: string) {
    return this.cartService.removeItem(req.user.id, id);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear cart' })
  clear(@Request() req) {
    return this.cartService.clear(req.user.id);
  }
}
