import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class WholesaleRequestItemDto {
  @ApiProperty({ example: 'product-uuid' })
  @IsUUID()
  productId: string;

  @ApiPropertyOptional({ example: 'variant-uuid', description: 'Defaults to the product default variant if omitted' })
  @IsOptional()
  @IsUUID()
  variantId?: string;

  @ApiProperty({ example: 100, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  requestedQuantity: number;

  @ApiPropertyOptional({ example: 9.5, description: "Customer's desired unit price (advisory)" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  targetPrice?: number;

  @ApiPropertyOptional({ example: 'Need delivery before end of month' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class CreateWholesaleOrderRequestDto {
  @ApiPropertyOptional({ example: 'Looking for bulk pricing on these items' })
  @IsOptional()
  @IsString()
  customerNote?: string;

  @ApiPropertyOptional({ example: '+8801XXXXXXXXX', description: 'Defaults to the customer account phone' })
  @IsOptional()
  @IsString()
  contactPhone?: string;

  @ApiProperty({ type: [WholesaleRequestItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => WholesaleRequestItemDto)
  items: WholesaleRequestItemDto[];
}

export class UpdateWholesaleRequestStatusDto {
  @ApiProperty({ enum: ['approved', 'rejected', 'info_requested'] })
  @IsIn(['approved', 'rejected', 'info_requested'])
  status: 'approved' | 'rejected' | 'info_requested';

  @ApiPropertyOptional({
    description: 'Admin note, or the message sent to the customer when requesting more information',
  })
  @IsOptional()
  @IsString()
  note?: string;
}

export class ConvertOrderItemDto {
  @ApiPropertyOptional({ description: 'WholesaleOrderRequestItem id to base this line on' })
  @IsOptional()
  @IsUUID()
  requestItemId?: string;

  @ApiPropertyOptional({ example: 'product-uuid', description: 'Required when requestItemId is not provided' })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiPropertyOptional({ example: 'variant-uuid' })
  @IsOptional()
  @IsUUID()
  variantId?: string;

  @ApiProperty({ example: 100, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 9.25, description: 'Admin-set wholesale unit price' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  unitPrice: number;
}

export class ConvertToOrderDto {
  @ApiProperty({ example: 'address-uuid', description: "Must belong to the request's customer" })
  @IsUUID()
  addressId: string;

  @ApiProperty({ type: [ConvertOrderItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ConvertOrderItemDto)
  items: ConvertOrderItemDto[];

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  discount?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  shippingCost?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  tax?: number;

  @ApiPropertyOptional({ enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' })
  @IsOptional()
  @IsIn(['unpaid', 'paid', 'refunded'])
  paymentStatus?: 'unpaid' | 'paid' | 'refunded';
}

export class ListWholesaleRequestsQueryDto {
  @ApiPropertyOptional({
    enum: ['pending', 'info_requested', 'approved', 'rejected', 'converted'],
  })
  @IsOptional()
  @IsIn(['pending', 'info_requested', 'approved', 'rejected', 'converted'])
  status?: 'pending' | 'info_requested' | 'approved' | 'rejected' | 'converted';
}
