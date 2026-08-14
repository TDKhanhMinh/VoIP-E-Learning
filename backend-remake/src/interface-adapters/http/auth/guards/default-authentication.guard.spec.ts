import type { ExecutionContext } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import type { TokenServicePort } from '../../../../application/auth/ports/token-service.port';
import type { AuthSessionRepositoryPort } from '../../../../application/auth/ports/auth-session.repository.port';
import type { UserRepositoryPort } from '../../../../application/auth/ports/user.repository.port';
import { DefaultAuthenticationGuard } from './default-authentication.guard';

describe('DefaultAuthenticationGuard', () => {
  const request: {
    headers: Record<string, string | undefined>;
    actor?: unknown;
  } = { headers: {} };
  const context = {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
  const reflector = {
    getAllAndOverride: jest.fn(),
  } as unknown as jest.Mocked<Reflector>;
  const tokenService = {
    issue: jest.fn(),
    verifyAccess: jest.fn(),
    verifyRefresh: jest.fn(),
  } as jest.Mocked<TokenServicePort>;
  const sessions = {
    findById: jest.fn(),
  } as unknown as jest.Mocked<AuthSessionRepositoryPort>;
  const users = {
    findById: jest.fn(),
  } as unknown as jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    request.headers = {};
    delete request.actor;
    jest.clearAllMocks();
    sessions.findById.mockResolvedValue({
      id: 'session-1',
      userId: 'user-1',
      refreshTokenHash: 'hash',
      expiresAt: new Date(Date.now() + 60_000),
      revokedAt: null,
    });
    users.findById.mockResolvedValue({
      id: 'user-1',
      email: 'student@example.com',
      emailNormalized: 'student@example.com',
      passwordHash: 'hash',
      role: 'student',
      accountStatus: 'active',
      emailVerifiedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as never);
  });

  it('allows only a known anonymous route identifier', async () => {
    reflector.getAllAndOverride.mockReturnValue('health.liveness');
    const guard = new DefaultAuthenticationGuard(
      reflector,
      tokenService,
      sessions,
      users,
    );
    await expect(guard.canActivate(context)).resolves.toBe(true);

    reflector.getAllAndOverride.mockReturnValue('business.accidentally-public');
    await expect(guard.canActivate(context)).rejects.toMatchObject({
      code: 'PUBLIC_ROUTE_NOT_ALLOWLISTED',
    });
  });

  it('denies private routes without a bearer token', async () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    const guard = new DefaultAuthenticationGuard(
      reflector,
      tokenService,
      sessions,
      users,
    );
    await expect(guard.canActivate(context)).rejects.toMatchObject({
      code: 'AUTHENTICATION_REQUIRED',
    });
  });

  it('verifies a bearer token and attaches the actor', async () => {
    reflector.getAllAndOverride.mockReturnValue(undefined);
    request.headers.authorization = 'Bearer access-token';
    tokenService.verifyAccess.mockResolvedValue({
      userId: 'user-1',
      sessionId: 'session-1',
      role: 'student',
    });
    const guard = new DefaultAuthenticationGuard(
      reflector,
      tokenService,
      sessions,
      users,
    );
    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(tokenService.verifyAccess.mock.calls).toContainEqual([
      'access-token',
    ]);
    expect(request.actor).toMatchObject({ userId: 'user-1' });
  });
});
