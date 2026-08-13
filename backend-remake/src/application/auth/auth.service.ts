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

export interface PublicUser {
  id: string;
  email: string;
  roles: readonly string[];
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
}

export class AuthService {
  constructor(private readonly dependencies: AuthServiceDependencies) {}

  async register(
    email: string,
    password: string,
  ): Promise<AuthenticatedSession> {
    const emailNormalized = email.trim().toLowerCase();
    if (await this.dependencies.users.findByEmailNormalized(emailNormalized)) {
      throw new ApplicationError('An account already exists for this email', {
        code: 'EMAIL_ALREADY_EXISTS',
        kind: 'conflict',
      });
    }
    const now = new Date();
    const user = User.create({
      id: randomUUID(),
      email,
      emailNormalized,
      passwordHash: await this.dependencies.passwordHasher.hash(password),
      roles: ['student'],
      createdAt: now,
      updatedAt: now,
    });
    await this.dependencies.users.save(user);
    return this.createSession(user);
  }

  async login(email: string, password: string): Promise<AuthenticatedSession> {
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
    return this.createSession(user);
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
    if (!user) {
      await this.dependencies.sessions.revoke(session.id);
      throw this.invalidRefreshToken();
    }
    const tokens = await this.dependencies.tokenService.issue({
      userId: user.id,
      sessionId: session.id,
      roles: user.roles,
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

  async currentUser(actor: CurrentActor): Promise<PublicUser> {
    const user = await this.dependencies.users.findById(actor.userId);
    if (!user)
      throw new ApplicationError('User was not found', {
        code: 'USER_NOT_FOUND',
        kind: 'unauthenticated',
      });
    return this.toPublicUser(user);
  }

  private async createSession(user: User): Promise<AuthenticatedSession> {
    const actor: CurrentActor = {
      userId: user.id,
      sessionId: randomUUID(),
      roles: user.roles,
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
    return { id: user.id, email: user.email, roles: user.roles };
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
