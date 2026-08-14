import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { ApplicationError } from '../../../../application/errors/application.error';
import type { UserRepositoryPort } from '../../../../application/auth/ports/user.repository.port';
import { User } from '../../../../domain/users/user.entity';
import { type UserDocument, UserPersistenceModel } from './user.schema';

export class MongooseUserRepository implements UserRepositoryPort {
  constructor(
    @InjectModel('User')
    private readonly model: Model<UserPersistenceModel>,
  ) {}

  async findByEmailNormalized(emailNormalized: string): Promise<User | null> {
    const document = await this.model
      .findOne({ emailNormalized })
      .select('+passwordHash')
      .exec();
    return document ? this.toDomain(document) : null;
  }

  async findById(id: string): Promise<User | null> {
    const document = await this.model
      .findById(id)
      .select('+passwordHash')
      .exec();
    return document ? this.toDomain(document) : null;
  }

  async save(user: User): Promise<void> {
    try {
      await this.model.create({
        _id: user.id,
        full_name: user.fullName,
        email: user.email,
        emailNormalized: user.emailNormalized,
        password: user.legacyPasswordHash,
        passwordHash: user.passwordHash,
        sipPassword: user.sipPassword,
        available: user.available,
        role: user.legacyRole,
        roles: [...user.roles],
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error))
        throw new ApplicationError('An account already exists for this email', {
          code: 'EMAIL_ALREADY_EXISTS',
          kind: 'conflict',
        });
      throw error;
    }
  }

  private toDomain(document: UserDocument): User {
    return User.create({
      id: document.id,
      fullName: document.full_name,
      email: document.email,
      emailNormalized: document.emailNormalized,
      legacyPasswordHash: document.password,
      passwordHash: document.passwordHash,
      sipPassword: document.sipPassword,
      available: document.available,
      legacyRole: document.role,
      roles: document.roles,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }
  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    );
  }
}
