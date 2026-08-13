export interface PageRequest {
  readonly page: number;
  readonly limit: number;
  readonly offset: number;
}

export function createPageRequest(page: number, limit: number): PageRequest {
  if (!Number.isSafeInteger(page) || page < 1) {
    throw new RangeError('page must be a positive integer');
  }

  if (!Number.isSafeInteger(limit) || limit < 1) {
    throw new RangeError('limit must be a positive integer');
  }

  return Object.freeze({
    page,
    limit,
    offset: (page - 1) * limit,
  });
}
