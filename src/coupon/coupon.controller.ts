import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CouponService } from './coupon.service';
import { ApplyCouponDto, CreateCouponDto, UpdateCouponDto } from './dto/coupon.dto';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post()
  @ApiOperation({ summary: 'Create coupon' })
  create(@Body() dto: CreateCouponDto) {
    return this.couponService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List coupons' })
  findAll() {
    return this.couponService.findAll();
  }

  @Get(':code')
  @ApiOperation({ summary: 'Get coupon by code' })
  findByCode(@Param('code') code: string) {
    return this.couponService.findByCode(code);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update coupon' })
  update(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
    return this.couponService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete coupon' })
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }

  @Post('apply')
  @ApiOperation({ summary: 'Apply coupon to a subtotal' })
  apply(@Body() dto: ApplyCouponDto) {
    return this.couponService.apply(dto);
  }
}
