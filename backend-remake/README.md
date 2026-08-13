# backend-remake

NestJS backend V2 for the VoIP E-Learning system. This project is the clean-architecture rewrite target; the legacy backend remains unchanged and is the behavioral reference during migration.

## Current baseline

- NestJS 11 and TypeScript in strict mode.
- URI-versioned API prefix: `/api/v1`.
- Joi-validated environment configuration with fail-fast startup.
- Global DTO validation, Helmet, CORS allowlist and rate limiting.
- Structured Pino logging with secret redaction and `x-request-id` correlation.
- Optional Mongoose infrastructure adapter controlled by `MONGO_ENABLED`.
- Liveness: `GET /api/v1/health/live`.
- Readiness: `GET /api/v1/health/ready`.
- Swagger UI: `/api/docs`; OpenAPI JSON: `/api/docs-json`.
- SIP/Asterisk and AWS recording are disabled by default in `.env.example`.

## API response contract

Every successful HTTP response is wrapped by a global interceptor:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-08-13T00:00:00.000Z",
    "path": "/api/v1/health/live",
    "method": "GET",
    "requestId": "request-id"
  }
}
```

Every handled or unexpected error uses the same envelope:

```json
{
  "success": false,
  "error": {
    "code": "COURSE_NOT_FOUND",
    "message": "Course was not found",
    "details": {}
  },
  "meta": {
    "timestamp": "2026-08-13T00:00:00.000Z",
    "path": "/api/v1/course/missing-course",
    "method": "GET",
    "requestId": "request-id"
  }
}
```

Clients may send a valid `x-request-id`; otherwise the API generates one and always returns it in the response header and metadata. Unknown server errors are logged with this ID, while their internal details are not returned to clients.

Application use cases throw the framework-free `ApplicationError`. The global HTTP filter maps its semantic `kind` to an HTTP status, so the application layer never imports NestJS or HTTP constants.

Binary downloads, streams or webhook endpoints that require an exact body can opt out with `@SkipResponseEnvelope()`. Errors from those endpoints still use the global error format.

## Pagination contract

Paginated endpoints accept one-based `page` and `limit` query parameters:

- `page` defaults to `1`.
- `limit` defaults to `20`.
- `limit` cannot exceed `100`.
- Invalid, negative, decimal or unsafe integer values return `422 INVALID_PAGINATION`.

Controllers parse the query with `PaginationQueryPipe`, pass the resulting `PageRequest` to a use case and return `PaginatedResult<T>`. The global interceptor converts it automatically:

```json
{
  "success": true,
  "meta": {
    "data": [{ "id": "course-1" }],
    "timestamp": "2026-08-13T00:00:00.000Z",
    "path": "/api/v1/courses?page=2&limit=20",
    "method": "GET",
    "requestId": "request-id",
    "pagination": {
      "page": 2,
      "limit": 20,
      "totalItems": 45,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPreviousPage": true
    }
  }
}
```

Only paginated responses use `meta.data` and omit top-level `data`. Non-paginated responses keep the standard `{ success, data, meta }` envelope.

Repository adapters use `pageRequest.offset` and `pageRequest.limit` for database queries and must return the matching total item count. They must also apply a deterministic sort to prevent duplicate or missing rows between pages.

## Architecture

```text
src/
  domain/               Enterprise rules and framework-free entities
  application/          Use cases and inbound/outbound ports
  interface-adapters/   HTTP controllers, presenters and mappers
  infrastructure/       NestJS, persistence and external-service adapters
  app.module.ts         Dependency composition
  main.ts               Process bootstrap
```

Dependency direction:

```text
infrastructure/interface-adapters -> application -> domain
```

The `domain` layer must not import NestJS, Express, Mongoose or vendor SDKs. Application use cases depend on ports; concrete adapters are wired in `AppModule`.

The health slice is intentionally small and demonstrates the expected flow:

```text
HealthController
  -> GetSystemHealthUseCase
  -> ClockPort
  -> SystemClockAdapter

HealthController
  -> GetSystemReadinessUseCase
  -> SystemReadinessPort
  -> DisabledMongoReadinessAdapter | MongoReadinessAdapter
```

ESLint enforces that `domain` and `application` cannot import NestJS, Express, Mongoose, interface adapters or infrastructure implementations.

## Environment

Copy `.env.example` and adjust values for the target environment. Important defaults:

- `MONGO_ENABLED=false` keeps the API fully operational without opening a MongoDB connection.
- When `MONGO_ENABLED=true`, `MONGO_URI` becomes mandatory.
- `CORS_ORIGINS` is a comma-separated allowlist.
- `RATE_LIMIT_TTL_MS=60000` and `RATE_LIMIT_MAX=100` define the default throttle.
- `TRUST_PROXY=true` should be enabled only behind a trusted reverse proxy.
- SIP/Asterisk and AWS recording remain disabled until their adapters are implemented and smoke-tested.

## Setup

```bash
npm install
copy .env.example .env
npm run start:dev
```

## Verification

```bash
npm run lint
npm run format:check
npm run test
npm run test:e2e
npm run build
npm audit --omit=dev --audit-level=high
```

The dedicated GitHub Actions workflow also builds the production Docker image. To verify it locally:

```bash
docker build -t backend-remake:local .
docker run --rm -p 3000:3000 --env-file .env backend-remake:local
```

## Migration rules

1. Inventory and contract-test the legacy endpoint before rewriting it.
2. Migrate one vertical domain slice at a time.
3. Preserve the existing frontend-facing contract unless a versioned change is approved.
4. Keep Mongoose schemas and third-party SDKs in infrastructure adapters.
5. Keep authorization and business invariants inside application/domain policies.
6. Do not enable SIP/Asterisk or AWS recording until new adapters and runtime smoke tests exist.
7. Record runtime evidence separately from unit/build evidence.

## Planned migration order

1. Configuration, error handling, logging and test harness.
2. Semester and Course pilot modules.
3. Class, Enrollment and Attendance.
4. Assignment, Submission and Online Test.
5. Auth and User hardening.
6. Chat, Forum, Socket.IO and background jobs.
7. LiveKit, Google Drive, Gemini and other integrations.
