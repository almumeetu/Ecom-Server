import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class AddWishlistDto {
  @ApiProperty({ example: 'product-uuid' })
  @IsUUID()
  productId: string;
}
