import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ example: 'Summer Drop' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'summer-drop' })
  @IsString()
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ example: 'Campaign collection', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
