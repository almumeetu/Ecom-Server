import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export enum ReportFormat {
  JSON = 'json',
  CSV = 'csv',
  PDF = 'pdf',
}

export class ReportQueryDto {
  @ApiPropertyOptional({ description: 'Start date (ISO format)', example: '2026-01-01' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'End date (ISO format)', example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 20, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ enum: ReportFormat, default: ReportFormat.JSON })
  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat;
}
