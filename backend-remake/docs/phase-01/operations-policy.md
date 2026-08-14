# Phase 01 operations policy

Approved on 2026-08-14. Configuration owner: Trần Đỗ Khánh Minh.

## Application and access logs

- Retain structured application and HTTP access events for 30 days.
- Rotate daily or when the current file reaches 10 MB, whichever comes first.
- Compress rotated files and prevent unbounded disk usage.
- Set `LOG_FILE_ENABLED=true` in production and place `LOG_FILE_PATH` on durable
  storage. A recommended path is
  `/var/log/voip-elearning/backend-remake.log`.
- The current Pino HTTP logger writes application and request/access events to
  the same configured file. If they are split later, the committed wildcard
  template applies the same policy to both.
- Install and adapt `ops/logrotate/backend-remake` for the deployment account.
  Committing the template does not prove the host scheduler, permissions,
  durable volume or log shipping are active.

## Protected branch

The repository default branch is `master`; no local or remote `main` branch was
present when this policy was recorded.

Repository settings must require:

1. passing status checks named exactly `Build`, `Test` and `Lint`;
2. at least one approving code review before merge.

The backend-remake workflow exposes those three exact job names. Trần Đỗ Khánh
Minh owns applying the setting in GitHub/GitLab and attaching repository-setting
evidence. A committed workflow is not evidence that branch protection is active.

## Approval boundary

These decisions approve the stated operating parameters. They do not authorize
a push, pull request, production database write or a claim of production
readiness.
