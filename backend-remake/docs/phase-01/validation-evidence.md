# Phase 01 validation evidence

Evidence date: 2026-08-14.

## Directly verified in the implementation worktree

- Base commit and branch were verified before edits.
- Dependency install used the committed lockfile and reported zero audit
  vulnerabilities at install time.
- Format, lint, build and full source/test typecheck pass.
- Remake-scoped static security guards and production dependency audit pass.
- Unit: 17 suites, 46/46 tests pass, including ObjectId mapper, migration
  checksum and response contract changes.
- Mongo standalone integration: 2 suites, 4/4 tests pass for Course repository
  mapping, synthetic User/Course backfill/reconciliation/idempotency and the
  blocking preflight for UUID/string persistence drift.
- Mongo-backed HTTP E2E: 1 suite, 13/13 tests pass. Provider flags remained
  OFF and the dedicated database name ended in `_test`.
- Migration CLI dry-run, apply, status and second apply pass on a dedicated
  empty `_test` database. The second apply reports all three migrations as
  `already-applied`; ledger checksums and the data checkpoint are present.
- Docker Desktop 29.7.2 ran the authenticated one-node replica set on local port
  27018 without touching the standalone MongoDB on 27017. Compose reported the
  keyfile generator exited 0, `mongo` healthy and `mongo-init` exited 0.
- Direct topology evidence returned `ok: 1`, `setName: 'rs0'`,
  `isWritablePrimary: true` and `hosts: ['localhost:27018']`.
- Replica-set integration: 3 suites, 5/5 tests pass, including the
  majority-write transaction test. Mongo-backed HTTP E2E: 1 suite, 13/13 tests
  pass against the same topology.
- Production multi-stage Docker image build passed with Node 22 Alpine; both
  dependency installation and pruned runtime dependency audit reported zero
  vulnerabilities.
- On a dedicated `voip_elearning_migration_test` database, migration status,
  dry-run, apply and status passed. A second apply returned `already-applied`
  for all three migration checksums.
- V1 source has no semantic diff from the Phase 00 base.

## Environment-limited or external gates

- No production/sanitized snapshot, controlled backup/clone or external MongoDB
  was accessed.
- Production topology/transaction behavior and real reconciliation remain open.
- Log policy and branch-protection parameters are approved and committed, but
  installation/active repository-setting evidence and production approval
  remain open. Local runtime evidence is not production approval.
- The remake-scoped security scan passes. The repository-wide scan still blocks
  on the known read-only V1 credential file/private-key, SIP/default-admin test
  password findings and tracked frontend environment file. Phase 01 does not
  mutate those sources or waive Phase 00 credential containment.

## Green runtime log excerpt

```text
backend-remake-mongo-keyfile-1  Exited (0)
backend-remake-mongo-1          Up (healthy)  0.0.0.0:27018->27018/tcp
backend-remake-mongo-init-1     Exited (0)

{ ok: 1, setName: 'rs0', isWritablePrimary: true,
  hosts: [ 'localhost:27018' ] }

Test Suites: 3 passed, 3 total
Tests:       5 passed, 5 total
Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total

202608140001-backfill-user-course-foundation state=already-applied
202608130001-create-auth-and-course-indexes state=already-applied
202608130002-create-v1-model-indexes state=already-applied
```
