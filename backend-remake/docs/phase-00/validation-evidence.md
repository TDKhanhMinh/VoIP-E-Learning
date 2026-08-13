# Phase 00 validation evidence

Evidence captured on 2026-08-13 from the `backend-remake` scope. Commands that
need MongoDB used a dedicated local database named
`voip_elearning_phase00_test`; the test support code refuses database names
that do not end in `_test`.

## Repository and static gates

| Gate                                      | Result                         |
| ----------------------------------------- | ------------------------------ |
| `npm run format:check`                    | Pass                           |
| `npm run lint`                            | Pass                           |
| `npm run build`                           | Pass                           |
| `tsc --noEmit`                            | Pass                           |
| `npm run security:check`                  | Pass; 144 remake files scanned |
| `npm audit --omit=dev --audit-level=high` | Pass; 0 vulnerabilities        |
| `git diff --check`                        | Pass                           |
| Semantic diff under V1 `backend/`         | None                           |

The optional full-repository scan intentionally remains failing because it
detects legacy credential/default-password incidents in read-only V1 and a
tracked frontend environment file. It reports only paths and rule identifiers,
not values. Those incidents require external rotation/revocation and repository
history cleanup; Phase 00 does not edit V1 to disguise them.

## Automated contract and runtime gates

| Suite                       | Result                     |
| --------------------------- | -------------------------- |
| Unit                        | 15 suites, 40 tests passed |
| Mongo integration           | 1 suite, 2 tests passed    |
| HTTP E2E with Mongo enabled | 1 suite, 13 tests passed   |
| Combined `npm run test:all` | 17 suites, 55 tests passed |

The HTTP suite directly verifies that the four allowlisted routes are
anonymous, non-allowlisted reads reject anonymous requests, self-registration
is not mounted, and authenticated course access works against MongoDB.

## Runtime boundary

The verified runtime is a local MongoDB 8.0 standalone instance bound to
`127.0.0.1:27017`. It is sufficient for the Phase 00 repository integration and
HTTP contract tests. It is not evidence for replica-set transactions,
production topology, external provider connectivity, frontend migration, or
credential rotation/revocation.

Phase 00 remains blocked from `Done` until the stakeholder clarifications and
external incident-response evidence listed in this directory's status boundary
are resolved.
