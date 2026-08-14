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
        { $set: { refreshTokenHash, expiresAt } },
      )
      .exec();
  }
  async revoke(id: string): Promise<void> {
    await this.model
      .updateOne({ id, revokedAt: null }, { $set: { revokedAt: new Date() } })
      .exec();
  }
}
