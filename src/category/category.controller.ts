import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiBadRequestResponse, ApiBody, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { CategoryResponseDto } from './dto/category-response.dto';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @ApiOperation({ summary: 'Create a new category' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Electronics' },
        slug: { type: 'string', example: 'electronics' },
        parentId: { type: 'string', example: '1', nullable: true },
        image: { type: 'string', format: 'binary' },
        imageUrl: { type: 'string', nullable: true }
      },
      required: ['name', 'slug']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Category created successfully',
    type: CategoryResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data',
  })
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(@Body() createCategoryDto: CreateCategoryDto, @UploadedFile() image?: Express.Multer.File) {
    console.log('Hello Create category api', createCategoryDto, image)
    return this.categoryService.create(createCategoryDto, image);
  }

  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
    type: [CategoryResponseDto],
  })
  @Get()
  findAll() {
    return this.categoryService.findAll();
  }

  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: CategoryResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid category ID',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @ApiOperation({ summary: 'Update category by ID' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Electronics' },
        slug: { type: 'string', example: 'updated-electronics' },
        parentId: { type: 'string', example: '2', nullable: true },
        image: { type: 'string', format: 'binary' },
        imageUrl: { type: 'string', nullable: true }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: CategoryResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data or category ID',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @UploadedFile() image?: Express.Multer.File) {
    return this.categoryService.update(id, updateCategoryDto, image);
  }

  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid category ID',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
