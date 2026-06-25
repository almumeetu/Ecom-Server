import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AssignPermissionsDto,
  CreatePermissionDto,
  CreateRoleDto,
  UpdateRoleDto,
} from './dto/role.dto';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  createRole(dto: CreateRoleDto) {
    return this.prisma.role.create({ data: dto });
  }

  roles() {
    return this.prisma.role.findMany({ include: { permissions: true, users: true } });
  }

  async updateRole(id: string, dto: UpdateRoleDto) {
    await this.ensureRole(id);
    return this.prisma.role.update({ where: { id }, data: dto });
  }

  async removeRole(id: string) {
    const role = await this.ensureRole(id);
    if (role.name === 'superadmin' || role.name === 'admin') {
      throw new BadRequestException(`The "${role.name}" role is protected and cannot be deleted`);
    }
    const usersWithRole = await this.prisma.user.count({ where: { roleId: id } });
    if (usersWithRole > 0) {
      throw new BadRequestException(
        `Cannot delete a role that is still assigned to ${usersWithRole} user(s). Reassign them first.`,
      );
    }
    await this.prisma.role.delete({ where: { id } });
    return { message: 'Role deleted successfully' };
  }

  createPermission(dto: CreatePermissionDto) {
    return this.prisma.permission.create({ data: dto });
  }

  permissions() {
    return this.prisma.permission.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async assignPermissions(roleId: string, dto: AssignPermissionsDto) {
    await this.ensureRole(roleId);
    return this.prisma.role.update({
      where: { id: roleId },
      data: {
        permissions: {
          set: dto.permissionIds?.map((id) => ({ id })) ?? [],
        },
      },
      include: { permissions: true },
    });
  }

  private async ensureRole(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    return role;
  }
}
