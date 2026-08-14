import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { CurrentActor } from '../../../../application/auth/ports/token-service.port';
import { ApplicationError } from '../../../../application/errors/application.error';
import type { UserRole } from '../../../../domain/users/user.entity';
import { ROLES_METADATA_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const permittedRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!permittedRoles?.length) return true;
    const actor = context
      .switchToHttp()
      .getRequest<{ actor?: CurrentActor }>().actor;
    if (actor?.roles.some((role) => permittedRoles.includes(role))) return true;
    throw new ApplicationError(
      'You do not have permission to perform this action',
      { code: 'INSUFFICIENT_ROLE', kind: 'forbidden' },
    );
  }
}
