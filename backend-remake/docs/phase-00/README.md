# Phase 00 — security containment and contract freeze

Status: **In progress / blocked from Done** (2026-08-13).

This directory is the repository evidence for Phase 00. It records decisions and contracts only for `backend-remake`; `../backend` remains a read-only behavioral reference.

## Decision records

- [ADR-0001 — Mongo ObjectId persistence and opaque string IDs](adr/0001-objectid-opaque-string-ids.md)
- [ADR-0002 — Versioned remake API and temporary V1 compatibility](adr/0002-versioned-api-and-compatibility.md)
- [ADR-0003 — Authentication by default and public allowlist](adr/0003-authenticated-by-default.md)
- [ADR-0004 — Reference-safe deletion](adr/0004-reference-safe-deletion.md)
- [ADR-0005 — Integration lifecycle and composition](adr/0005-integration-lifecycle.md)
- [ADR-0006 — Whole-scope release gate](adr/0006-release-gate.md)

## Frozen contracts and inventories

- [V1 behavior inventory](v1-behavior-inventory.md)
- [Security contract](security-contract.md)
- [Integration capability matrix](integration-capability-matrix.md)
- [V1 compatibility and consumer migration guide](v1-compatibility-migration-guide.md)
- [Validation evidence](validation-evidence.md)

## Status boundary

Repository implementation and static/unit evidence cannot close these external or stakeholder-owned gates:

1. Google/Asterisk credential rotation, revocation and repository-history cleanup need an owner, completion date and external evidence.
2. The compatibility adapter has no approved sunset duration/criterion.
3. Release scope has not explicitly excluded or included Google Drive (retired) and Recording/SIP (deferred).
4. The working interpretation “disabled means feature flag/composition OFF” still needs stakeholder confirmation.
5. Exact V1 response/status characterization and frontend migration are completed per module; this Phase 00 inventory freezes the surface and security classification, not later-phase business semantics.

No Phase 00 document may be used as production approval while any item above remains open.
