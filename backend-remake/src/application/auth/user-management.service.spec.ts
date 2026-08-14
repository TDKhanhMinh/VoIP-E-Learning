import { createPageRequest } from '../pagination/page-request';
import { User } from '../../domain/users/user.entity';
import { UserManagementService } from './user-management.service';
import type { AuthSessionRepositoryPort } from './ports/auth-session.repository.port';
import type { PasswordHasherPort } from './ports/password-hasher.port';
import type { UserRepositoryPort } from './ports/user.repository.port';
import type { IdGeneratorPort } from '../ports/id-generator.port';

describe('UserManagementService', () => {
  const existing = User.create({
    id: '507f1f77bcf86cd799439011',
    email: 'old@example.com',
    emailNormalized: 'old@example.com',
    passwordHash: 'old-hash',
    role: 'student',
    accountStatus: 'active',
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date('2026-01-01'),
  });
  let users: jest.Mocked<UserRepositoryPort>;
  let sessions: jest.Mocked<AuthSessionRepositoryPort>;
  let passwordHasher: jest.Mocked<PasswordHasherPort>;
  let idGenerator: jest.Mocked<IdGeneratorPort>;
  let service: UserManagementService;

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
      hash: jest.fn().mockResolvedValue('new-hash'),
      verify: jest.fn(),
    };
    idGenerator = {
      generate: jest.fn().mockReturnValue('507f1f77bcf86cd799439012'),
    };
    service = new UserManagementService({
      users,
      sessions,
      passwordHasher,
      idGenerator,
    });
  });

  it('normalizes email, hashes password and creates one role', async () => {
    const created = await service.createUser({
      email: ' Admin@Example.COM ',
      password: 'password',
      fullName: ' Admin ',
      role: 'admin',
    });
    expect(created.emailNormalized).toBe('admin@example.com');
    expect(created.role).toBe('admin');
    expect(passwordHasher.hash.mock.calls).toContainEqual(['password']);
    expect(users.save.mock.calls).toContainEqual([created]);
  });

  it('revokes every session after role or status changes', async () => {
    users.findById.mockResolvedValue(existing);
    const updated = User.create({
      id: existing.id,
      email: existing.email,
      emailNormalized: existing.emailNormalized,
      passwordHash: existing.passwordHash,
      role: 'teacher',
      accountStatus: 'inactive',
      createdAt: existing.createdAt,
      updatedAt: new Date('2026-01-02'),
    });
    users.update.mockResolvedValue(updated);
    await expect(
      service.updateUser(existing.id, {
        role: 'teacher',
        accountStatus: 'inactive',
      }),
    ).resolves.toBe(updated);
    expect(sessions.revokeAllForUser.mock.calls).toContainEqual([existing.id]);
  });

  it('soft-deletes and anonymizes the account while revoking sessions', async () => {
    users.findById.mockResolvedValue(existing);
    const anonymized = User.create({
      ...{
        id: existing.id,
        email: `deleted_user_${existing.id}@deleted.invalid`,
        emailNormalized: `deleted_user_${existing.id}@deleted.invalid`,
        passwordHash: existing.passwordHash,
        role: existing.role,
        accountStatus: 'inactive',
        createdAt: existing.createdAt,
        updatedAt: new Date('2026-01-02'),
      },
    });
    users.update.mockResolvedValue(anonymized);
    await expect(service.deleteUser(existing.id)).resolves.toBeUndefined();
    expect(users.update.mock.calls).toContainEqual([
      existing.id,
      {
        email: `deleted_user_${existing.id}@deleted.invalid`,
        emailNormalized: `deleted_user_${existing.id}@deleted.invalid`,
        fullName: 'Deleted user',
        accountStatus: 'inactive',
      },
    ]);
    expect(sessions.revokeAllForUser.mock.calls).toContainEqual([existing.id]);
  });

  it('delegates filtered users to a paginated repository query', async () => {
    const pageRequest = createPageRequest(1, 20);
    const result = { items: [existing], pagination: {} } as never;
    users.list.mockResolvedValue(result);
    await expect(
      service.listUsers({ role: 'student', pageRequest }),
    ).resolves.toBe(result);
    expect(users.list.mock.calls).toContainEqual([
      { role: 'student', pageRequest },
    ]);
  });
});
