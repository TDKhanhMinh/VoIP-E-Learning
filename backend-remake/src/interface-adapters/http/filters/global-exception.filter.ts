import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import {
  ApplicationError,
  type ApplicationErrorKind,
} from '../../../application/errors/application.error';
import type { ApiErrorBody, ApiErrorResponse } from '../contracts/api-response';
import {
  createResponseMeta,
  type RequestWithContext,
} from '../request-context';

interface NormalizedError {
  status: number;
  body: ApiErrorBody;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const httpContext = host.switchToHttp();
    const request = httpContext.getRequest<RequestWithContext>();
    const response = httpContext.getResponse<Response>();
    const normalizedError = this.normalizeException(exception);
    const meta = createResponseMeta(request, response);

    if (normalizedError.status >= 500) {
      const trace =
        exception instanceof Error
          ? (exception.stack ?? exception.message)
          : 'A non-Error value was thrown';

      this.logger.error(
        `${meta.method} ${meta.path} failed [requestId=${meta.requestId}]`,
        trace,
      );
    }

    const body: ApiErrorResponse = {
      success: false,
      error: normalizedError.body,
      meta,
    };

    response.status(normalizedError.status).json(body);
  }

  private normalizeException(exception: unknown): NormalizedError {
    if (exception instanceof ApplicationError) {
      return {
        status: this.applicationErrorStatus(exception.kind),
        body: {
          code: exception.code,
          message: exception.message,
          ...(exception.details === undefined
            ? {}
            : { details: exception.details }),
        },
      };
    }

    if (exception instanceof HttpException) {
      return this.normalizeHttpException(exception);
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      body: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
    };
  }

  private normalizeHttpException(exception: HttpException): NormalizedError {
    const status = exception.getStatus();
    const payload: unknown = exception.getResponse();

    if (typeof payload === 'string') {
      return {
        status,
        body: {
          code: this.httpStatusCode(status),
          message: payload,
        },
      };
    }

    if (!this.isRecord(payload)) {
      return {
        status,
        body: {
          code: this.httpStatusCode(status),
          message: exception.message,
        },
      };
    }

    const rawMessage = payload.message;
    const isValidationError =
      Array.isArray(rawMessage) &&
      rawMessage.every((message) => typeof message === 'string');
    const message = isValidationError
      ? 'Validation failed'
      : typeof rawMessage === 'string'
        ? rawMessage
        : exception.message;
    const code =
      typeof payload.code === 'string'
        ? payload.code
        : isValidationError
          ? 'VALIDATION_ERROR'
          : this.httpStatusCode(status);
    const details = isValidationError ? rawMessage : payload.details;

    return {
      status,
      body: {
        code,
        message,
        ...(details === undefined ? {} : { details }),
      },
    };
  }

  private applicationErrorStatus(kind: ApplicationErrorKind): number {
    const statusByKind: Record<ApplicationErrorKind, number> = {
      validation: HttpStatus.UNPROCESSABLE_ENTITY,
      not_found: HttpStatus.NOT_FOUND,
      conflict: HttpStatus.CONFLICT,
      unauthenticated: HttpStatus.UNAUTHORIZED,
      forbidden: HttpStatus.FORBIDDEN,
      business_rule: HttpStatus.UNPROCESSABLE_ENTITY,
      rate_limited: HttpStatus.TOO_MANY_REQUESTS,
      service_unavailable: HttpStatus.SERVICE_UNAVAILABLE,
    };

    return statusByKind[kind];
  }

  private httpStatusCode(status: number): string {
    const codeByStatus: Partial<Record<number, string>> = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'UNPROCESSABLE_ENTITY',
      [HttpStatus.TOO_MANY_REQUESTS]: 'TOO_MANY_REQUESTS',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_SERVER_ERROR',
    };

    return codeByStatus[status] ?? `HTTP_${status}`;
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
