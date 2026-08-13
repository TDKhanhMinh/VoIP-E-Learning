# ADR-0004: Reference-safe deletion

- Status: Accepted
- Date: 2026-08-13
- Decision owner: stakeholder decision P00-Q04

## Context

V1 frequently hard-deletes aggregates without a complete reference policy. Porting that behavior could orphan enrollment, assessment, submission, file and collaboration data.

## Decision

- Archive/soft-delete is the default mutation.
- A delete request is refused when active references remain unless an explicit audited use case defines the complete transition.
- Hard-delete/cascade is allowed only in a named privileged use case with authorization, reference discovery, transaction/idempotency, audit evidence and reconciliation.
- Repository adapters must not expose generic cascade deletion as a convenience method.
- Provider deletion is a separate compensating action; database state cannot claim success when provider cleanup is unknown.

## Required contract per aggregate

Each module must define archive fields/visibility, inbound references, refusal conflicts, privileged purge eligibility, audit event and retention/reconciliation behavior.

## Consequences

V1 destructive status codes and cascade behavior are not automatically preserved by the compatibility adapter. Google Drive asset removal is blocked until Phase 05 defines legacy reconciliation and retention.
