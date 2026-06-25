import { ApiProperty } from "@nestjs/swagger";

export class CategoryResponseDto {
    @ApiProperty({
        description: 'Category ID',
        example: 1,
        default: 1
    })
    id: number;

    @ApiProperty({
        description: 'Category Name',
        example: 'Electronics',
        default: 'New Category'
    })
    name: string;

    @ApiProperty({
        description: 'Category slug for URL',
        example: 'electronics',
        default: 'new-category'
    })
    slug: string;

    @ApiProperty({
        description: 'Parent category ID',
        example: null,
        default: null,
        nullable: true
    })
    parentId?: string;

    @ApiProperty({
        description: 'Category creation timestamp',
        example: '2024-01-01T00:00:00.000Z',
        default: '2024-01-01T00:00:00.000Z'
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Category update timestamp',
        example: '2024-01-01T00:00:00.000Z',
        default: '2024-01-01T00:00:00.000Z'
    })
    updatedAt: Date;
}
