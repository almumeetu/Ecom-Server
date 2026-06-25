import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateShipmentDto {
  @ApiProperty()
  @IsUUID()
  orderId: string;

  @ApiProperty({ example: 'Pathao' })
  @IsString()
  courierName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  trackingNumber?: string;
}

export class UpdateShipmentDto extends PartialType(CreateShipmentDto) {}
