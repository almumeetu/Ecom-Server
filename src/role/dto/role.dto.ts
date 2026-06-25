import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {}

export class CreatePermissionDto {
  @ApiProperty({ example: 'manage_products' })
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class AssignPermissionsDto {
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUUID(undefined, { each: true })
  permissionIds?: string[];
}
