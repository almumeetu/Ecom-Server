import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  CreateProductMediaDto,
  CreateVariantDto,
  ProductQueryDto,
  UpdateProductDto,
  UpdateProductMediaDto,
  UpdateVariantDto,
} from './dto/product.dto';

@ApiTags('Products')
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('products')
  @ApiOperation({ summary: 'Create product' })
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Get('products')
  @ApiOperation({ summary: 'Get products with search, filters, and pagination' })
  findAll(@Query() query: ProductQueryDto) {
    return this.productService.findAll(query);
  }

  @Get('products/slug/:slug')
  @ApiOperation({ summary: 'Get product by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Get('products/:id')
  @ApiOperation({ summary: 'Get product by ID' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch('products/:id')
  @ApiOperation({ summary: 'Update product' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete('products/:id')
  @ApiOperation({ summary: 'Soft delete product' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Post('products/:productId/media')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload product media. Local storage is default; set STORAGE_PROVIDER=s3 for S3.' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'productId' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        type: { type: 'string', enum: ['image', 'video'], default: 'image' },
        isFeatured: { type: 'boolean', default: false },
        sortOrder: { type: 'number', default: 0 },
      },
      required: ['file'],
    },
  })
  addMedia(
    @Param('productId') productId: string,
    @Body() dto: CreateProductMediaDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.addMedia(productId, dto, file);
  }

  @Get('products/:productId/media')
  @ApiOperation({ summary: 'List product media' })
  listMedia(@Param('productId') productId: string) {
    return this.productService.listMedia(productId);
  }

  @Patch('product-media/:id')
  @ApiOperation({ summary: 'Update product media flags/order' })
  updateMedia(@Param('id') id: string, @Body() dto: UpdateProductMediaDto) {
    return this.productService.updateMedia(id, dto);
  }

  @Delete('product-media/:id')
  @ApiOperation({ summary: 'Delete product media and uploaded file' })
  removeMedia(@Param('id') id: string) {
    return this.productService.removeMedia(id);
  }

  @Post('products/:productId/variants')
  @ApiOperation({ summary: 'Create product variant' })
  createVariant(@Param('productId') productId: string, @Body() dto: CreateVariantDto) {
    return this.productService.createVariant(productId, dto);
  }

  @Get('products/:productId/variants')
  @ApiOperation({ summary: 'List product variants' })
  listVariants(@Param('productId') productId: string) {
    return this.productService.listVariants(productId);
  }

  @Get('variants/:id')
  @ApiOperation({ summary: 'Get variant by ID' })
  findVariant(@Param('id') id: string) {
    return this.productService.findVariant(id);
  }

  @Patch('variants/:id')
  @ApiOperation({ summary: 'Update variant' })
  updateVariant(@Param('id') id: string, @Body() dto: UpdateVariantDto) {
    return this.productService.updateVariant(id, dto);
  }

  @Delete('variants/:id')
  @ApiOperation({ summary: 'Delete variant' })
  removeVariant(@Param('id') id: string) {
    return this.productService.removeVariant(id);
  }
}
