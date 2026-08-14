# User/Course migration rehearsal runbook

## Safety boundary

Do not point these commands at production or the V1 development database. The
first authorized execution must use a controlled backup/clone with a tested
restore path. The committed synthetic fixture is not production approval.

## Preconditions

1. Record MongoDB version, replica-set/Atlas topology, write concern and backup
   identifier.
2. Obtain owner approval for read-only profiling and dry-run on the controlled
   clone.
3. Use a dedicated database name ending in `_test` for automated tests.
4. Keep compatibility reads and the previous application version available
   during rehearsal. Do not enable optional providers.
5. Review duplicate email/code/title counts, malformed primary/owner IDs and
   missing bcrypt/role warnings before any write.

## Local replica-set verification

```bash
npm run infra:up
copy .env.test.example .env.test
npm run test:integration
npm run test:e2e
```

The transaction integration test verifies `setName=rs0`, session support and a
majority-write transaction. A local pass does not prove production equivalence.

## Controlled clone rehearsal

```bash
npm run migration:status
npm run migration:dry-run -- --batch-size=100
npm run migration:up -- --batch-size=100
npm run migration:status
```

Migration output is one JSON object per line. Archive it with the backup/clone
identifier and Git commit. A data migration reports `scanned`, `changed`,
`skipped`, warning counts and its last checkpoint.

Do not continue when:

- a checksum mismatch is reported;
- duplicate or malformed-ID counts are unexplained;
- a password is not already a valid bcrypt hash;
- a migration ledger entry is `running` or `failed` without an incident review;
- reconciliation loses Course title, credit or description;
- any new field would fabricate a Course owner.

After reviewing an interrupted batch and confirming the implementation checksum
is unchanged, resume explicitly:

```bash
npm run migration:resume -- --batch-size=100
```

## Rollback and forward-fix

Migrations are forward-only and have no automatic `down`. Before application
cutover, discard and restore the controlled clone if rehearsal fails. After an
authorized cutover, stop the new writer, retain compatibility reads and ship a
new append-only forward-fix migration. Restoring a production backup is an
incident decision owned by database operations, not an automatic script action.

Indexes remain separate from data backfill. Build unique indexes only after the
profile report proves duplicates are resolved through an approved data decision.
