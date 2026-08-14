import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { ApplicationError } from '../../../../application/errors/application.error';
import type { UserRepositoryPort } from '../../../../application/auth/ports/user.repository.port';
import { User } from '../../../../domain/users/user.entity';
import { type UserDocument, UserPersistenceModel } from './user.schema';
import { fromMongoObjectId, toMongoObjectId } from '../mongo-object-id.mapper';

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
      .findById(toMongoObjectId(id, 'user.id'))
      .select('+passwordHash')
      .exec();
    return document ? this.toDomain(document) : null;
  }

  async save(user: User): Promise<void> {
    try {
      await this.model.create({
        _id: toMongoObjectId(user.id, 'user.id'),
        fullName: user.fullName,
        email: user.email,
        emailNormalized: user.emailNormalized,
        passwordHash: user.passwordHash,
        accountStatus: user.accountStatus,
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
      id: fromMongoObjectId(document._id),
      fullName: document.fullName,
      email: document.email,
      emailNormalized: document.emailNormalized,
      passwordHash: document.passwordHash,
      accountStatus: document.accountStatus,
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
