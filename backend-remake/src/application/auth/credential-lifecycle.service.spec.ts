import { User } from '../../domain/users/user.entity';
import { CredentialLifecycleService } from './credential-lifecycle.service';
import type { CredentialTokenRepositoryPort } from './ports/credential-token.repository.port';
import type { EmailDeliveryPort } from './ports/email-delivery.port';
import type { PasswordHasherPort } from './ports/password-hasher.port';
import type { UserRepositoryPort } from './ports/user.repository.port';
import type { IdGeneratorPort } from '../ports/id-generator.port';
import type { AuthSessionRepositoryPort } from './ports/auth-session.repository.port';

describe('CredentialLifecycleService', () => {
  const user = User.create({
    id: '507f1f77bcf86cd799439011',
    email: 'teacher@example.com',
    emailNormalized: 'teacher@example.com',
    passwordHash: 'old-hash',
    role: 'teacher',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  });
  let users: jest.Mocked<UserRepositoryPort>;
  let tokens: jest.Mocked<CredentialTokenRepositoryPort>;
  let passwordHasher: jest.Mocked<PasswordHasherPort>;
  let sessions: jest.Mocked<AuthSessionRepositoryPort>;
  let email: jest.Mocked<EmailDeliveryPort>;
  let idGenerator: jest.Mocked<IdGeneratorPort>;
  let service: CredentialLifecycleService;

  beforeEach(() => {
    users = {
      findByEmailNormalized: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      hardDelete: jest.fn(),
    };
    tokens = {
      create: jest.fn(),
      findActiveByHash: jest.fn(),
      consumeIfActive: jest.fn(),
      countIssuedSince: jest.fn().mockResolvedValue(0),
    };
    passwordHasher = {
      hash: jest.fn().mockResolvedValue('new-hash'),
      verify: jest.fn(),
    };
    sessions = {
      create: jest.fn(),
      findById: jest.fn(),
      rotateRefreshToken: jest.fn(),
      revoke: jest.fn(),
      revokeAllForUser: jest.fn(),
    };
    email = {
      sendPasswordReset: jest.fn(),
      sendEmailVerification: jest.fn(),
    };
    idGenerator = { generate: jest.fn().mockReturnValue('token-1') };
    service = new CredentialLifecycleService({
      users,
      sessions,
      tokens,
      passwordHasher,
      email,
      idGenerator,
      config: {
        passwordResetTtlMs: 3_600_000,
        emailVerificationTtlMs: 86_400_000,
        rateWindowMs: 900_000,
        rateMax: 3,
      },
    });
  });

  it('does not reveal whether an email exists during reset request', async () => {
    users.findByEmailNormalized.mockResolvedValue(null);
    await expect(
      service.requestPasswordReset('missing@example.com'),
    ).resolves.toBeUndefined();
    expect(tokens.create.mock.calls).toHaveLength(0);
    expect(email.sendPasswordReset.mock.calls).toHaveLength(0);
  });

  it('creates a hashed one-time reset token and delivers only the raw token', async () => {
    users.findByEmailNormalized.mockResolvedValue(user);
    await service.requestPasswordReset('Teacher@Example.COM');
    const tokenInput = email.sendPasswordReset.mock.calls[0]?.[0];
    const createdToken = tokens.create.mock.calls[0]?.[0];
    expect(tokenInput?.email).toBe(user.email);
    expect(tokenInput?.token).toEqual(expect.any(String));
    expect(createdToken?.purpose).toBe('password_reset');
    expect(createdToken?.userId).toBe(user.id);
    expect(createdToken?.tokenHash).toEqual(expect.any(String));
    expect(createdToken?.tokenHash).not.toBe(tokenInput?.token);
  });

  it('consumes reset tokens once and updates the password', async () => {
    tokens.findActiveByHash.mockResolvedValue({
      id: 'token-1',
      userId: user.id,
      purpose: 'password_reset',
      tokenHash: 'hash',
      expiresAt: new Date(Date.now() + 60_000),
      consumedAt: null,
      createdAt: new Date(),
    });
    tokens.consumeIfActive.mockResolvedValue(true);
    users.findById.mockResolvedValue(user);
    users.update.mockResolvedValue(user);
    await expect(
      service.resetPassword('raw-token', 'new-password'),
    ).resolves.toBeUndefined();
    expect(tokens.consumeIfActive.mock.calls).toContainEqual([
      'token-1',
      expect.any(Date),
    ]);
    expect(users.update.mock.calls[0]?.[1]).toEqual({
      passwordHash: 'new-hash',
    });
    expect(sessions.revokeAllForUser.mock.calls).toContainEqual([user.id]);
  });

  it('rejects a replayed or expired token', async () => {
    tokens.findActiveByHash.mockResolvedValue(null);
    await expect(
      service.resetPassword('replayed-token', 'new-password'),
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIAL_TOKEN' });
  });

  it('rate-limits repeated verification requests', async () => {
    users.findById.mockResolvedValue(user);
    tokens.countIssuedSince.mockResolvedValue(3);
    await expect(
      service.requestEmailVerification(user.id),
    ).rejects.toMatchObject({ code: 'CREDENTIAL_RATE_LIMITED' });
    expect(tokens.create.mock.calls).toHaveLength(0);
  });
});
