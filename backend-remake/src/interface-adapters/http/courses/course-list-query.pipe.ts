import { Injectable, type PipeTransform } from '@nestjs/common';
import type { PageRequest } from '../../../application/pagination/page-request';
import { ApplicationError } from '../../../application/errors/application.error';
import { PaginationQueryPipe } from '../pipes/pagination-query.pipe';

interface RawCourseListQuery {
  page?: unknown;
  limit?: unknown;
  code?: unknown;
}

export interface CourseListQuery {
  pageRequest: PageRequest;
  code?: string;
}

/**
 * Course `code` filtering is an exact, case-insensitive match after trimming.
 * Pagination metadata therefore describes the filtered result set.
 */
@Injectable()
export class CourseListQueryPipe implements PipeTransform<
  RawCourseListQuery,
  CourseListQuery
> {
  private readonly pagination = new PaginationQueryPipe();

  transform(query: RawCourseListQuery): CourseListQuery {
    const pageRequest = this.pagination.transform(query);
    if (query.code === undefined || query.code === '') return { pageRequest };
    if (typeof query.code !== 'string') throw this.invalidCodeFilter();

    const code = query.code.trim();
    if (code.length < 2 || code.length > 32 || !/^[A-Za-z0-9-]+$/.test(code))
      throw this.invalidCodeFilter();

    return { pageRequest, code };
  }

  private invalidCodeFilter(): ApplicationError {
    return new ApplicationError('Invalid course code filter', {
      code: 'INVALID_COURSE_FILTER',
      kind: 'validation',
      details: {
        code: 'must be 2-32 letters, numbers, or hyphens; matching is exact and case-insensitive',
      },
    });
  }
}
