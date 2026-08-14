import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type {
  AuthSession,
  AuthSessionRepositoryPort,
} from '../../../../application/auth/ports/auth-session.repository.port';
import { AuthSessionPersistenceModel } from './auth-session.schema';

export class MongooseAuthSessionRepository implements AuthSessionRepositoryPort {
  constructor(
    @InjectModel(AuthSessionPersistenceModel.name)
    private readonly model: Model<AuthSessionPersistenceModel>,
  ) {}
  async create(session: AuthSession): Promise<void> {
    await this.model.create(session);
  }
  async findById(id: string): Promise<AuthSession | null> {
    const document = await this.model
      .findOne({ id })
      .select('+refreshTokenHash')
      .exec();
    return document
      ? {
          id: document.id,
          userId: document.userId,
          refreshTokenHash: document.refreshTokenHash,
          expiresAt: document.expiresAt,
          revokedAt: document.revokedAt,
          userAgent: document.userAgent,
          ipAddress: document.ipAddress,
          lastUsedAt: document.lastUsedAt,
        }
      : null;
  }
  async rotateRefreshToken(
    id: string,
    refreshTokenHash: string,
    expiresAt: Date,
  ): Promise<void> {
    await this.model
      .updateOne(
        { id, revokedAt: null },
        { $set: { refreshTokenHash, expiresAt, lastUsedAt: new Date() } },
      )
      .exec();
  }
  async revoke(id: string): Promise<void> {
    await this.model
      .updateOne({ id, revokedAt: null }, { $set: { revokedAt: new Date() } })
      .exec();
  }

  async revokeAllForUser(userId: string): Promise<number> {
    const result = await this.model
      .updateMany(
        { userId, revokedAt: null },
        { $set: { revokedAt: new Date() } },
      )
      .exec();
    return result.modifiedCount;
  }
}
