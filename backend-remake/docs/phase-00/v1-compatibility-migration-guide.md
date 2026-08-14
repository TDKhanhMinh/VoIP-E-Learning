# V1 compatibility and consumer migration guide

## Governance header

| Field                     | Current value                                                |
| ------------------------- | ------------------------------------------------------------ |
| Legacy contract           | Unversioned singular Express routes (`/api/course`, etc.)    |
| Canonical contract        | URI-versioned remake routes (`/api/v1/courses`, etc.)        |
| Adapter state             | Skeleton only; unmounted and config-locked OFF               |
| Owner                     | **TBD — P00-C01 blocker**                                    |
| Telemetry/dashboard       | **TBD — required before mount**                              |
| Sunset duration/criterion | **TBD — P00-C01 blocker**                                    |
| Rollback                  | Disable adapter composition; canonical API remains versioned |

The adapter cannot be enabled until owner, telemetry and sunset fields are all approved. It must call canonical application use cases and cannot preserve V1 vulnerabilities.

## Initial consumer map

Frontend consumers are under `frontend/src/services`; exact payload/response characterization is completed in each module phase.

| Legacy V1 base                                                                | Canonical remake target                                 | Main frontend consumers                                        | Classification                                                           |
| ----------------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `/api/auth`                                                                   | `/api/v1/auth`                                          | `authService.js`                                               | Preserve login; Google OAuth later; no self-registration target          |
| `/api/user`                                                                   | `/api/v1/users`                                         | `userService.js`                                               | Intentionally change to authenticated admin management and safe DTO      |
| `/api/course`                                                                 | `/api/v1/courses`                                       | `courseService.js`                                             | Preserve selected catalog behavior; authenticate reads                   |
| `/api/semester`                                                               | `/api/v1/semesters`                                     | `semesterService.js`                                           | Preserve selected catalog behavior; authenticate reads                   |
| `/api/class`, `/api/class-student`, `/api/enrollment`                         | `/api/v1/classes`, `/api/v1/enrollments`                | `classService.js`, `enrollmentService.js`                      | Preserve business intent; add ownership/enrollment policy                |
| `/api/schedule`, `/api/attendance`                                            | `/api/v1/schedules`, `/api/v1/attendance`               | `scheduleService.js`, `attendanceService.js`                   | Preserve selected behavior with actor-scoped reads                       |
| `/api/announcement`, `/api/material`, `/api/assignment`, `/api/submission`    | Versioned plural resources                              | matching service files                                         | Preserve lifecycle; add membership/ownership and archive policy          |
| `/api/online-test`, `/api/test-question`, `/api/test-session`, `/api/attempt` | Versioned assessment resources                          | `testService.js`, `testSessionService.js`, `attemptService.js` | Intentionally hide answers/scores and enforce test ownership/window      |
| `/api/topic`, `/api/post`, `/api/comment`                                     | Versioned community resources                           | `forumService.js`, `postService.js`, `commentService.js`       | Preserve approved forum/class behavior after visibility decision         |
| `/api/chat`, Socket `/chat`                                                   | Versioned collaboration + authenticated socket contract | `chatService.js` and socket consumers                          | Preserve intent; enforce participant membership and idempotency          |
| `/api/room`, `/api/livekit`                                                   | Versioned room resources                                | `roomService.js`                                               | Preserve later; never public token/room mutation                         |
| `/api/recommend`                                                              | Versioned knowledge resources                           | `recommendService.js`                                          | Preserve later with auth/rate/privacy bounds                             |
| `/api/drive`                                                                  | None                                                    | `driveUploadService.js`                                        | Retire; migrate legacy assets/URLs to FileAsset/Cloudinary policy        |
| `/api/file`                                                                   | Versioned asset access                                  | `uploadService.js`                                             | Intentionally change to authenticated resource-bound access              |
| `/api/upload-question`                                                        | Versioned assessment import                             | `testService.js`                                               | Intentionally change to teacher/admin auth, type/size limits and dry-run |
| `/api/recording`                                                              | None in initial release                                 | `recordingService.js`                                          | Deferred/disabled; frontend feature OFF                                  |
| `/api/voip`                                                                   | None in initial release                                 | `voipService.js`, `sipClientService.js`                        | Deferred/disabled; never expose SIP plaintext                            |

## Intentional-difference register

| ID    | V1 behavior                                              | Remake contract                                                    | Consumer action                                | Evidence gate                      |
| ----- | -------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------- | ---------------------------------- |
| ID-01 | Many reads/mutations are anonymous                       | Authentication by default; four-route anonymous allowlist          | Send Bearer token; handle `401/403`            | Negative HTTP E2E per module       |
| ID-02 | User projection may include secret/hash fields           | Public DTO only                                                    | Remove dependency on persistence fields        | Presenter and E2E redaction tests  |
| ID-03 | Public/self user creation patterns                       | Self-registration unmounted; admin creation later                  | Admin-only flow                                | Phase 02 negative E2E              |
| ID-04 | Singular, unversioned paths                              | Versioned plural canonical paths                                   | Update service base paths or temporary adapter | Consumer contract tests            |
| ID-05 | V1 success/error bodies vary                             | Stable remake envelope and English errors                          | Update response parsing                        | HTTP contract tests                |
| ID-06 | Unsafe hard delete/cascade                               | Archive/refuse; explicit audited purge only                        | Handle conflict/archive status                 | Reference-policy integration tests |
| ID-07 | Question/session/attempt reads may expose answers/scores | Actor-specific projections; no early answer/foreign score exposure | Use student/author DTOs                        | Assessment negative E2E            |
| ID-08 | Drive upload/delete and signed file access can be public | Drive retired; FileAsset access bound to actor/resource            | Migrate asset URLs and uploader                | Phase 05 reconciliation/E2E        |
| ID-09 | Room/LiveKit token operations can be public              | Enrollment/teacher policy required                                 | Authenticate and supply class context          | Phase 10 provider/negative E2E     |
| ID-10 | Recording/SIP source exists, mostly commented            | No initial runtime composition                                     | Hide/disable UI                                | Provider-off tests                 |

## Adapter implementation rules

1. Add a mapping only after the route behavior is characterized and classified.
2. Record request source (body/params/query), validation, success/error status, authorization, side effects and consumer.
3. Never translate an anonymous V1 request into a privileged canonical call without a verified actor.
4. Emit per-route usage telemetry with no secret/body logging.
5. Publish consumer migration steps and rollback before activation.
6. Remove a mapping only when the approved sunset criterion is met and frontend contract evidence is attached.

## Consumer migration checklist

- [ ] Canonical path and API major selected.
- [ ] Authentication/authorization behavior mapped.
- [ ] Request DTO and validation differences mapped.
- [ ] Success/error envelope and pagination parsing updated.
- [ ] Secret/answer/score fields removed from assumptions.
- [ ] Retired/deferred UI hidden or feature-flagged OFF.
- [ ] Contract/E2E evidence attached.
- [ ] Compatibility telemetry is zero for the approved observation window.

No checkbox is claimed complete in Phase 00; they close with the owning module and frontend migration work.
