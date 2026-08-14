import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import type { Connection, Model } from 'mongoose';
import { ApplicationError } from '../../../../application/errors/application.error';
import type { PageRequest } from '../../../../application/pagination/page-request';
import { PaginatedResult } from '../../../../application/pagination/paginated-result';
import type { SemesterRepositoryPort } from '../../../../application/semesters/ports/semester.repository.port';
import { Semester } from '../../../../domain/semesters/semester.entity';
import {
  type SemesterDocument,
  SemesterPersistenceModel,
} from './semester.schema';
import { fromMongoObjectId, toMongoObjectId } from '../mongo-object-id.mapper';

export class MongooseSemesterRepository implements SemesterRepositoryPort {
  constructor(
    @InjectModel(SemesterPersistenceModel.name)
    private readonly model: Model<SemesterPersistenceModel>,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async findById(id: string): Promise<Semester | null> {
    const document = await this.model
      .findOne({ _id: toMongoObjectId(id, 'semester.id'), archivedAt: null })
      .exec();
    return document ? this.toDomain(document) : null;
  }

  async findByNameNormalized(nameNormalized: string): Promise<Semester | null> {
    const document = await this.model.findOne({ nameNormalized }).exec();
    return document ? this.toDomain(document) : null;
  }

  async save(semester: Semester): Promise<void> {
    try {
      await this.model.create(this.toPersistence(semester));
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error))
        throw new ApplicationError('Semester name already exists', {
          code: 'SEMESTER_NAME_ALREADY_EXISTS',
          kind: 'conflict',
        });
      throw error;
    }
  }

  async update(
    id: string,
    changes: Partial<{
      name: string;
      nameNormalized: string;
      startDate: Date;
      endDate: Date;
      midTermStartDate: Date | null;
      midTermEndDate: Date | null;
      archivedAt: Date | null;
      updatedAt: Date;
    }>,
  ): Promise<Semester | null> {
    try {
      const document = await this.model
        .findByIdAndUpdate(
          toMongoObjectId(id, 'semester.id'),
          { $set: changes },
          { returnDocument: 'after', runValidators: true },
        )
        .exec();
      return document ? this.toDomain(document) : null;
    } catch (error: unknown) {
      if (this.isDuplicateKeyError(error))
        throw new ApplicationError('Semester name already exists', {
          code: 'SEMESTER_NAME_ALREADY_EXISTS',
          kind: 'conflict',
        });
      throw error;
    }
  }

  async list(
    pageRequest: PageRequest,
    options: { includeArchived?: boolean } = {},
  ): Promise<PaginatedResult<Semester>> {
    const filter = options.includeArchived ? {} : { archivedAt: null };
    const [documents, totalItems] = await Promise.all([
      this.model
        .find(filter)
        .sort({ startDate: -1, _id: -1 })
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
    const objectId = toMongoObjectId(id, 'semester.id');
    const collection = this.connection.db?.collection('classes');
    if (!collection) return 0;
    return collection.countDocuments({
      $or: [{ semester: objectId }, { semesterId: objectId }],
    });
  }

  private toPersistence(semester: Semester) {
    return {
      _id: toMongoObjectId(semester.id, 'semester.id'),
      name: semester.name,
      nameNormalized: semester.nameNormalized,
      startDate: semester.startDate,
      endDate: semester.endDate,
      midTermStartDate: semester.midTermStartDate,
      midTermEndDate: semester.midTermEndDate,
      archivedAt: semester.archivedAt,
      createdAt: semester.createdAt,
      updatedAt: semester.updatedAt,
    };
  }

  private toDomain(document: SemesterDocument): Semester {
    return Semester.create({
      id: fromMongoObjectId(document._id),
      name: document.name,
      nameNormalized: document.nameNormalized,
      startDate: document.startDate,
      endDate: document.endDate,
      midTermStartDate: document.midTermStartDate,
      midTermEndDate: document.midTermEndDate,
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
