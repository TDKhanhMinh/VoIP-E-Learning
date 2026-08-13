import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthSessionDocument = HydratedDocument<AuthSessionPersistenceModel>;

@Schema({ collection: 'auth_sessions', timestamps: true, versionKey: false })
export class AuthSessionPersistenceModel {
  @Prop({ required: true, unique: true }) id!: string;
  @Prop({ required: true, index: true }) userId!: string;
  @Prop({ required: true, select: false }) refreshTokenHash!: string;
  @Prop({ required: true, index: true }) expiresAt!: Date;
  @Prop({ type: Date, default: null }) revokedAt!: Date | null;
}

export const AuthSessionSchema = SchemaFactory.createForClass(
  AuthSessionPersistenceModel,
);
AuthSessionSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0, name: 'auth_sessions_expiry_ttl' },
);
