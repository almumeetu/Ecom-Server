import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  position: number;

  @ApiProperty({ example: 'Summer Collection' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'home' })
  @IsString()
  @IsNotEmpty()
  page: string;
}
