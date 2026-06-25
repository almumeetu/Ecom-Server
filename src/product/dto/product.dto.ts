import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateVariantDto {
  @ApiProperty({ example: 'IPHONE15PRO-128-BLACK' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({ example: 1199.99 })
  @Type(() => Number)
  @IsNumber()
  price: number;

  @ApiPropertyOptional({ example: 900 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  cost?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  stockQuantity?: number;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  stockAlertThreshold?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ type: [String], description: 'Attribute value UUIDs' })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  attributeValueIds?: string[];
}

export class CreateProductDto {
  @ApiProperty({ example: 'iPhone 15 Pro' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'iphone-15-pro' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiPropertyOptional({ example: 'Premium Apple smartphone' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive', 'draft'], default: 'draft' })
  @IsOptional()
  @IsIn(['active', 'inactive', 'draft'])
  status?: 'active' | 'inactive' | 'draft';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaDescription?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @ApiProperty({ example: 'brand-uuid' })
  @IsUUID()
  brandId: string;

  @ApiProperty({ example: 'category-uuid' })
  @IsUUID()
  categoryId: string;

  @ApiPropertyOptional({ example: 'unit-uuid' })
  @IsOptional()
  @IsUUID()
  unitId?: string;

  @ApiPropertyOptional({ type: [String], description: 'Tag UUIDs' })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  tagIds?: string[];

  @ApiPropertyOptional({ type: [CreateVariantDto], description: 'Initial variants' })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateVariantDto)
  variants?: CreateVariantDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive', 'draft'] })
  @IsOptional()
  @IsIn(['active', 'inactive', 'draft'])
  status?: 'active' | 'inactive' | 'draft';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}

export class CreateProductMediaDto {
  @ApiPropertyOptional({ enum: ['image', 'video'], default: 'image' })
  @IsOptional()
  @IsIn(['image', 'video'])
  type?: 'image' | 'video';

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}

export class UpdateProductMediaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;
}

export class UpdateVariantDto extends PartialType(CreateVariantDto) {}
