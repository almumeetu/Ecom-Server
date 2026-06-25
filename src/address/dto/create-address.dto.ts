import { IsString, IsOptional, IsBoolean, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty({ description: 'Full name for the address' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Address line 1' })
  @IsString()
  @IsNotEmpty()
  addressLine1: string;

  @ApiPropertyOptional({ description: 'Address line 2 (optional)' })
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'State/Province' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'Postal/ZIP code' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty({ description: 'Country' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiPropertyOptional({ description: 'Set as default address', default: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
