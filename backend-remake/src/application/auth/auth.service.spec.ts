import { User } from '../../domain/users/user.entity';
import { AuthService } from './auth.service';
import type { AuthSessionRepositoryPort } from './ports/auth-session.repository.port';
import type { PasswordHasherPort } from './ports/password-hasher.port';
import type { TokenServicePort } from './ports/token-service.port';
import type { UserRepositoryPort } from './ports/user.repository.port';

describe('AuthService', () => {
  const user = User.create({
    id: 'user-1',
    email: 'Teacher@example.com',
    emailNormalized: 'teacher@example.com',
    passwordHash: 'hash',
    role: 'teacher',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  });
  let users: jest.Mocked<UserRepositoryPort>;
  let sessions: jest.Mocked<AuthSessionRepositoryPort>;
  let passwordHasher: jest.Mocked<PasswordHasherPort>;
  let tokenService: jest.Mocked<TokenServicePort>;
  let service: AuthService;

  beforeEach(() => {
    users = {
      findByEmailNormalized: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      list: jest.fn(),
      update: jest.fn(),
      hardDelete: jest.fn(),
    };
    sessions = {
      create: jest.fn(),
      findById: jest.fn(),
      rotateRefreshToken: jest.fn(),
      revoke: jest.fn(),
      revokeAllForUser: jest.fn(),
    };
    passwordHasher = {
      hash: jest.fn().mockResolvedValue('hashed-refresh-token'),
      verify: jest.fn(),
    };
    tokenService = {
      issue: jest.fn().mockResolvedValue({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        refreshTokenExpiresAt: new Date(Date.now() + 60_000),
      }),
      verifyAccess: jest.fn(),
      verifyRefresh: jest.fn(),
    };
    service = new AuthService({
      users,
      sessions,
      passwordHasher,
      tokenService,
    });
  });

  it('rejects invalid login without leaking account details', async () => {
    users.findByEmailNormalized.mockResolvedValueOnce(null);
    await expect(
      service.login('missing@example.com', 'password'),
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
    users.findByEmailNormalized.mockResolvedValueOnce(user);
    passwordHasher.verify.mockResolvedValueOnce(false);
    await expect(
      service.login(user.email, 'wrong-password'),
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
  });

  it('logs in after password verification', async () => {
    users.findByEmailNormalized.mockResolvedValue(user);
    passwordHasher.verify.mockResolvedValue(true);
    await expect(
      service.login(user.email, 'correct-password'),
    ).resolves.toMatchObject({
      user: { id: user.id },
      accessToken: 'access-token',
    });
  });

  it('rejects an inactive account even when its password is valid', async () => {
    const inactiveUser = User.create({
      id: user.id,
      email: user.email,
      emailNormalized: user.emailNormalized,
      passwordHash: user.passwordHash,
      role: user.role,
      accountStatus: 'inactive',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    users.findByEmailNormalized.mockResolvedValue(inactiveUser);
    passwordHasher.verify.mockResolvedValue(true);
    await expect(
      service.login(inactiveUser.email, 'correct-password'),
    ).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
  });

  it('rotates a valid refresh token and revokes a replayed token', async () => {
    tokenService.verifyRefresh.mockResolvedValue({
      userId: user.id,
      sessionId: 'session-1',
      role: user.role,
    });
    sessions.findById.mockResolvedValue({
      id: 'session-1',
      userId: user.id,
      refreshTokenHash: 'old-hash',
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
    });
    passwordHasher.verify.mockResolvedValue(true);
    users.findById.mockResolvedValue(user);
    await expect(service.refresh('refresh-token')).resolves.toMatchObject({
      accessToken: 'access-token',
    });
    expect(sessions.rotateRefreshToken.mock.calls).toContainEqual([
      'session-1',
      'hashed-refresh-token',
      expect.any(Date),
    ]);

    passwordHasher.verify.mockResolvedValue(false);
    await expect(service.refresh('replayed-token')).rejects.toMatchObject({
      code: 'INVALID_REFRESH_TOKEN',
    });
    expect(sessions.revoke.mock.calls).toContainEqual(['session-1']);
  });

  it('rejects invalid refresh sessions and exposes only current public user data', async () => {
    tokenService.verifyRefresh.mockResolvedValue({
      userId: user.id,
      sessionId: 'session-1',
      role: user.role,
    });
    sessions.findById.mockResolvedValue(null);
    await expect(service.refresh('refresh-token')).rejects.toMatchObject({
      code: 'INVALID_REFRESH_TOKEN',
    });
    users.findById.mockResolvedValue(user);
    await expect(
      service.currentUser({
        userId: user.id,
        sessionId: 'session-1',
        role: user.role,
      }),
    ).resolves.toEqual({ id: user.id, email: user.email, role: user.role });
    users.findById.mockResolvedValue(null);
    await expect(
      service.currentUser({
        userId: user.id,
        sessionId: 'session-1',
        role: user.role,
      }),
    ).rejects.toMatchObject({ code: 'USER_NOT_FOUND' });
    await service.logout('session-1');
    expect(sessions.revoke.mock.calls).toContainEqual(['session-1']);
  });

  it('changes password and revokes every session', async () => {
    users.findById.mockResolvedValue(user);
    users.update.mockResolvedValue(user);
    passwordHasher.verify.mockResolvedValue(true);
    await expect(
      service.changePassword(
        { userId: user.id, sessionId: 'session-1', role: user.role },
        'old-password',
        'new-password',
      ),
    ).resolves.toBeUndefined();
    expect(passwordHasher.hash.mock.calls).toContainEqual(['new-password']);
    expect(users.update.mock.calls).toContainEqual([
      user.id,
      { passwordHash: 'hashed-refresh-token' },
    ]);
    expect(sessions.revokeAllForUser.mock.calls).toContainEqual([user.id]);
  });
});
