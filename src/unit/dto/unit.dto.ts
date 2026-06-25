import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUnitDto {
  @ApiProperty({ example: 'Pieces' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'pcs' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Default sellable product unit', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateUnitDto extends PartialType(CreateUnitDto) {}
