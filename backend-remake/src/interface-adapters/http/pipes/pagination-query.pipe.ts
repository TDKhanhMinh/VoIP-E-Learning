import { Injectable, type PipeTransform } from '@nestjs/common';
import { ApplicationError } from '../../../application/errors/application.error';
import {
  createPageRequest,
  type PageRequest,
} from '../../../application/pagination/page-request';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_LIMIT = 20;
export const MAX_PAGE_LIMIT = 100;

interface PaginationQuery {
  page?: unknown;
  limit?: unknown;
}

@Injectable()
export class PaginationQueryPipe implements PipeTransform<
  PaginationQuery,
  PageRequest
> {
  transform(query: PaginationQuery): PageRequest {
    const page = this.parsePositiveInteger(query.page, DEFAULT_PAGE);
    const limit = this.parsePositiveInteger(query.limit, DEFAULT_PAGE_LIMIT);

    if (page === null || limit === null || limit > MAX_PAGE_LIMIT) {
      throw new ApplicationError('Invalid pagination parameters', {
        code: 'INVALID_PAGINATION',
        kind: 'validation',
        details: {
          page: `must be a positive integer; default is ${DEFAULT_PAGE}`,
          limit: `must be a positive integer no greater than ${MAX_PAGE_LIMIT}; default is ${DEFAULT_PAGE_LIMIT}`,
        },
      });
    }

    return createPageRequest(page, limit);
  }

  private parsePositiveInteger(
    value: unknown,
    defaultValue: number,
  ): number | null {
    if (value === undefined || value === '') {
      return defaultValue;
    }

    if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
      return null;
    }

    const parsedValue = Number(value);
    return Number.isSafeInteger(parsedValue) ? parsedValue : null;
  }
}
