# ADR-0002: Versioned remake API and temporary V1 compatibility

- Status: Accepted with governance fields open
- Date: 2026-08-13
- Decision owner: stakeholder decision P00-Q02/P00-Q08

## Context

V1 exposes unversioned singular paths such as `/api/course`. The remake uses URI versioning and plural resources such as `/api/v1/courses`, plus a new response envelope. A big-bang frontend migration is not assumed.

## Decision

- Canonical remake endpoints use `/api/v{major}`; the current major is `/api/v1`.
- A temporary adapter may translate approved legacy paths, requests and responses to canonical use cases.
- The adapter is an interface adapter only. It cannot duplicate business logic, bypass authentication/authorization, re-expose secret fields or preserve known vulnerabilities.
- Every intentional difference is recorded with frontend consumers and migration action.
- A legacy route is not mountable until it has an owner, traffic telemetry and an approved sunset criterion.
- Breaking behavior is allowed only behind a versioned contract and migration documentation.

## Current composition

`V1_COMPATIBILITY_ADAPTER_ENABLED=false` is locked by configuration. The code contract records owner, telemetry and sunset as unresolved, so no legacy adapter is mounted in Phase 00.

## Consequences

- Self-registration, unsafe anonymous reads, answer/score exposure, secret fields and destructive unaudited operations are intentional differences, not compatibility targets.
- Legacy response/status fidelity is characterized per module before its mapping is activated.
- The unresolved sunset criterion blocks Phase 00 Done but does not block the safe skeleton and migration register.
