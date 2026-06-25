import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseUUIDPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) { }

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        slug: { type: 'string' },
        logo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  create(@Body() createBrandDto: CreateBrandDto, @UploadedFile() file: Express.Multer.File) {
    return this.brandsService.create(createBrandDto, file);
  }

  @Post(':id/upload-logo')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        logo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  uploadLogo(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandsService.uploadLogo(id, file);
  }

  @Get()
  findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        slug: { type: 'string' },
        logo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandsService.update(id, updateBrandDto, file);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.brandsService.remove(id);
  }
}
