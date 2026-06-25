import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductDiscountService } from './product-discount.service';
import { CreateProductDiscountDto, ListProductDiscountsQueryDto, UpdateProductDiscountDto } from './dto/product-discount.dto';

@ApiTags('Product Discounts')
@Controller('product-discounts')
export class ProductDiscountController {
  constructor(private readonly productDiscountService: ProductDiscountService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product discount' })
  create(@Body() dto: CreateProductDiscountDto) {
    return this.productDiscountService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List product discounts with pagination' })
  findAll(@Query() query: ListProductDiscountsQueryDto) {
    return this.productDiscountService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product discount by ID' })
  findOne(@Param('id') id: string) {
    return this.productDiscountService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product discount' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDiscountDto) {
    return this.productDiscountService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete product discount' })
  remove(@Param('id') id: string) {
    return this.productDiscountService.remove(id);
  }
}
