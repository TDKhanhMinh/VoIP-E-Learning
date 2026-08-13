import type { PageRequest } from '../../pagination/page-request';
import type { PaginatedResult } from '../../pagination/paginated-result';
import type { Course } from '../../../domain/courses/course.entity';

export const COURSE_REPOSITORY = Symbol('COURSE_REPOSITORY');

export interface CourseRepositoryPort {
  findByCodeNormalized(codeNormalized: string): Promise<Course | null>;
  save(course: Course): Promise<void>;
  list(pageRequest: PageRequest): Promise<PaginatedResult<Course>>;
}
