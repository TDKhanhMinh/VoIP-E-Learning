import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { ApplicationError } from '../../../../application/errors/application.error';
import type { PageRequest } from '../../../../application/pagination/page-request';
import { PaginatedResult } from '../../../../application/pagination/paginated-result';
import type {
  CourseListOptions,
  CourseRepositoryPort,
} from '../../../../application/courses/ports/course.repository.port';
import { Course } from '../../../../domain/courses/course.entity';
import { type CourseDocument, CoursePersistenceModel } from './course.schema';
import { fromMongoObjectId, toMongoObjectId } from '../mongo-object-id.mapper';

export class MongooseCourseRepository implements CourseRepositoryPort {
  constructor(
    @InjectModel('Course')
    private readonly model: Model<CoursePersistenceModel>,
  ) {}
  async findById(id: string): Promise<Course | null> {
    const document = await this.model
      .findOne({ _id: toMongoObjectId(id, 'course.id'), archivedAt: null })
      .exec();
    return document ? this.toDomain(document) : null;
  }
  async findByCodeNormalized(codeNormalized: string): Promise<Course | null> {
    const document = await this.model.findOne({ codeNormalized }).exec();
    return document ? this.toDomain(document) : null;
  }
  async save(course: Course): Promise<void> {
    try {
      await this.model.create({
        _id: toMongoObjectId(course.id, 'course.id'),
        code: course.code,
        codeNormalized: course.codeNormalized,
        name: course.name,
        title: course.title,
        credit: course.credit,
        description: course.description,
        ownerId: course.ownerId
          ? toMongoObjectId(course.ownerId, 'course.ownerId')
          : undefined,
        archivedAt: course.archivedAt,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      });
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error))
        throw new ApplicationError('Course code already exists', {
          code: 'COURSE_CODE_ALREADY_EXISTS',
          kind: 'conflict',
        });
      throw error;
    }
  }
  async update(
    id: string,
    changes: Partial<{
      code: string;
      codeNormalized: string;
      name: string;
      title: string;
      credit: number;
      description: string | null;
      ownerId: string | undefined;
      archivedAt: Date | null;
      updatedAt: Date;
    }>,
  ): Promise<Course | null> {
    try {
      const document = await this.model
        .findByIdAndUpdate(
          toMongoObjectId(id, 'course.id'),
          { $set: changes },
          { returnDocument: 'after', runValidators: true },
        )
        .exec();
      return document ? this.toDomain(document) : null;
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error))
        throw new ApplicationError('Course code or title already exists', {
          code: 'COURSE_DUPLICATE',
          kind: 'conflict',
        });
      throw error;
    }
  }
  async list(
    pageRequest: PageRequest,
    options: CourseListOptions = {},
  ): Promise<PaginatedResult<Course>> {
    const filter: { archivedAt?: null; codeNormalized?: string } = {
      ...(options.includeArchived ? {} : { archivedAt: null }),
      ...(options.codeNormalized
        ? { codeNormalized: options.codeNormalized }
        : {}),
    };
    const [documents, totalItems] = await Promise.all([
      this.model
        .find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip(pageRequest.offset)
        .limit(pageRequest.limit)
        .exec(),
      this.model.countDocuments(filter),
    ]);
    return PaginatedResult.create({
      items: documents.map((document) => this.toDomain(document)),
      totalItems,
      pageRequest,
    });
  }
  async countReferences(id: string): Promise<number> {
    const objectId = toMongoObjectId(id, 'course.id');
    const collection = this.model.db.collection('classes');
    return collection.countDocuments({
      $or: [{ course: objectId }, { courseId: objectId }],
    });
  }
  private toDomain(document: CourseDocument): Course {
    return Course.create({
      id: fromMongoObjectId(document._id),
      code: document.code,
      codeNormalized: document.codeNormalized,
      name: document.name,
      title: document.title,
      credit: document.credit,
      description: document.description,
      ownerId: document.ownerId
        ? fromMongoObjectId(document.ownerId)
        : undefined,
      archivedAt: document.archivedAt,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }
  private isDuplicateKeyError(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    );
  }
}
