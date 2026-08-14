import { randomUUID } from 'node:crypto';
import type { Request, Response } from 'express';
import type { ApiResponseMeta } from './contracts/api-response';

const REQUEST_ID_HEADER = 'x-request-id';
const REQUEST_ID_PATTERN = /^[a-zA-Z0-9._:-]{1,128}$/;

export interface RequestWithContext extends Request {
  requestId?: string;
}

export function resolveRequestId(value: unknown): string {
  return typeof value === 'string' && REQUEST_ID_PATTERN.test(value)
    ? value
    : randomUUID();
}

export function ensureRequestId(
  request: RequestWithContext,
  response: Response,
): string {
  if (request.requestId) {
    return request.requestId;
  }

  const loggerRequestId =
    typeof request.id === 'string' ? request.id : undefined;
  const requestId = loggerRequestId
    ? resolveRequestId(loggerRequestId)
    : resolveRequestId(request.header(REQUEST_ID_HEADER));

  request.requestId = requestId;
  response.setHeader(REQUEST_ID_HEADER, requestId);

  return requestId;
}

export function createResponseMeta(
  request: RequestWithContext,
  response: Response,
): ApiResponseMeta {
  return {
    timestamp: new Date().toISOString(),
    path: request.originalUrl,
    method: request.method,
    requestId: ensureRequestId(request, response),
  };
}
