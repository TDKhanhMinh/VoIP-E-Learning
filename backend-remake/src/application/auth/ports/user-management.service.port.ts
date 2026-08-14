import type { User, UserRole } from '../../../domain/users/user.entity';
import type { UserAccountStatus } from '../../../domain/users/user.entity';
import type { PageRequest } from '../../pagination/page-request';
import type { PaginatedResult } from '../../pagination/paginated-result';

export interface CreateManagedUserInput {
  email: string;
  password: string;
  fullName?: string;
  role: UserRole;
}

export interface UpdateManagedUserInput {
  email?: string;
  fullName?: string;
  role?: UserRole;
  accountStatus?: 'active' | 'inactive';
  password?: string;
}

/** V1 user-management service contract. Authentication remains owned by AuthService. */
export interface UserManagementServicePort {
  listUsers(options: {
    role?: UserRole;
    accountStatus?: UserAccountStatus;
    pageRequest: PageRequest;
  }): Promise<PaginatedResult<User>>;
  getUserById(userId: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(input: CreateManagedUserInput): Promise<User>;
  updateUser(
    userId: string,
    input: UpdateManagedUserInput,
  ): Promise<User | null>;
  deleteUser(userId: string): Promise<void>;
}

export const USER_MANAGEMENT_SERVICE = Symbol('USER_MANAGEMENT_SERVICE');
