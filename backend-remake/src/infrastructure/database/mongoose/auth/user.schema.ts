import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';
import {
  USER_ACCOUNT_STATUSES,
  USER_ROLES,
  type UserAccountStatus,
  type UserRole,
} from '../../../../domain/users/user.entity';

export type UserDocument = HydratedDocument<UserPersistenceModel>;

@Schema({ collection: 'users', timestamps: true, versionKey: false })
export class UserPersistenceModel {
  @Prop({ type: MongooseSchema.Types.ObjectId }) _id!: Types.ObjectId;
  @Prop({ type: String }) fullName?: string;
  @Prop({ required: true, trim: true }) email!: string;
  @Prop({ required: true, trim: true, unique: true }) emailNormalized!: string;
  @Prop({ required: true, select: false }) passwordHash!: string;
  @Prop({ type: String, enum: USER_ACCOUNT_STATUSES, default: 'active' })
  accountStatus!: UserAccountStatus;
  @Prop({ type: [String], enum: USER_ROLES, default: ['student'] })
  roles!: UserRole[];
  createdAt!: Date;
  updatedAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserPersistenceModel);
UserSchema.index(
  { emailNormalized: 1 },
  { unique: true, name: 'users_email_normalized_unique' },
);
// V1 stores and queries the original email field; retain its uniqueness during
// the staged data migration while the remake uses `emailNormalized` at runtime.
UserSchema.index({ email: 1 }, { unique: true, name: 'users_email_unique' });
