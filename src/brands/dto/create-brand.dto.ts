import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateBrandDto {
    @ApiProperty({ description: 'Brand Name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Brand Slug' })
    @IsString()
    @IsNotEmpty()
    slug: string;

    @ApiProperty({ description: 'Brand Logo URL', required: false })
    @IsString()
    @IsOptional()
    logoUrl?: string;
}
