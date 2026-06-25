import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsISO8601, IsOptional } from 'class-validator';

export type DashboardPeriod =
  | 'today'
  | 'yesterday'
  | 'week'
  | 'month'
  | 'custom';

export type ChartGranularity = 'daily' | 'monthly' | 'yearly';

export class DashboardQueryDto {
  @ApiPropertyOptional({
    enum: ['today', 'yesterday', 'week', 'month', 'custom'],
    default: 'month',
  })
  @IsOptional()
  @IsIn(['today', 'yesterday', 'week', 'month', 'custom'])
  period?: DashboardPeriod = 'month';

  @ApiPropertyOptional({
    description: 'ISO date, used when period=custom',
    example: '2026-05-01',
  })
  @IsOptional()
  @IsISO8601()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'ISO date, used when period=custom',
    example: '2026-05-31',
  })
  @IsOptional()
  @IsISO8601()
  endDate?: string;

  @ApiPropertyOptional({ enum: ['daily', 'monthly', 'yearly'], default: 'daily' })
  @IsOptional()
  @IsIn(['daily', 'monthly', 'yearly'])
  granularity?: ChartGranularity = 'daily';
}
