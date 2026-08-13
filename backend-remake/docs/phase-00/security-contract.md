# Security contract

Baseline: 2026-08-13. Scope: `backend-remake` runtime and tracked files.

## HTTP authentication

Authentication is deny-by-default through `DefaultAuthenticationGuard`. A route is anonymous only when it carries a typed allowlist identifier.

| ID                 | Method/path                 | Public rationale                            |
| ------------------ | --------------------------- | ------------------------------------------- |
| `health.liveness`  | `GET /api/v1/health/live`   | Process probe; no business data             |
| `health.readiness` | `GET /api/v1/health/ready`  | Dependency state only                       |
| `auth.login`       | `POST /api/v1/auth/login`   | Access token does not exist yet             |
| `auth.refresh`     | `POST /api/v1/auth/refresh` | Refresh cookie exchange after access expiry |

There are no anonymous business reads. `/api/v1/auth/register` is deliberately unmounted. Swagger is disabled unless explicitly enabled outside the release contract.

New anonymous access requires a product requirement, allowlist entry, `@PublicRoute` decorator, negative auth test, exposure review and documentation update. Controller-local omission must never create public access.

## Output and logging rules

- API presenters return public DTOs; persistence documents are never returned directly.
- Password hashes, legacy password fields, refresh tokens, `sipPassword`, provider credentials and private keys are forbidden in responses.
- Logger redaction covers Authorization, cookies, password/token request fields and `Set-Cookie`.
- User persistence keeps legacy secret fields `select: false` only for controlled migration. This is not permission to include them in a domain presenter.
- Unexpected errors return a generic message and request ID, not internal details.

## Bootstrap and credentials

- No default-admin password, auto-admin bootstrap or self-registration route is mounted in the remake.
- First-admin creation is a Phase 02 secure manual/administrative procedure and remains unspecified.
- Production JWT secrets are required from the environment. Example/test values are explicitly non-production fixtures.
- All provider capabilities are composition OFF. Setting a Phase 00 provider flag to `true` fails configuration validation.

## Secret scanning

`npm run security:check` scans `backend-remake` source/config/docs while excluding generated dependency/build/output directories and without printing matched values. It rejects non-example environment files, credential/private-key files, private-key material, high-confidence cloud key patterns, hard-coded SIP passwords, default-admin passwords and a mounted self-registration route.

`npm run security:scan:repo` applies the same scan to the whole repository. It is expected to remain blocked until the already-known V1 credential incident and tracked frontend environment file are remediated through an approved security procedure. Do not add an allowlist that hides those findings.

## Required negative evidence

- Anonymous private/test and Course reads return `401 AUTHENTICATION_REQUIRED`.
- Registration returns `404` because it is not mounted.
- Login/current-user payloads do not contain `passwordHash` or `sipPassword`.
- Enabling Drive, Recording/AWS/Gemini or SIP flags is rejected.
- The scoped remake secret scan passes; repository-wide findings are reported only by rule and path.

## External blocker

Google service-account and Asterisk credentials exposed in V1 must be rotated/revoked and repository history cleaned by an authorized owner. This repository change neither performs nor proves that action.
