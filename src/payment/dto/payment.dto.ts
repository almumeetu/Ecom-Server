import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class InitiatePaymentDto {
  @ApiProperty({ example: 'order-uuid' })
  @IsUUID()
  orderId: string;

  @ApiProperty({ example: 'cod' })
  @IsString()
  method: string;
}

export class ConfirmPaymentDto {
  @ApiProperty({ example: 'payment-uuid' })
  @IsUUID()
  paymentId: string;

  @ApiProperty({ enum: ['pending', 'success', 'failed'] })
  @IsIn(['pending', 'success', 'failed'])
  status: 'pending' | 'success' | 'failed';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionId?: string;
}

export class CreateManualPaymentDto {
  @ApiProperty({ example: 'order-uuid' })
  @IsUUID()
  orderId: string;

  @ApiProperty({ example: 1000 })
  @Type(() => Number)
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'cod' })
  @IsString()
  method: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  transactionId?: string;
}
