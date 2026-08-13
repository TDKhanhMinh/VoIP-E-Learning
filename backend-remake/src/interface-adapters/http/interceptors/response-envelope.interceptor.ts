import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Response } from 'express';
import { type Observable, map } from 'rxjs';
import { PaginatedResult } from '../../../application/pagination/paginated-result';
import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
} from '../contracts/api-response';
import { SKIP_RESPONSE_ENVELOPE } from '../decorators/skip-response-envelope.decorator';
import {
  createResponseMeta,
  type RequestWithContext,
} from '../request-context';

type EnvelopedResponse<T> =
  ApiSuccessResponse<T> | ApiPaginatedResponse<unknown>;

@Injectable()
export class ResponseEnvelopeInterceptor<T> implements NestInterceptor<
  T,
  EnvelopedResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<EnvelopedResponse<T>> {
    const skipEnvelope = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_ENVELOPE,
      [context.getHandler(), context.getClass()],
    );

    if (skipEnvelope) {
      return next.handle() as Observable<EnvelopedResponse<T>>;
    }

    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<RequestWithContext>();
    const response = httpContext.getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const meta = createResponseMeta(request, response);

        if (data instanceof PaginatedResult) {
          const paginatedResponse: ApiPaginatedResponse<unknown> = {
            success: true,
            meta: {
              ...meta,
              data: data.items,
              pagination: data.pagination,
            },
          };

          return paginatedResponse;
        }

        return {
          success: true,
          data: data === undefined ? null : data,
          meta,
        };
      }),
    );
  }
}
