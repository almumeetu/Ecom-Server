import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/**
 * Restrict a route to the given role name(s). Used together with RolesGuard:
 *   @UseGuards(JwtAuthGuard, RolesGuard)
 *   @Roles('admin')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
