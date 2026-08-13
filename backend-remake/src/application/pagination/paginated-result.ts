import type { PageRequest } from './page-request';

export interface PaginationMetadata {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResultOptions<T> {
  items: readonly T[];
  totalItems: number;
  pageRequest: PageRequest;
}

export class PaginatedResult<T> {
  readonly items: readonly T[];
  readonly pagination: PaginationMetadata;

  private constructor(items: readonly T[], pagination: PaginationMetadata) {
    this.items = items;
    this.pagination = pagination;
  }

  static create<T>(options: PaginatedResultOptions<T>): PaginatedResult<T> {
    const { items, totalItems, pageRequest } = options;

    if (!Number.isSafeInteger(totalItems) || totalItems < 0) {
      throw new RangeError('totalItems must be a non-negative integer');
    }

    if (items.length > pageRequest.limit) {
      throw new RangeError('items cannot exceed the requested page limit');
    }

    const totalPages =
      totalItems === 0 ? 0 : Math.ceil(totalItems / pageRequest.limit);

    return new PaginatedResult(items, {
      page: pageRequest.page,
      limit: pageRequest.limit,
      totalItems,
      totalPages,
      hasNextPage: pageRequest.page < totalPages,
      hasPreviousPage: totalPages > 0 && pageRequest.page > 1,
    });
  }
}
