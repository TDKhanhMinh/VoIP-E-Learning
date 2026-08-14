import type { PageRequest } from '../../pagination/page-request';
import type { PaginatedResult } from '../../pagination/paginated-result';
import type { Course } from '../../../domain/courses/course.entity';

export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');

export interface CourseListOptions {
  includeArchived?: boolean;
  /** Exact match against the persisted normalized code. */
  codeNormalized?: string;
}

export interface CourseRepositoryPort {
  findById(id: string): Promise<Course | null>;
  findByCodeNormalized(codeNormalized: string): Promise<Course | null>;
  save(course: Course): Promise<void>;
  update(
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
  ): Promise<Course | null>;
  list(
    pageRequest: PageRequest,
    options?: CourseListOptions,
  ): Promise<PaginatedResult<Course>>;
  countReferences(id: string): Promise<number>;
}
