# Integration capability matrix

This matrix separates product lifecycle from current runtime composition. “Keep” means the capability belongs in a later approved release slice; it does not mean an adapter exists or may be enabled today.

| Capability            | Lifecycle                 | Phase 00 composition | Config boundary                      | Enablement/migration gate                                                                  | Release scope                  |
| --------------------- | ------------------------- | -------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------ | ------------------------------ |
| Google OAuth          | Keep                      | OFF                  | `GOOGLE_OAUTH_ENABLED=false` locked  | Phase 02 provisioning/linking decision and provider E2E                                    | Candidate                      |
| Google Drive          | Retire/Delete from remake | OFF                  | `GOOGLE_DRIVE_ENABLED=false` locked  | Legacy asset reconciliation, retention and consumer migration; never enable remake adapter | Excluded pending clarification |
| Cloudinary            | Keep                      | OFF                  | `CLOUDINARY_ENABLED=false` locked    | Phase 05 FileAsset binding/authz, limits, compensation and provider E2E                    | Candidate                      |
| LiveKit               | Keep                      | OFF                  | `LIVEKIT_ENABLED=false` locked       | Phase 10 lazy adapter, enrollment/teacher authorization and provider E2E                   | Candidate                      |
| Gmail/SMTP            | Keep                      | OFF                  | `SMTP_ENABLED=false` locked          | Phase 12 outbox/retry/redaction/operations evidence                                        | Candidate                      |
| Recording             | Deferred/Disabled         | OFF                  | `RECORDING_ENABLED=false` locked     | Phase 13 security/privacy/cost/ops approval                                                | Excluded pending clarification |
| AWS recording storage | Deferred/Disabled         | OFF                  | `AWS_RECORDING_ENABLED=false` locked | Same Phase 13 gate plus sandbox provider tests and deletion drill                          | Excluded pending clarification |
| Gemini summary        | Deferred/Disabled         | OFF                  | `GEMINI_ENABLED=false` locked        | Same Phase 13 gate plus privacy/model/cost approval                                        | Excluded pending clarification |
| SIP/Asterisk          | Deferred/Disabled         | OFF                  | `SIP_ENABLED=false` locked           | Credential rotation, security approval and sandbox E2E                                     | Excluded pending clarification |

## Composition contract

- No provider SDK is imported or initialized by the current application composition.
- A future adapter must be lazy, supplied behind an application port and have provider-off tests.
- Credentials are runtime-only and must be redacted; plaintext SIP credentials cannot be migrated.
- A config flag is necessary but never sufficient: the capability registry, adapter/module wiring, authorization, tests and approval must change together.
- The working implementation of “disabled” is composition/feature flag OFF. Stakeholder confirmation P00-C03 remains open.
