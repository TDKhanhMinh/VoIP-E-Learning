import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import { ApplicationError } from '../../../../application/errors/application.error';
import type { PageRequest } from '../../../../application/pagination/page-request';
import { PaginatedResult } from '../../../../application/pagination/paginated-result';
import type { CourseRepositoryPort } from '../../../../application/courses/ports/course.repository.port';
import { Course } from '../../../../domain/courses/course.entity';
import { type CourseDocument, CoursePersistenceModel } from './course.schema';
import { fromMongoObjectId, toMongoObjectId } from '../mongo-object-id.mapper';

export class MongooseCourseRepository implements CourseRepositoryPort {
  constructor(
    @InjectModel('Course')
    private readonly model: Model<CoursePersistenceModel>,
  ) {}
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
  async list(pageRequest: PageRequest): Promise<PaginatedResult<Course>> {
    const [documents, totalItems] = await Promise.all([
      this.model
        .find()
        .sort({ createdAt: -1, _id: -1 })
        .skip(pageRequest.offset)
        .limit(pageRequest.limit)
        .exec(),
      this.model.countDocuments(),
    ]);
    return PaginatedResult.create({
      items: documents.map((document) => this.toDomain(document)),
      totalItems,
      pageRequest,
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
