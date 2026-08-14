import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type {
  CredentialTokenRecord,
  CredentialTokenRepositoryPort,
  CredentialTokenPurpose,
} from '../../../../application/auth/ports/credential-token.repository.port';
import {
  CredentialTokenPersistenceModel,
  type CredentialTokenDocument,
} from './credential-token.schema';

export class MongooseCredentialTokenRepository implements CredentialTokenRepositoryPort {
  constructor(
    @InjectModel(CredentialTokenPersistenceModel.name)
    private readonly model: Model<CredentialTokenPersistenceModel>,
  ) {}

  async create(token: CredentialTokenRecord): Promise<void> {
    await this.model.create(token);
  }

  async findActiveByHash(
    purpose: CredentialTokenPurpose,
    tokenHash: string,
    now: Date,
  ): Promise<CredentialTokenRecord | null> {
    const document = await this.model
      .findOne({
        purpose,
        tokenHash,
        consumedAt: null,
        expiresAt: { $gt: now },
      })
      .select('+tokenHash')
      .exec();
    return document ? this.toRecord(document) : null;
  }

  async consumeIfActive(id: string, now: Date): Promise<boolean> {
    const result = await this.model
      .updateOne(
        { id, consumedAt: null, expiresAt: { $gt: now } },
        { $set: { consumedAt: now } },
      )
      .exec();
    return result.modifiedCount === 1;
  }

  countIssuedSince(
    userId: string,
    purpose: CredentialTokenPurpose,
    since: Date,
  ): Promise<number> {
    return this.model.countDocuments({
      userId,
      purpose,
      createdAt: { $gte: since },
    });
  }

  private toRecord(document: CredentialTokenDocument): CredentialTokenRecord {
    return {
      id: document.id,
      userId: document.userId,
      purpose: document.purpose,
      tokenHash: document.tokenHash,
      expiresAt: document.expiresAt,
      consumedAt: document.consumedAt,
      createdAt: document.createdAt,
    };
  }
}
