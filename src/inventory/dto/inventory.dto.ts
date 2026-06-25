import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class ListInventoryQueryDto {
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

  @ApiPropertyOptional({ enum: ['lowStock'], description: 'Sort low-stock variants first' })
  @IsOptional()
  @IsIn(['lowStock'])
  sort?: 'lowStock';
}

export class AdjustInventoryDto {
  @ApiPropertyOptional({ example: 'variant-uuid' })
  @IsOptional()
  @IsUUID()
  variantId?: string;

  @ApiPropertyOptional({ example: 'product-uuid' })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty({ example: 10, description: 'Positive for restock, negative for reduction' })
  @Type(() => Number)
  @IsInt()
  change: number;

  @ApiProperty({ enum: ['sale', 'restock', 'return', 'correction', 'manual'] })
  @IsIn(['sale', 'restock', 'return', 'correction', 'manual'])
  reason: 'sale' | 'restock' | 'return' | 'correction' | 'manual';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  referenceId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
