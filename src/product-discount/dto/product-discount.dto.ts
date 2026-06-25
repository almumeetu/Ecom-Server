import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsIn, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateProductDiscountDto {
  @ApiProperty({ example: 'Summer Sale 2026' })
  @IsString()
  name: string;

  @ApiProperty({ enum: ['percentage', 'fixed'] })
  @IsIn(['percentage', 'fixed'])
  type: 'percentage' | 'fixed';

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  value: number;

  @ApiProperty({ type: [String], example: ['product-uuid-1', 'product-uuid-2'] })
  @IsArray()
  @IsUUID(undefined, { each: true })
  productIds: string[];

  @ApiPropertyOptional({ example: '2026-06-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-08-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive'], default: 'active' })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';
}

export class ListProductDiscountsQueryDto {
  @ApiPropertyOptional({ description: 'Search by discount name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  limit?: number = 20;
}

export class UpdateProductDiscountDto extends PartialType(CreateProductDiscountDto) {}
