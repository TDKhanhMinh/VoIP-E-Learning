# Phase 01: platform, persistence, migration and test foundation

Phase 01 implements migration-safe shared infrastructure only. It does not port
Phase 02+ business capabilities and does not authorize a production migration.

## Locked decisions preserved

- MongoDB persists primary and foreign identifiers as BSON ObjectId. Domain and
  API code see only validated opaque strings.
- The mapper in `mongo-object-id.mapper.ts` is the only User/Course conversion
  boundary. UUID generation is not used for Mongo aggregate identifiers.
- The API remains URI-versioned and authenticated by default. Every successful
  business payload, including non-paginated responses, is under `meta.data`.
- Optional/deferred providers remain composition OFF.
- Legacy password hashes are copied only when already valid bcrypt hashes.
  Plaintext SIP credentials are not part of the operational User entity, schema
  or repository.
- V1 Course has no owner semantic. Migrated records keep `ownerId` nullable;
  newly created records may retain the creating actor without inventing owners
  for legacy data.

## Implemented foundation

- ObjectId generator and strict ObjectId mapper with static security guards.
- BSON ObjectId User/Course schemas and repository mapping.
- Canonical User fields: `fullName`, `emailNormalized`, `passwordHash`, one
  canonical role and `accountStatus`.
- Canonical Course fields: `codeNormalized`, `name` with preserved `title`,
  `credit` and `description`.
- Forward-only migration ledger with checksum verification, explicit dry-run,
  bounded batches, checkpoints, reviewed resume and structured reports.
- Synthetic legacy User/Course fixture and idempotency/reconciliation test.
- Docker Compose single-node replica set and majority-write transaction test.
- Production file logging boundary, correlation ID and expanded redaction.
- CI gates for formatting, lint, security, unit, full typecheck, replica-set
  integration, HTTP E2E, build and Docker image build.

## Deliberately incomplete gates

- No production-like or sanitized V1 snapshot was available. Synthetic fixtures
  cover the implementation shape, not the real data distribution.
- Production MongoDB version, topology, write concern and backup mechanism are
  not confirmed.
- A controlled backup/clone dry-run and reconciliation report are mandatory
  before cutover.
- File-log rotation, retention, shipping and durable storage ownership remain an
  operations clarification. The application writes structured files but does
  not claim that an external rotation policy exists.
- Branch protection and exact required-check names require repository-owner
  configuration and are not proven by a workflow file.

See [migration-runbook.md](migration-runbook.md) for the safe rehearsal flow and
[validation-evidence.md](validation-evidence.md) for the evidence boundary.
