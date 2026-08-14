export const USER_ROLES = ['admin', 'teacher', 'student'] as const;
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
  roles: readonly UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  private constructor(private readonly properties: UserProperties) {}

  static create(properties: UserProperties): User {
    return new User({
      ...properties,
      email: properties.email.trim(),
      emailNormalized: properties.emailNormalized.trim().toLowerCase(),
      roles: [...properties.roles],
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
  get passwordHash(): string {
    return this.properties.passwordHash;
  }
  get roles(): readonly UserRole[] {
    return this.properties.roles;
  }
  get createdAt(): Date {
    return this.properties.createdAt;
  }
  get updatedAt(): Date {
    return this.properties.updatedAt;
  }
}
