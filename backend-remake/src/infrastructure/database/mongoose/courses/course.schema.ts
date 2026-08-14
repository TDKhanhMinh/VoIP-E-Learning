import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<CoursePersistenceModel>;

@Schema({ collection: 'courses', timestamps: true, versionKey: false })
export class CoursePersistenceModel {
  @Prop({ type: String }) _id!: string;
  @Prop({ required: true, trim: true }) code!: string;
  @Prop({ required: true, trim: true }) codeNormalized!: string;
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ type: String }) title?: string;
  @Prop({ type: Number, min: 1 }) credit?: number;
  @Prop({ type: String, default: null }) description?: string | null;
  @Prop({ required: true, index: true }) ownerId!: string;
  createdAt!: Date;
  updatedAt!: Date;
}

export const CourseSchema = SchemaFactory.createForClass(
  CoursePersistenceModel,
);
CourseSchema.index(
  { codeNormalized: 1 },
  { unique: true, name: 'courses_code_normalized_unique' },
);
CourseSchema.index({ code: 1 }, { unique: true, name: 'courses_code_unique' });
// `title` is nullable in the remake pilot but unique in V1. A sparse index
// preserves the V1 constraint without blocking pilot records that only use name.
CourseSchema.index(
  { title: 1 },
  { unique: true, sparse: true, name: 'courses_title_unique' },
);
CourseSchema.index(
  { createdAt: -1, _id: -1 },
  { name: 'courses_created_at_pagination' },
);
CourseSchema.index(
  { ownerId: 1, createdAt: -1, _id: -1 },
  { name: 'courses_owner_created_at' },
);
