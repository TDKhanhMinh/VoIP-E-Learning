import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type SemesterDocument = HydratedDocument<SemesterPersistenceModel>;

@Schema({ collection: 'semesters', timestamps: true, versionKey: false })
export class SemesterPersistenceModel {
  @Prop({ type: MongooseSchema.Types.ObjectId }) _id!: Types.ObjectId;
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ required: true, trim: true }) nameNormalized!: string;
  @Prop({ required: true, type: Date }) startDate!: Date;
  @Prop({ required: true, type: Date }) endDate!: Date;
  @Prop({ type: Date, default: null }) midTermStartDate!: Date | null;
  @Prop({ type: Date, default: null }) midTermEndDate!: Date | null;
  @Prop({ type: Date, default: null, index: true }) archivedAt!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}

export const SemesterSchema = SchemaFactory.createForClass(
  SemesterPersistenceModel,
);
SemesterSchema.index(
  { nameNormalized: 1 },
  { unique: true, name: 'semesters_name_normalized_unique' },
);
