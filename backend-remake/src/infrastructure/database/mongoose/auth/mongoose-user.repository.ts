import { InjectModel } from '@nestjs/mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection, Model } from 'mongoose';
import { ApplicationError } from '../../../../application/errors/application.error';
import type { UserRepositoryPort } from '../../../../application/auth/ports/user.repository.port';
import { User } from '../../../../domain/users/user.entity';
import type {
  UserAccountStatus,
  UserRole,
} from '../../../../domain/users/user.entity';
import type { PageRequest } from '../../../../application/pagination/page-request';
import { PaginatedResult } from '../../../../application/pagination/paginated-result';
import { type UserDocument, UserPersistenceModel } from './user.schema';
import { fromMongoObjectId, toMongoObjectId } from '../mongo-object-id.mapper';

export class MongooseUserRepository implements UserRepositoryPort {
  constructor(
    @InjectModel('User')
    private readonly model: Model<UserPersistenceModel>,
    @InjectConnection() private readonly connection: Connection,
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
        role: user.role,
        emailVerifiedAt: user.emailVerifiedAt,
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

  async list(options: {
    role?: UserRole;
    accountStatus?: UserAccountStatus;
    pageRequest: PageRequest;
  }): Promise<PaginatedResult<User>> {
    const filter = {
      ...(options.role ? { role: options.role } : {}),
      ...(options.accountStatus
        ? { accountStatus: options.accountStatus }
        : {}),
    };
    const skip = (options.pageRequest.page - 1) * options.pageRequest.limit;
    const [documents, totalItems] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(options.pageRequest.limit)
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);
    return PaginatedResult.create({
      items: documents.map((document) => this.toDomain(document)),
      totalItems,
      pageRequest: options.pageRequest,
    });
  }

  async update(
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
  ): Promise<User | null> {
    try {
      const document = await this.model
        .findByIdAndUpdate(
          toMongoObjectId(id, 'user.id'),
          { $set: changes },
          {
            returnDocument: 'after',
            runValidators: true,
          },
        )
        .select('+passwordHash')
        .exec();
      return document ? this.toDomain(document) : null;
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error))
        throw new ApplicationError('An account already exists for this email', {
          code: 'EMAIL_ALREADY_EXISTS',
          kind: 'conflict',
        });
      throw error;
    }
  }

  async hardDelete(
    id: string,
  ): Promise<'deleted' | 'not-found' | 'referenced'> {
    const objectId = toMongoObjectId(id, 'user.id');
    const referenceCollections = [
      'classes',
      'classstudents',
      'enrollments',
      'attendances',
      'submissions',
      'attempts',
      'posts',
      'comments',
      'messages',
      'audit_logs',
    ];
    for (const collectionName of referenceCollections) {
      const collection = this.connection.db?.collection(collectionName);
      if (!collection) continue;
      const referenced = await collection.countDocuments({
        $or: [
          { userId: objectId },
          { user_id: objectId },
          { student: objectId },
          { createdBy: objectId },
          { created_by: objectId },
          { authorId: objectId },
          { senderId: objectId },
          { recipientId: objectId },
        ],
      });
      if (referenced > 0) return 'referenced';
    }
    const result = await this.model.deleteOne({ _id: objectId }).exec();
    return result.deletedCount === 1 ? 'deleted' : 'not-found';
  }

  private toDomain(document: UserDocument): User {
    return User.create({
      id: fromMongoObjectId(document._id),
      fullName: document.fullName,
      email: document.email,
      emailNormalized: document.emailNormalized,
      passwordHash: document.passwordHash,
      accountStatus: document.accountStatus,
      role: document.role,
      emailVerifiedAt: document.emailVerifiedAt,
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
