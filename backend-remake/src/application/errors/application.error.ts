export type ApplicationErrorKind =
  | 'validation'
  | 'not_found'
  | 'conflict'
  | 'unauthenticated'
  | 'forbidden'
  | 'business_rule'
  | 'rate_limited'
  | 'service_unavailable';

export interface ApplicationErrorOptions {
  code: string;
  kind: ApplicationErrorKind;
  details?: unknown;
  cause?: unknown;
}

export class ApplicationError extends Error {
  readonly code: string;
  readonly kind: ApplicationErrorKind;
  readonly details?: unknown;

  constructor(message: string, options: ApplicationErrorOptions) {
    super(message, { cause: options.cause });
    this.name = 'ApplicationError';
    this.code = options.code;
    this.kind = options.kind;
    this.details = options.details;
  }
}
