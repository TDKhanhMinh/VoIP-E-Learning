export const USER_ROLES = ['admin', 'teacher', 'student'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface UserProperties {
  id: string;
  email: string;
  emailNormalized: string;
  passwordHash: string;
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
