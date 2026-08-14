import { randomUUID } from 'node:crypto';
import { User } from '../../domain/users/user.entity';
import { ApplicationError } from '../errors/application.error';
import type { AuthSessionRepositoryPort } from './ports/auth-session.repository.port';
import type { PasswordHasherPort } from './ports/password-hasher.port';
import type {
  CurrentActor,
  IssuedTokens,
  TokenServicePort,
} from './ports/token-service.port';
import type { UserRepositoryPort } from './ports/user.repository.port';
import type { RealtimeSessionRevocationPort } from './ports/realtime-session-revocation.port';

export interface PublicUser {
  id: string;
  email: string;
  role: string;
}
export interface AuthenticatedSession {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: Date;
  user: PublicUser;
}

interface AuthServiceDependencies {
  users: UserRepositoryPort;
  sessions: AuthSessionRepositoryPort;
  passwordHasher: PasswordHasherPort;
  tokenService: TokenServicePort;
  realtimeRevocation?: RealtimeSessionRevocationPort;
}

export interface SessionContext {
  userAgent?: string;
  ipAddress?: string;
}

export class AuthService {
  constructor(private readonly dependencies: AuthServiceDependencies) {}

  async login(
    email: string,
    password: string,
    context: SessionContext = {},
  ): Promise<AuthenticatedSession> {
    const user = await this.dependencies.users.findByEmailNormalized(
      email.trim().toLowerCase(),
    );
    const passwordMatches = user
      ? await this.dependencies.passwordHasher.verify(
          password,
          user.passwordHash,
        )
      : false;
    if (!user || !passwordMatches) throw this.invalidCredentials();
    if (user.accountStatus !== 'active') throw this.invalidCredentials();
    return this.createSession(user, context);
  }

  async refresh(refreshToken: string): Promise<AuthenticatedSession> {
    const actor =
      await this.dependencies.tokenService.verifyRefresh(refreshToken);
    const session = await this.dependencies.sessions.findById(actor.sessionId);
    if (
      !session ||
      session.revokedAt ||
      session.expiresAt.getTime() <= Date.now() ||
      session.userId !== actor.userId
    )
      throw this.invalidRefreshToken();
    if (
      !(await this.dependencies.passwordHasher.verify(
        refreshToken,
        session.refreshTokenHash,
      ))
    ) {
      await this.dependencies.sessions.revoke(session.id);
      throw this.invalidRefreshToken();
    }
    const user = await this.dependencies.users.findById(actor.userId);
    if (!user || user.accountStatus !== 'active' || user.role !== actor.role) {
      await this.dependencies.sessions.revoke(session.id);
      throw this.invalidRefreshToken();
    }
    const tokens = await this.dependencies.tokenService.issue({
      userId: user.id,
      sessionId: session.id,
      role: user.role,
    });
    await this.dependencies.sessions.rotateRefreshToken(
      session.id,
      await this.dependencies.passwordHasher.hash(tokens.refreshToken),
      tokens.refreshTokenExpiresAt,
    );
    return this.toAuthenticatedSession(user, tokens);
  }

  async logout(sessionId: string): Promise<void> {
    await this.dependencies.sessions.revoke(sessionId);
  }

  async changePassword(
    actor: CurrentActor,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.dependencies.users.findById(actor.userId);
    const matches = user
      ? await this.dependencies.passwordHasher.verify(
          currentPassword,
          user.passwordHash,
        )
      : false;
    if (!user || user.accountStatus !== 'active' || !matches)
      throw this.invalidCredentials();
    const updated = await this.dependencies.users.update(user.id, {
      passwordHash: await this.dependencies.passwordHasher.hash(newPassword),
    });
    if (!updated) throw this.invalidCredentials();
    await this.dependencies.sessions.revokeAllForUser(user.id);
    await this.dependencies.realtimeRevocation?.disconnectUser(user.id);
  }

  async currentUser(actor: CurrentActor): Promise<PublicUser> {
    const user = await this.dependencies.users.findById(actor.userId);
    if (!user)
      throw new ApplicationError('User was not found', {
        code: 'USER_NOT_FOUND',
        kind: 'unauthenticated',
      });
    return this.toPublicUser(user);
  }

  private async createSession(
    user: User,
    context: SessionContext,
  ): Promise<AuthenticatedSession> {
    const actor: CurrentActor = {
      userId: user.id,
      sessionId: randomUUID(),
      role: user.role,
    };
    const tokens = await this.dependencies.tokenService.issue(actor);
    await this.dependencies.sessions.create({
      id: actor.sessionId,
      userId: user.id,
      refreshTokenHash: await this.dependencies.passwordHasher.hash(
        tokens.refreshToken,
      ),
      expiresAt: tokens.refreshTokenExpiresAt,
      revokedAt: null,
      userAgent: context.userAgent,
      ipAddress: context.ipAddress,
      lastUsedAt: new Date(),
    });
    return this.toAuthenticatedSession(user, tokens);
  }

  private toAuthenticatedSession(
    user: User,
    tokens: IssuedTokens,
  ): AuthenticatedSession {
    return {
      user: this.toPublicUser(user),
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
    };
  }
  private toPublicUser(user: User): PublicUser {
    return { id: user.id, email: user.email, role: user.role };
  }
  private invalidCredentials(): ApplicationError {
    return new ApplicationError('Invalid email or password', {
      code: 'INVALID_CREDENTIALS',
      kind: 'unauthenticated',
    });
  }
  private invalidRefreshToken(): ApplicationError {
    return new ApplicationError('Refresh token is invalid or expired', {
      code: 'INVALID_REFRESH_TOKEN',
      kind: 'unauthenticated',
    });
  }
}
