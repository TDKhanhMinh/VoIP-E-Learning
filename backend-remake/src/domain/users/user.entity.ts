// `guest` is the least-privileged role used for OAuth auto-provisioning.
export const USER_ROLES = ['admin', 'teacher', 'student', 'guest'] as const;
export type UserRole = (typeof USER_ROLES)[number];
export const USER_ACCOUNT_STATUSES = ['active', 'inactive'] as const;
export type UserAccountStatus = (typeof USER_ACCOUNT_STATUSES)[number];

export interface UserProperties {
  id: string;
  /** V1 persisted this as `full_name`; registration migration remains incremental. */
  fullName?: string;
  email: string;
  emailNormalized: string;
  passwordHash: string;
  accountStatus?: UserAccountStatus;
  emailVerifiedAt?: Date | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly properties: UserProperties) {}

  static create(properties: UserProperties): User {
    if (!USER_ROLES.includes(properties.role))
      throw new Error('User must have exactly one supported role.');
    return new User({
      ...properties,
      email: properties.email.trim(),
      emailNormalized: properties.emailNormalized.trim().toLowerCase(),
      role: properties.role,
      accountStatus: properties.accountStatus ?? 'active',
    });
  }

  get id(): string {
    return this.properties.id;
  }
  get email(): string {
    return this.properties.email;
  }
  get emailNormalized(): string {
    return this.properties.emailNormalized;
  }
  get fullName(): string | undefined {
    return this.properties.fullName;
  }
  get accountStatus(): UserAccountStatus {
    return this.properties.accountStatus ?? 'active';
  }
  get emailVerifiedAt(): Date | null {
    return this.properties.emailVerifiedAt ?? null;
  }
  get passwordHash(): string {
    return this.properties.passwordHash;
  }
  get role(): UserRole {
    return this.properties.role;
  }
  get createdAt(): Date {
    return this.properties.createdAt;
  }
  get updatedAt(): Date {
    return this.properties.updatedAt;
  }
}
