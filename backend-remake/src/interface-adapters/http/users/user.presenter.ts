import type { User } from '../../../domain/users/user.entity';

export interface UserResponse {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  accountStatus: string;
  createdAt: string;
  updatedAt: string;
}

export class UserPresenter {
  static toHttp(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      ...(user.fullName === undefined ? {} : { fullName: user.fullName }),
      role: user.role,
      accountStatus: user.accountStatus,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }
}
