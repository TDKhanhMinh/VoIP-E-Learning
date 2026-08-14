import { ApplicationError } from '../errors/application.error';
import type { ClockPort } from '../ports/clock.port';
import type { IdGeneratorPort } from '../ports/id-generator.port';
import type { PageRequest } from '../pagination/page-request';
import type { PaginatedResult } from '../pagination/paginated-result';
import type { CurrentActor } from '../auth/ports/token-service.port';
import { Course } from '../../domain/courses/course.entity';
import type { CourseRepositoryPort } from './ports/course.repository.port';

export interface CreateCourseInput {
  code: string;
  name?: string;
  title: string;
  credit: number;
  /** Required and non-empty on create to preserve the approved V1 contract. */
  description: string;
}

export interface UpdateCourseInput {
  code?: string;
  name?: string;
  title?: string;
  credit?: number;
  /** `null` explicitly clears a description; omission preserves it. */
  description?: string | null;
}

interface CourseNormalizationInput {
  code?: string;
  name?: string;
  title?: string;
  credit?: number;
  description?: string | null;
}

export class CourseCatalogService {
  constructor(
    private readonly courses: CourseRepositoryPort,
    private readonly ids: IdGeneratorPort,
    private readonly clock: ClockPort,
  ) {}

  list(
    pageRequest: PageRequest,
    options: { code?: string } = {},
  ): Promise<PaginatedResult<Course>> {
    const codeNormalized = options.code?.trim().toLowerCase();
    return this.courses.list(pageRequest, {
      ...(codeNormalized ? { codeNormalized } : {}),
    });
  }

  getById(id: string): Promise<Course | null> {
    return this.courses.findById(id);
  }

  async getByCode(code: string): Promise<Course | null> {
    const course = await this.courses.findByCodeNormalized(
      code.trim().toLowerCase(),
    );
    return course?.archivedAt ? null : course;
  }

  async create(actor: CurrentActor, input: CreateCourseInput): Promise<Course> {
    void actor;
    const fields = this.normalizeInput(input, 'create');
    if (await this.courses.findByCodeNormalized(fields.codeNormalized))
      throw this.conflict(
        'COURSE_CODE_ALREADY_EXISTS',
        'Course code already exists',
      );
    const now = this.clock.now();
    const course = Course.create({
      id: this.ids.generate(),
      code: fields.code,
      codeNormalized: fields.codeNormalized,
      name: fields.name,
      title: fields.title,
      credit: fields.credit,
      description: fields.description,
      // Catalog ownership is global; actor is retained for authorization/audit
      // at the controller boundary but not persisted as resource ownership.
      ownerId: undefined,
      archivedAt: null,
      createdAt: now,
      updatedAt: now,
    });
    await this.courses.save(course);
    return course;
  }

  async update(id: string, input: UpdateCourseInput): Promise<Course | null> {
    const existing = await this.courses.findById(id);
    if (!existing) return null;
    const fields = this.normalizeInput(
      {
        code: input.code ?? existing.code,
        name: input.name ?? existing.name,
        title: input.title ?? existing.title,
        credit: input.credit ?? existing.credit,
        description:
          input.description === undefined
            ? existing.description
            : input.description,
      },
      'update',
    );
    const duplicate = await this.courses.findByCodeNormalized(
      fields.codeNormalized,
    );
    if (duplicate && duplicate.id !== id)
      throw this.conflict(
        'COURSE_CODE_ALREADY_EXISTS',
        'Course code already exists',
      );
    return this.courses.update(id, {
      code: fields.code,
      codeNormalized: fields.codeNormalized,
      name: fields.name,
      title: fields.title,
      credit: fields.credit,
      description: fields.description,
      updatedAt: this.clock.now(),
    });
  }

  async archive(id: string): Promise<void> {
    const existing = await this.courses.findById(id);
    if (!existing)
      throw new ApplicationError('Course was not found', {
        code: 'COURSE_NOT_FOUND',
        kind: 'not_found',
      });
    if ((await this.courses.countReferences(id)) > 0)
      throw new ApplicationError(
        'Course has dependent classes and cannot be archived',
        { code: 'COURSE_HAS_DEPENDENCIES', kind: 'conflict' },
      );
    await this.courses.update(id, {
      archivedAt: this.clock.now(),
    });
  }

  private normalizeInput(
    input: CourseNormalizationInput,
    mode: 'create' | 'update',
  ) {
    const code = input.code?.trim().toUpperCase();
    const title = input.title?.trim();
    const name = input.name?.trim() || title;
    if (!code || !title || !name || input.credit === undefined)
      throw new ApplicationError('Course code, title and credit are required', {
        code: 'COURSE_INVALID_INPUT',
        kind: 'validation',
      });
    if (!Number.isInteger(input.credit) || input.credit < 1)
      throw new ApplicationError('Course credit must be a positive integer', {
        code: 'COURSE_INVALID_CREDIT',
        kind: 'validation',
      });

    const description =
      typeof input.description === 'string'
        ? input.description.trim()
        : input.description;
    if (
      (mode === 'create' && !description) ||
      (typeof description === 'string' && !description)
    )
      throw new ApplicationError(
        'Course description is required when creating and must be non-empty when provided',
        {
          code: 'COURSE_INVALID_DESCRIPTION',
          kind: 'validation',
        },
      );
    if (description === undefined)
      throw new ApplicationError('Course description must be provided', {
        code: 'COURSE_INVALID_DESCRIPTION',
        kind: 'validation',
      });
    return {
      code,
      codeNormalized: code.toLowerCase(),
      name,
      title,
      credit: input.credit,
      description,
    };
  }

  private conflict(code: string, message: string): ApplicationError {
    return new ApplicationError(message, { code, kind: 'conflict' });
  }
}
