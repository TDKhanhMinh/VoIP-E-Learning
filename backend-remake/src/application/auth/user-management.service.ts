import { ApplicationError } from '../errors/application.error';
import { User } from '../../domain/users/user.entity';
import type { IdGeneratorPort } from '../ports/id-generator.port';
import type { PasswordHasherPort } from './ports/password-hasher.port';
import type { AuthSessionRepositoryPort } from './ports/auth-session.repository.port';
import type { UserRepositoryPort } from './ports/user.repository.port';
import type { RealtimeSessionRevocationPort } from './ports/realtime-session-revocation.port';
import type {
  CreateManagedUserInput,
  UpdateManagedUserInput,
  UserManagementServicePort,
} from './ports/user-management.service.port';
import type { PageRequest } from '../pagination/page-request';
import type { PaginatedResult } from '../pagination/paginated-result';
import type {
  UserAccountStatus,
  UserRole,
} from '../../domain/users/user.entity';

interface UserManagementDependencies {
  users: UserRepositoryPort;
  sessions: AuthSessionRepositoryPort;
  passwordHasher: PasswordHasherPort;
  idGenerator: IdGeneratorPort;
  realtimeRevocation?: RealtimeSessionRevocationPort;
}

export class UserManagementService implements UserManagementServicePort {
  constructor(private readonly dependencies: UserManagementDependencies) {}

  listUsers(options: {
    role?: UserRole;
    accountStatus?: UserAccountStatus;
    pageRequest: PageRequest;
  }): Promise<PaginatedResult<User>> {
    return this.dependencies.users.list(options);
  }

  getUserById(userId: string): Promise<User | null> {
    return this.dependencies.users.findById(userId);
  }

  getUserByEmail(email: string): Promise<User | null> {
    return this.dependencies.users.findByEmailNormalized(
      this.normalizeEmail(email),
    );
  }

  async createUser(input: CreateManagedUserInput): Promise<User> {
    const now = new Date();
    const user = User.create({
      id: this.dependencies.idGenerator.generate(),
      fullName: input.fullName?.trim() || undefined,
      email: input.email.trim(),
      emailNormalized: this.normalizeEmail(input.email),
      passwordHash: await this.dependencies.passwordHasher.hash(input.password),
      accountStatus: 'active',
      role: input.role,
      createdAt: now,
      updatedAt: now,
    });
    await this.dependencies.users.save(user);
    return user;
  }

  async updateUser(
    userId: string,
    input: UpdateManagedUserInput,
  ): Promise<User | null> {
    const existing = await this.dependencies.users.findById(userId);
    if (!existing) return null;
    const changes = {
      ...(input.email === undefined
        ? {}
        : {
            email: input.email.trim(),
            emailNormalized: this.normalizeEmail(input.email),
          }),
      ...(input.fullName === undefined
        ? {}
        : { fullName: input.fullName.trim() || undefined }),
      ...(input.role === undefined ? {} : { role: input.role }),
      ...(input.accountStatus === undefined
        ? {}
        : { accountStatus: input.accountStatus }),
      ...(input.password === undefined
        ? {}
        : {
            passwordHash: await this.dependencies.passwordHasher.hash(
              input.password,
            ),
          }),
    };
    const updated = await this.dependencies.users.update(userId, changes);
    if (!updated) return null;
    if (
      updated.role !== existing.role ||
      updated.accountStatus !== existing.accountStatus
    ) {
      await this.dependencies.sessions.revokeAllForUser(userId);
      await this.dependencies.realtimeRevocation?.disconnectUser(userId);
    }
    return updated;
  }

  async deleteUser(userId: string): Promise<void> {
    const existing = await this.dependencies.users.findById(userId);
    if (!existing)
      throw new ApplicationError('User was not found', {
        code: 'USER_NOT_FOUND',
        kind: 'not_found',
      });
    if (existing.accountStatus === 'inactive') return;
    const anonymizedEmail = `deleted_user_${existing.id}@deleted.invalid`;
    const updated = await this.dependencies.users.update(existing.id, {
      email: anonymizedEmail,
      emailNormalized: anonymizedEmail,
      fullName: 'Deleted user',
      accountStatus: 'inactive',
    });
    if (!updated)
      throw new ApplicationError('User was not found', {
        code: 'USER_NOT_FOUND',
        kind: 'not_found',
      });
    await this.dependencies.sessions.revokeAllForUser(existing.id);
    await this.dependencies.realtimeRevocation?.disconnectUser(existing.id);
  }

  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }
}
