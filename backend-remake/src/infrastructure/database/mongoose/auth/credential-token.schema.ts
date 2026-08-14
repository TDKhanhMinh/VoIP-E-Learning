import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  CREDENTIAL_TOKEN_PURPOSES,
  type CredentialTokenPurpose,
} from '../../../../application/auth/ports/credential-token.repository.port';

export type CredentialTokenDocument =
  HydratedDocument<CredentialTokenPersistenceModel>;

@Schema({ collection: 'credential_tokens', versionKey: false })
export class CredentialTokenPersistenceModel {
  @Prop({ required: true, unique: true }) id!: string;
  @Prop({ required: true, index: true }) userId!: string;
  @Prop({
    type: String,
    required: true,
    enum: CREDENTIAL_TOKEN_PURPOSES,
    index: true,
  })
  purpose!: CredentialTokenPurpose;
  @Prop({ required: true, unique: true, select: false }) tokenHash!: string;
  @Prop({ required: true, index: true }) expiresAt!: Date;
  @Prop({ type: Date, default: null, index: true }) consumedAt!: Date | null;
  @Prop({ required: true, index: true }) createdAt!: Date;
}

export const CredentialTokenSchema = SchemaFactory.createForClass(
  CredentialTokenPersistenceModel,
);
CredentialTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: 'credential_tokens_expiry_ttl' },
);
CredentialTokenSchema.index(
  { userId: 1, purpose: 1, createdAt: -1 },
  { name: 'credential_tokens_rate_window' },
);
