import type { User, UserRole } from '../../../domain/users/user.entity';

export interface CreateManagedUserInput {
  email: string;
  password: string;
  fullName?: string;
  role?: UserRole;
  sipPassword?: string;
}

export interface UpdateManagedUserInput {
  email?: string;
  fullName?: string;
  role?: UserRole;
  available?: boolean;
}

/** V1 user-management service contract. Authentication remains owned by AuthService. */
export interface UserManagementServicePort {
  listUsers(role?: UserRole): Promise<readonly User[]>;
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
