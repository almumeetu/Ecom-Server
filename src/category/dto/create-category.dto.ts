import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Electronics',
    default: 'New Category',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  name: string;

  @ApiProperty({
    description: 'Category slug for URL',
    example: 'electronics',
    default: 'new-category',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  slug: string;

  @ApiProperty({
    description: 'Parent category ID for nested categories',
    example: '1',
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => value === '' ? null : value)
  parentId?: string | null;

  @ApiProperty({
    description: 'Category image file',
    required: false,
    type: 'string',
    format: 'binary'
  })
  @IsOptional()
  image?: Express.Multer.File;

  @ApiProperty({
    description: 'Image URL to remove (set to empty string to remove)',
    required: false,
    nullable: true
  })
  @IsString()
  @IsOptional()
  imageUrl?: string | null;
}
