# ADR-0001: Mongo ObjectId persistence and opaque string IDs

- Status: Accepted
- Date: 2026-08-13
- Decision owner: stakeholder decision P00-Q01

## Context

V1 collections and references use MongoDB ObjectId. The remake pilot introduced UUID-shaped/string `_id` values for User and Course while legacy references still point to ObjectId. Mixing the two makes casts, lookups, population and migration reconciliation unsafe.

## Decision

- Persistence primary and foreign identifiers remain BSON ObjectId during the migration.
- Domain objects, application ports and API DTOs expose identifiers only as opaque strings.
- Domain/application code must not parse ObjectId, depend on Mongoose, infer ordering from an ID, or promise a particular textual format.
- Infrastructure adapters own string-to-ObjectId validation and mapping.
- Migration fixtures must preserve the original V1 identifier and every reference to it.
- A UUID cutover is a separate all-collections migration with rollback; it cannot be introduced one aggregate at a time.

## Consequences

- Current UUID/string persistence in the User/Course pilot is implementation drift and must be corrected in Phase 01 before another data slice is considered migration-safe.
- Compatibility responses may keep textual IDs because ObjectId is serialized as an opaque string.
- Session and idempotency identifiers that are not Mongo document/reference IDs may use another strategy only when their storage contract explicitly distinguishes them.

## Verification

- Mongo integration tests must assert the stored `_id` and reference BSON types.
- Reconciliation must compare IDs and references without remapping.
- No new `randomUUID()` may be used as a Mongo document ID.

This ADR freezes the decision; it does not claim the current pilot persistence has already been migrated.
