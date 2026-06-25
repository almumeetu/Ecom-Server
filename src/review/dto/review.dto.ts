import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 5, minimum: 1, maximum: 5 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @ApiPropertyOptional({ description: 'Approve or un-approve the review' })
  @IsOptional()
  @IsBoolean()
  isApproved?: boolean;
}
