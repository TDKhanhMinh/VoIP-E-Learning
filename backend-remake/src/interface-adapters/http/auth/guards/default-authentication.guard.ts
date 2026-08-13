import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Optional,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  TOKEN_SERVICE,
  type CurrentActor,
  type TokenServicePort,
} from '../../../../application/auth/ports/token-service.port';
import { ApplicationError } from '../../../../application/errors/application.error';
import { isPublicHttpRouteId } from '../../../../application/security/public-http-route.contract';
import { PUBLIC_ROUTE_METADATA } from '../decorators/public-route.decorator';

@Injectable()
export class DefaultAuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Optional()
    @Inject(TOKEN_SERVICE)
    private readonly tokenService?: TokenServicePort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const routeId = this.reflector.getAllAndOverride<string>(
      PUBLIC_ROUTE_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (routeId) {
      if (
        process.env.NODE_ENV === 'test' &&
        routeId.startsWith('test.fixture.')
      )
        return true;
      if (isPublicHttpRouteId(routeId)) return true;
      throw new ApplicationError('Anonymous route is not allowlisted', {
        code: 'PUBLIC_ROUTE_NOT_ALLOWLISTED',
        kind: 'forbidden',
      });
    }

    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
      actor?: CurrentActor;
    }>();
    const authorization = request.headers.authorization;
    const value = Array.isArray(authorization)
      ? authorization[0]
      : authorization;
    if (!value?.startsWith('Bearer ') || !this.tokenService)
      throw this.unauthorized();
    request.actor = await this.tokenService.verifyAccess(
      value.slice('Bearer '.length),
    );
    return true;
  }

  private unauthorized(): ApplicationError {
    return new ApplicationError('Authentication is required', {
      code: 'AUTHENTICATION_REQUIRED',
      kind: 'unauthenticated',
    });
  }
}
