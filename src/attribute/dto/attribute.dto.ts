import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAttributeDto {
  @ApiProperty({ example: 'Color' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateAttributeDto extends PartialType(CreateAttributeDto) {}

export class CreateAttributeValueDto {
  @ApiProperty({ example: 'Black' })
  @IsString()
  @IsNotEmpty()
  value: string;
}

export class UpdateAttributeValueDto extends PartialType(CreateAttributeValueDto) {}
