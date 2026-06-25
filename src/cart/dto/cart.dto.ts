import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsUUID, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({ example: 'variant-uuid' })
  @IsUUID()
  variantId: string;

  @ApiProperty({ example: 1, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty({ example: 2, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}
