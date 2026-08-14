export interface ApiPaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponseMeta {
  timestamp: string;
  path: string;
  method: string;
  requestId: string;
}

export interface ApiSuccessResponseMeta<T> extends ApiResponseMeta {
  data: T | null;
}

export interface ApiSuccessResponse<T> {
  success: true;
  meta: ApiSuccessResponseMeta<T>;
}

export interface ApiPaginatedResponseMeta<T> extends ApiResponseMeta {
  data: readonly T[];
  pagination: ApiPaginationMeta;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  meta: ApiPaginatedResponseMeta<T>;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorBody;
  meta: ApiResponseMeta;
}
