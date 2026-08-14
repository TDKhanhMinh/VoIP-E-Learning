import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import { ApplicationError } from '../../application/errors/application.error';
import type {
  CurrentActor,
  IssuedTokens,
  TokenServicePort,
} from '../../application/auth/ports/token-service.port';
import type { UserRole } from '../../domain/users/user.entity';

type TokenKind = 'access' | 'refresh';
interface TokenPayload {
  sub: string;
  sid: string;
  roles: UserRole[];
  tokenType: TokenKind;
}

@Injectable()
export class JwtTokenServiceAdapter implements TokenServicePort {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async issue(actor: CurrentActor): Promise<IssuedTokens> {
    const accessToken = await this.sign(actor, 'access');
    const refreshToken = await this.sign(actor, 'refresh');
    return {
      accessToken,
      refreshToken,
      refreshTokenExpiresAt: new Date(
        Date.now() +
          this.durationInMilliseconds(
            this.config.getOrThrow<string>('JWT_REFRESH_TOKEN_TTL'),
          ),
      ),
    };
  }

  verifyAccess(token: string): Promise<CurrentActor> {
    return this.verify(token, 'access');
  }
  verifyRefresh(token: string): Promise<CurrentActor> {
    return this.verify(token, 'refresh');
  }

  private async sign(
    actor: CurrentActor,
    tokenType: TokenKind,
  ): Promise<string> {
    return this.jwt.signAsync(
      {
        sub: actor.userId,
        sid: actor.sessionId,
        roles: [...actor.roles],
        tokenType,
      } satisfies TokenPayload,
      {
        secret: this.secretFor(tokenType),
        issuer: this.config.getOrThrow<string>('JWT_ISSUER'),
        audience: this.config.getOrThrow<string>('JWT_AUDIENCE'),
        expiresIn: this.config.getOrThrow<string>(
          tokenType === 'access'
            ? 'JWT_ACCESS_TOKEN_TTL'
            : 'JWT_REFRESH_TOKEN_TTL',
        ) as JwtSignOptions['expiresIn'],
      },
    );
  }

  private async verify(
    token: string,
    tokenType: TokenKind,
  ): Promise<CurrentActor> {
    try {
      const payload = await this.jwt.verifyAsync<TokenPayload>(token, {
        secret: this.secretFor(tokenType),
        issuer: this.config.getOrThrow<string>('JWT_ISSUER'),
        audience: this.config.getOrThrow<string>('JWT_AUDIENCE'),
      });
      if (
        payload.tokenType !== tokenType ||
        !payload.sub ||
        !payload.sid ||
        !Array.isArray(payload.roles)
      )
        throw new Error('Invalid token claims');
      return {
        userId: payload.sub,
        sessionId: payload.sid,
        roles: payload.roles,
      };
    } catch {
      throw new ApplicationError('Token is invalid or expired', {
        code: 'INVALID_TOKEN',
        kind: 'unauthenticated',
      });
    }
  }

  private secretFor(tokenType: TokenKind): string {
    return this.config.getOrThrow<string>(
      tokenType === 'access' ? 'JWT_ACCESS_SECRET' : 'JWT_REFRESH_SECRET',
    );
  }

  private durationInMilliseconds(value: string): number {
    const match = /^(\d+)([smhd])$/.exec(value);
    if (!match)
      throw new Error('JWT refresh token TTL must use s, m, h or d units');
    const multiplier = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 }[
      match[2] as 's' | 'm' | 'h' | 'd'
    ];
    return Number(match[1]) * multiplier;
  }
}
