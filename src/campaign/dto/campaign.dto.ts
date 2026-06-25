import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDateString, IsIn, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCampaignDto {
  @ApiProperty({ example: 'Summer Sale 2026' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Big discounts on summer collection' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  sectionId: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  hasDiscount?: boolean;

  @ApiPropertyOptional({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsOptional()
  @IsUUID()
  discountId?: string;

  @ApiPropertyOptional({ example: '2026-06-01T00:00:00.000Z', description: 'Defaults to now()' })
  @IsOptional()
  @IsDateString()
  startAt?: string;

  @ApiPropertyOptional({ example: '2026-08-31T23:59:59.000Z', description: 'If omitted, campaign continues until status change' })
  @IsOptional()
  @IsDateString()
  endAt?: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive'], default: 'active' })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    required: false,
  })
  @IsOptional()
  images?: any;
}

export class UpdateCampaignDto extends PartialType(CreateCampaignDto) {
  @ApiPropertyOptional({ description: 'JSON array of image URLs to keep during update' })
  @IsOptional()
  @IsString()
  keepImages?: string;
}
