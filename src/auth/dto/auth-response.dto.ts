import { ApiProperty } from '@nestjs/swagger';

class RoleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty()
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    role: RoleDto | null;
    createdAt: Date;
    updatedAt: Date;
  };
}
