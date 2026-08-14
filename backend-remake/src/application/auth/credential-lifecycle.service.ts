import { createHash, randomBytes } from 'node:crypto';
import { ApplicationError } from '../errors/application.error';
import type { IdGeneratorPort } from '../ports/id-generator.port';
import type { PasswordHasherPort } from './ports/password-hasher.port';
import type { UserRepositoryPort } from './ports/user.repository.port';
import type { AuthSessionRepositoryPort } from './ports/auth-session.repository.port';
import {
  type CredentialTokenPurpose,
  type CredentialTokenRepositoryPort,
} from './ports/credential-token.repository.port';
import type { EmailDeliveryPort } from './ports/email-delivery.port';
import type { RealtimeSessionRevocationPort } from './ports/realtime-session-revocation.port';

export interface CredentialLifecycleConfig {
  passwordResetTtlMs: number;
  emailVerificationTtlMs: number;
  rateWindowMs: number;
  rateMax: number;
}

interface CredentialLifecycleDependencies {
  users: UserRepositoryPort;
  sessions: AuthSessionRepositoryPort;
  tokens: CredentialTokenRepositoryPort;
  passwordHasher: PasswordHasherPort;
  email: EmailDeliveryPort;
  idGenerator: IdGeneratorPort;
  config: CredentialLifecycleConfig;
  realtimeRevocation?: RealtimeSessionRevocationPort;
}

export class CredentialLifecycleService {
  constructor(private readonly dependencies: CredentialLifecycleDependencies) {}

  async requestPasswordReset(email: string): Promise<void> {
    await this.issueToken('password_reset', email, (token, expiresAt, user) =>
      this.dependencies.email.sendPasswordReset({
        email: user.email,
        token,
        expiresAt,
      }),
    );
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.consumeToken('password_reset', token, async (record) => {
      const user = await this.dependencies.users.findById(record.userId);
      if (!user || user.accountStatus !== 'active') throw this.invalidToken();
      const updated = await this.dependencies.users.update(user.id, {
        passwordHash: await this.dependencies.passwordHasher.hash(newPassword),
      });
      if (!updated) throw this.invalidToken();
      await this.dependencies.sessions.revokeAllForUser(user.id);
      await this.dependencies.realtimeRevocation?.disconnectUser(user.id);
    });
  }

  async requestEmailVerification(userId: string): Promise<void> {
    const user = await this.dependencies.users.findById(userId);
    if (!user) throw this.invalidToken();
    await this.issueTokenForUser(
      'email_verification',
      user,
      (token, expiresAt) =>
        this.dependencies.email.sendEmailVerification({
          email: user.email,
          token,
          expiresAt,
        }),
    );
  }

  async verifyEmail(token: string): Promise<void> {
    await this.consumeToken('email_verification', token, async (record) => {
      const user = await this.dependencies.users.findById(record.userId);
      if (!user) throw this.invalidToken();
      const updated = await this.dependencies.users.update(user.id, {
        emailVerifiedAt: new Date(),
      });
      if (!updated) throw this.invalidToken();
    });
  }

  private async issueToken(
    purpose: CredentialTokenPurpose,
    email: string,
    deliver: (
      token: string,
      expiresAt: Date,
      user: NonNullable<
        Awaited<ReturnType<UserRepositoryPort['findByEmailNormalized']>>
      >,
    ) => Promise<void>,
  ): Promise<void> {
    const user = await this.dependencies.users.findByEmailNormalized(
      email.trim().toLowerCase(),
    );
    if (!user || user.accountStatus !== 'active') return;
    await this.issueTokenForUser(purpose, user, (token, expiresAt) =>
      deliver(token, expiresAt, user),
    );
  }

  private async issueTokenForUser(
    purpose: CredentialTokenPurpose,
    user: NonNullable<Awaited<ReturnType<UserRepositoryPort['findById']>>>,
    deliver: (token: string, expiresAt: Date) => Promise<void>,
  ): Promise<void> {
    const since = new Date(Date.now() - this.dependencies.config.rateWindowMs);
    const issued = await this.dependencies.tokens.countIssuedSince(
      user.id,
      purpose,
      since,
    );
    if (issued >= this.dependencies.config.rateMax)
      throw new ApplicationError('Too many credential requests', {
        code: 'CREDENTIAL_RATE_LIMITED',
        kind: 'rate_limited',
      });
    const token = randomBytes(32).toString('base64url');
    const expiresAt = new Date(
      Date.now() +
        (purpose === 'password_reset'
          ? this.dependencies.config.passwordResetTtlMs
          : this.dependencies.config.emailVerificationTtlMs),
    );
    await this.dependencies.tokens.create({
      id: this.dependencies.idGenerator.generate(),
      userId: user.id,
      purpose,
      tokenHash: this.hashToken(token),
      expiresAt,
      consumedAt: null,
      createdAt: new Date(),
    });
    try {
      await deliver(token, expiresAt);
    } catch (error: unknown) {
      throw new ApplicationError('Email delivery is unavailable', {
        code: 'EMAIL_DELIVERY_UNAVAILABLE',
        kind: 'service_unavailable',
        cause: error,
      });
    }
  }

  private async consumeToken(
    purpose: CredentialTokenPurpose,
    token: string,
    apply: (
      record: NonNullable<
        Awaited<ReturnType<CredentialTokenRepositoryPort['findActiveByHash']>>
      >,
    ) => Promise<void>,
  ): Promise<void> {
    const record = await this.dependencies.tokens.findActiveByHash(
      purpose,
      this.hashToken(token),
      new Date(),
    );
    if (
      !record ||
      !(await this.dependencies.tokens.consumeIfActive(record.id, new Date()))
    )
      throw this.invalidToken();
    await apply(record);
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private invalidToken(): ApplicationError {
    return new ApplicationError('Credential token is invalid or expired', {
      code: 'INVALID_CREDENTIAL_TOKEN',
      kind: 'unauthenticated',
    });
  }
}
