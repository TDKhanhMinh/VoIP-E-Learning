import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseDocument = HydratedDocument<CoursePersistenceModel>;

@Schema({ collection: 'courses', timestamps: true, versionKey: false })
export class CoursePersistenceModel {
  @Prop({ type: String }) _id!: string;
  @Prop({ required: true, trim: true }) code!: string;
  @Prop({ required: true, trim: true }) codeNormalized!: string;
  @Prop({ required: true, trim: true }) name!: string;
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
CourseSchema.index(
  { createdAt: -1, _id: -1 },
  { name: 'courses_created_at_pagination' },
);
CourseSchema.index(
  { ownerId: 1, createdAt: -1, _id: -1 },
  { name: 'courses_owner_created_at' },
);
