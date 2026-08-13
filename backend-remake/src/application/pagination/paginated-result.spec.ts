import { createPageRequest } from './page-request';
import { PaginatedResult } from './paginated-result';

describe('PaginatedResult', () => {
  it('calculates stable pagination metadata', () => {
    const result = PaginatedResult.create({
      items: [{ id: 3 }, { id: 4 }],
      totalItems: 5,
      pageRequest: createPageRequest(2, 2),
    });

    expect(result.pagination).toEqual({
      page: 2,
      limit: 2,
      totalItems: 5,
      totalPages: 3,
      hasNextPage: true,
      hasPreviousPage: true,
    });
  });

  it('represents an empty collection with zero total pages', () => {
    const result = PaginatedResult.create({
      items: [],
      totalItems: 0,
      pageRequest: createPageRequest(1, 20),
    });

    expect(result.pagination.totalPages).toBe(0);
    expect(result.pagination.hasNextPage).toBe(false);
    expect(result.pagination.hasPreviousPage).toBe(false);
  });
});
