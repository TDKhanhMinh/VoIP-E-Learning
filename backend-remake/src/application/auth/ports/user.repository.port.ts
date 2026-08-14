import type {
  User,
  UserAccountStatus,
  UserRole,
} from '../../../domain/users/user.entity';
import type { PageRequest } from '../../pagination/page-request';
import type { PaginatedResult } from '../../pagination/paginated-result';

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

export interface UserRepositoryPort {
  findByEmailNormalized(emailNormalized: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  list(options: {
    role?: UserRole;
    accountStatus?: UserAccountStatus;
    pageRequest: PageRequest;
  }): Promise<PaginatedResult<User>>;
  update(
    id: string,
    changes: Partial<{
      email: string;
      emailNormalized: string;
      fullName: string | undefined;
      role: UserRole;
      accountStatus: UserAccountStatus;
      passwordHash: string;
      emailVerifiedAt: Date | null;
    }>,
  ): Promise<User | null>;
  hardDelete(id: string): Promise<'deleted' | 'not-found' | 'referenced'>;
}
