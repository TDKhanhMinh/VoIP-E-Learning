export const USER_ROLES = ['admin', 'teacher', 'student'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface UserProperties {
  id: string;
  /** V1 persisted this as `full_name`; registration migration remains incremental. */
  fullName?: string;
  email: string;
  emailNormalized: string;
  /** Retained only for a lossless V1 data migration. */
  legacyPasswordHash?: string;
  passwordHash: string;
  /** Inert migration field while SIP integration remains disabled. */
  sipPassword?: string;
  available?: boolean;
  legacyRole?: UserRole;
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
  get legacyPasswordHash(): string | undefined {
    return this.properties.legacyPasswordHash;
  }
  get sipPassword(): string | undefined {
    return this.properties.sipPassword;
  }
  get available(): boolean | undefined {
    return this.properties.available;
  }
  get legacyRole(): UserRole | undefined {
    return this.properties.legacyRole;
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
