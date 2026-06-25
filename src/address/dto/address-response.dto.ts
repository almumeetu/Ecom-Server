import { ApiProperty } from '@nestjs/swagger';

export class AddressResponseDto {
  @ApiProperty({ description: 'Address ID' })
  id: string;

  @ApiProperty({ description: 'Full name' })
  fullName: string;

  @ApiProperty({ description: 'Phone number' })
  phone: string;

  @ApiProperty({ description: 'Address line 1' })
  addressLine1: string;

  @ApiProperty({ description: 'Address line 2', nullable: true })
  addressLine2?: string;

  @ApiProperty({ description: 'City' })
  city: string;

  @ApiProperty({ description: 'State' })
  state: string;

  @ApiProperty({ description: 'Postal code' })
  postalCode: string;

  @ApiProperty({ description: 'Country' })
  country: string;

  @ApiProperty({ description: 'Is default address', default: false })
  isDefault: boolean;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;
}
