# ADR-0003: Authentication by default and explicit public allowlist

- Status: Accepted
- Date: 2026-08-13
- Decision owner: stakeholder decision P00-Q03

## Context

V1 mounts many reads and destructive/provider routes without `protect`. Controller-local guards in the remake make a new route public when an engineer forgets to add a guard.

## Decision

- A global guard requires a valid Bearer access token by default.
- Anonymous routes require a typed `@PublicRoute` identifier present in the central allowlist.
- The production allowlist is limited to liveness, readiness, login and refresh.
- Public self-registration is not mounted. User creation belongs to an authenticated, authorized administration use case in Phase 02.
- Swagger is opt-in (`SWAGGER_ENABLED=false` by default) and is not a production release dependency.
- Roles are only the first authorization check; ownership, enrollment, participation and file binding remain application policies.

## Change procedure

A new anonymous route requires all of: product rationale, allowlist entry, decorator, negative authorization test, data-exposure review and ADR/migration update. A feature flag alone cannot make a route anonymous.

## Consequences

- Existing Course reads remain authenticated.
- Test-only anonymous fixtures use an explicit test metadata namespace and are accepted only when `NODE_ENV=test`.
- Socket namespaces and jobs need equivalent default-deny policies in their implementation phases.
