import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types } from 'mongoose';

export type CourseDocument = HydratedDocument<CoursePersistenceModel>;

@Schema({ collection: 'courses', timestamps: true, versionKey: false })
export class CoursePersistenceModel {
  @Prop({ type: MongooseSchema.Types.ObjectId }) _id!: Types.ObjectId;
  @Prop({ required: true, trim: true }) code!: string;
  @Prop({ required: true, trim: true }) codeNormalized!: string;
  @Prop({ required: true, trim: true }) name!: string;
  @Prop({ type: String, required: true, trim: true }) title!: string;
  @Prop({ type: Number, required: true, min: 1 }) credit!: number;
  @Prop({ type: String, default: null }) description?: string | null;
  @Prop({ type: MongooseSchema.Types.ObjectId, index: true })
  ownerId?: Types.ObjectId;
  @Prop({ type: Date, default: null, index: true })
  archivedAt!: Date | null;
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
// Retain the V1 title uniqueness contract. The sparse option remains for
// pre-migration legacy records; all new writes require title.
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
