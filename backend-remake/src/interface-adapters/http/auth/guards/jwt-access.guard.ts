import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  TOKEN_SERVICE,
  type CurrentActor,
  type TokenServicePort,
} from '../../../../application/auth/ports/token-service.port';
import { ApplicationError } from '../../../../application/errors/application.error';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenServicePort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
      actor?: CurrentActor;
    }>();
    const authorization = request.headers.authorization;
    const value = Array.isArray(authorization)
      ? authorization[0]
      : authorization;
    if (!value?.startsWith('Bearer ')) throw this.unauthorized();
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
