import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Multipart/form-data sends every field as a string, so booleans need coercing.
const toBoolean = ({ value }: { value: unknown }) => {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1') return true;
  if (value === 'false' || value === '0') return false;
  return value;
};

export class CreateNewsDto {
  @ApiProperty({ description: 'News/blog title', example: 'Our new vintage drop is live' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  title: string;

  @ApiProperty({ description: 'URL slug', example: 'our-new-vintage-drop-is-live' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  slug: string;

  @ApiProperty({ description: 'Short summary shown on cards', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  excerpt?: string;

  @ApiProperty({ description: 'Full article body', example: 'Lorem ipsum...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Author name', required: false })
  @IsString()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  author?: string;

  @ApiProperty({ description: 'Whether the article is publicly visible', required: false, default: false })
  @IsBoolean()
  @IsOptional()
  @Transform(toBoolean)
  isPublished?: boolean;

  @ApiProperty({ description: 'Cover image file', required: false, type: 'string', format: 'binary' })
  @IsOptional()
  image?: Express.Multer.File;

  @ApiProperty({ description: 'Set to empty string to remove the existing cover image', required: false, nullable: true })
  @IsString()
  @IsOptional()
  coverImageUrl?: string | null;
}
