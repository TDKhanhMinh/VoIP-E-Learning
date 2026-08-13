# ADR-0006: Whole-scope release gate

- Status: Accepted; release-scope clarification open
- Date: 2026-08-13
- Decision owner: stakeholder decision P00-Q07

## Decision

The remake is released only when every module in the approved release scope reaches the roadmap Definition of Done. Structural schema/port work, passing unit tests, a partial deployment or a compatibility adapter do not make a module Done.

Each in-scope module requires reviewed behavior/intentional differences, domain and repository implementation, authorization, DTO/presenter safety, Mongo integration, HTTP/Socket/job/provider tests as applicable, migration/reconciliation, observability/audit, rollback/feature flag, documentation and CI gates.

## Release evidence

- Approved release-scope manifest and module-by-module status.
- Lint, formatting, source/test typecheck, unit, integration, E2E, security scan and diff checks.
- Migration dry-run/reconciliation and rollback/forward-fix evidence.
- Provider-off and provider smoke evidence where applicable.
- Credential incident closure for exposed V1 credentials.

## Open scope question

Stakeholders must confirm whether “all modules” excludes Google Drive (retired) and Recording/SIP (deferred/disabled). Until then, the capability matrix marks them `excluded-pending-clarification` and no release can be approved.
