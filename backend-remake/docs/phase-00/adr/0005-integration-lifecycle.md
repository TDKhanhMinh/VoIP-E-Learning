# ADR-0005: Integration lifecycle and composition

- Status: Accepted; disabled-mechanism clarification open
- Date: 2026-08-13
- Decision owner: stakeholder decision P00-Q05/P00-Q06

## Decision

- Keep: Google OAuth, Cloudinary, LiveKit and Gmail/SMTP.
- Retire from remake: Google Drive. Legacy URLs/assets require migration and retention policy before adapter removal.
- Deferred/disabled: Recording/AWS/Gemini and SIP/Asterisk.
- Provider SDKs live behind application ports and lazy infrastructure adapters; they cannot initialize at module import.
- Every integration is composition OFF in Phase 00. Environment variables cannot activate an adapter that has not passed its later-phase enablement gate.
- Raw provider secrets, SIP passwords and service-account credentials cannot appear in source, fixtures, logs, docs or API responses.

## Working architectural interpretation

“Disabled” means feature flag/composition OFF, not commented source. This interpretation is implemented as a locked configuration/capability registry but still awaits stakeholder confirmation P00-C03.

## External containment

The remake cannot revoke already exposed Google/Asterisk credentials. Rotation/revocation and history cleanup remain required external actions and block Phase 00 Done until evidence is supplied.
