import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateCouponDto {
  @ApiProperty({ example: 'EID20' })
  @IsString()
  code: string;

  @ApiProperty({ enum: ['percentage', 'fixed'] })
  @IsIn(['percentage', 'fixed'])
  type: 'percentage' | 'fixed';

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsNumber()
  value: number;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  maxUsage: number;

  @ApiPropertyOptional({ example: '2026-12-31T23:59:59.000Z' })
  @IsOptional()
  @IsDateString()
  expiresAt?: string;
}

export class UpdateCouponDto extends PartialType(CreateCouponDto) {}

export class ApplyCouponDto {
  @ApiProperty({ example: 'EID20' })
  @IsString()
  code: string;

  @ApiProperty({ example: 1000 })
  @Type(() => Number)
  @IsNumber()
  subtotal: number;
}
