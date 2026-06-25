import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

/**
 * Authorizes the request against the role names declared by @Roles().
 * Must run AFTER JwtAuthGuard (which populates req.user with `role: { id, name }`).
 * When a route has no @Roles() metadata, access is allowed (the guard composes harmlessly).
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const roleName = user?.role?.name;

    // Superadmin has unrestricted access to every role-gated route.
    if (roleName === 'superadmin') {
      return true;
    }

    if (roleName && requiredRoles.includes(roleName)) {
      return true;
    }

    throw new ForbiddenException('Insufficient role permissions');
  }
}
