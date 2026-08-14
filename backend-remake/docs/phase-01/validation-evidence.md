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
- V1 source has no semantic diff from the Phase 00 base.

Final command counts and the commit are recorded after the closing validation.

## Environment-limited or external gates

- Docker daemon was unavailable in this Windows worktree. A MongoDB server was
  available on localhost, but `hello.setName` was absent: it is standalone.
  The transaction topology test therefore failed its replica-set precondition,
  as intended. Majority-write transaction behavior remains unverified.
- No production/sanitized snapshot, controlled backup/clone or external MongoDB
  was accessed.
- Production topology/transaction behavior, real reconciliation, log rotation,
  retention/shipping, branch protection and production approval remain open.
