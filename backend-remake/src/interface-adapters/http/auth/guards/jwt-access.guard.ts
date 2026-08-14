import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import {
  AUTH_SESSION_REPOSITORY,
  type AuthSessionRepositoryPort,
} from '../../../../application/auth/ports/auth-session.repository.port';
import {
  TOKEN_SERVICE,
  type CurrentActor,
  type TokenServicePort,
} from '../../../../application/auth/ports/token-service.port';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '../../../../application/auth/ports/user.repository.port';
import { ApplicationError } from '../../../../application/errors/application.error';
import { Reflector } from '@nestjs/core';
import { ALLOW_UNVERIFIED_METADATA } from '../decorators/allow-unverified.decorator';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenServicePort,
    @Inject(AUTH_SESSION_REPOSITORY)
    private readonly sessions: AuthSessionRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly users: UserRepositoryPort,
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
    const actor = await this.tokenService.verifyAccess(
      value.slice('Bearer '.length),
    );
    const [session, user] = await Promise.all([
      this.sessions.findById(actor.sessionId),
      this.users.findById(actor.userId),
    ]);
    if (
      !session ||
      session.userId !== actor.userId ||
      session.revokedAt ||
      session.expiresAt.getTime() <= Date.now() ||
      !user ||
      user.accountStatus !== 'active' ||
      user.role !== actor.role
    )
      throw this.unauthorized();
    const allowUnverified = this.reflector.getAllAndOverride<boolean>(
      ALLOW_UNVERIFIED_METADATA,
      [context.getHandler(), context.getClass()],
    );
    if (!allowUnverified && !user.emailVerifiedAt)
      throw new ApplicationError('Email verification is required', {
        code: 'EMAIL_VERIFICATION_REQUIRED',
        kind: 'forbidden',
      });
    request.actor = actor;
    return true;
  }

  private unauthorized(): ApplicationError {
    return new ApplicationError('Authentication is required', {
      code: 'AUTHENTICATION_REQUIRED',
      kind: 'unauthenticated',
    });
  }
}
