# backend-remake

NestJS backend V2 for the VoIP E-Learning system. This project is the clean-architecture rewrite target; the legacy backend remains unchanged and is the behavioral reference during migration.

## Current baseline

- NestJS 11 and TypeScript in strict mode.
- URI-versioned API prefix: `/api/v1`.
- Joi-validated environment configuration with fail-fast startup.
- Global DTO validation, Helmet, CORS allowlist and rate limiting.
- Structured Pino logging with secret redaction and `x-request-id` correlation.
- Optional Mongoose infrastructure adapter controlled by `MONGO_ENABLED`.
- MongoDB-backed User/Auth and Course pilot vertical slices.
- Liveness: `GET /api/v1/health/live`.
- Readiness: `GET /api/v1/health/ready`.
- Authentication is deny-by-default with a four-route anonymous allowlist.
- Swagger is disabled by default; opt-in non-release docs use `/api/docs` and `/api/docs-json`.
- Every external provider is composition OFF during Phase 00.

Phase 00 decisions, V1 surface inventory and migration contracts are indexed in [docs/phase-00/README.md](docs/phase-00/README.md).

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
- `SWAGGER_ENABLED=false` keeps API documentation unmounted by default.
- Every provider flag is locked OFF in Phase 00. Keep/retire/deferred lifecycle is documented in the integration capability matrix; a flag alone cannot compose a provider.
- JWT access and refresh secrets are required in production; never reuse development values.

## Local MongoDB and tests

The committed `compose.yaml` starts an authenticated single-node MongoDB replica set. It stores local data in the `mongo-data` Docker volume.

```bash
npm run infra:up
copy .env.example .env
copy .env.test.example .env.test
```

`.env.test` always targets a database ending in `_test`. The integration test harness rejects every other database name before it deletes data. Do not point this file to shared, staging or production MongoDB.

```bash
npm run test:integration
npm run test:e2e
npm run infra:down
```

GitHub Actions uses an isolated MongoDB service with its own `voip_elearning_test` database. SIP and AWS remain disabled in every test environment.

## Persistence and migrations

Each domain slice follows this boundary:

```text
HTTP controller -> application use case -> repository port -> Mongoose adapter -> MongoDB
```

Mongoose schemas, query filters and `ObjectId`/driver details remain in `infrastructure`. Repository ports and domain entities remain framework-free. Pagination queries use the deterministic `{ createdAt: -1, _id: -1 }` sort.

Production has `MONGO_AUTO_INDEX=false`. Apply explicit migrations as part of deployment rather than relying on application startup:

```bash
npm run migration:status
npm run migration:up
```

Migrations are append-only and recorded in `schema_migrations`. Use expand-migrate-contract for destructive schema changes.

## Authentication and authorization

- `POST /api/v1/auth/login` issues a short-lived access token and sends the refresh token as an `HttpOnly`, `SameSite=Lax` cookie.
- `POST /api/v1/auth/refresh` rotates the refresh token. Reuse of an older refresh token revokes that session.
- `POST /api/v1/auth/logout` revokes the active session; `GET /api/v1/auth/me` requires a bearer access token.
- `POST /api/v1/auth/register` is intentionally not mounted. User creation will be an authenticated admin use case.
- `DefaultAuthenticationGuard` authenticates every route unless it has a typed `@PublicRoute` allowlist entry; `RolesGuard` handles broad roles. Ownership checks belong in application policies such as `assertResourceOwnership`, not only in controllers.

The Course pilot demonstrates a protected vertical slice: signed-in users can list courses, while `admin` and `teacher` can create them. Secure first-admin/user administration is introduced only in the dedicated User administration slice.

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
npm run security:check
npm run test
npm run test:integration
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
6. Add indexes through migrations; map duplicate-key errors to application conflicts.
7. Do not enable any provider until its capability gate, adapter, authorization, provider-off/smoke tests and approval exist.
8. Record runtime evidence separately from unit/build evidence.

## Planned migration order

1. Configuration, error handling, logging and test harness.
2. Semester and Course pilot modules.
3. Class, Enrollment and Attendance.
4. Assignment, Submission and Online Test.
5. Auth and User hardening.
6. Chat, Forum, Socket.IO and background jobs.
7. LiveKit, Cloudinary, email and other approved integrations. Google Drive is retired; Recording/AWS/Gemini and SIP/Asterisk remain deferred/disabled.
