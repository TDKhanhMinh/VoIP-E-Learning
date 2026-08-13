import type { PageRequest } from '../pagination/page-request';
import type { PaginatedResult } from '../pagination/paginated-result';
import type { Course } from '../../domain/courses/course.entity';
import type { CourseRepositoryPort } from './ports/course.repository.port';

export class ListCoursesUseCase {
  constructor(private readonly courses: CourseRepositoryPort) {}
  execute(pageRequest: PageRequest): Promise<PaginatedResult<Course>> {
    return this.courses.list(pageRequest);
  }
}
