import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsString, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
    @ApiProperty({
        description: 'Updated category name',
        example: 'Updated Electronics',
        required: false
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    name?: string;

    @ApiProperty({
        description: 'Updated category slug for URL',
        example: 'updated-electronics',
        required: false
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
    slug?: string;

    @ApiProperty({
        description: 'Updated parent category ID for nested categories',
        example: '2',
        required: false,
        nullable: true
    })
    @IsString()
    @IsOptional()
    @Transform(({ value }) => value === '' ? null : value)
    parentId?: string | null;

    @ApiProperty({
        description: 'Category image file',
        required: false,
        type: 'string',
        format: 'binary'
    })
    @IsOptional()
    image?: Express.Multer.File;

    @ApiProperty({
        description: 'Image URL to remove (set to empty string to remove)',
        required: false,
        nullable: true
    })
    @IsString()
    @IsOptional()
    imageUrl?: string | null;
}
