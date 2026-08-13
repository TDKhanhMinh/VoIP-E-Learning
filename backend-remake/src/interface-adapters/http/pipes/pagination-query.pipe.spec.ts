import { ApplicationError } from '../../../application/errors/application.error';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_LIMIT,
  PaginationQueryPipe,
} from './pagination-query.pipe';

describe('PaginationQueryPipe', () => {
  const pipe = new PaginationQueryPipe();

  it('applies stable defaults', () => {
    const pageRequest = pipe.transform({});

    expect(pageRequest.page).toBe(DEFAULT_PAGE);
    expect(pageRequest.limit).toBe(DEFAULT_PAGE_LIMIT);
    expect(pageRequest.offset).toBe(0);
  });

  it('rejects values that could create unsafe database queries', () => {
    expect(() => pipe.transform({ page: '-1', limit: '1000' })).toThrow(
      ApplicationError,
    );
  });
});
