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

export interface ApiSuccessResponse<T> {
  success: true;
  data: T | null;
  meta: ApiResponseMeta;
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
