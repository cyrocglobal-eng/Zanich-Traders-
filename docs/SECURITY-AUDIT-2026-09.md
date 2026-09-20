# Security audit and intake remediation

Audit base: `42d7a86`. Scan: `cd23fbff-eb34-4a8c-8da8-46912d5ab8f5`.

## Confirmed finding

Medium severity, CWE-602: quote and feedback submissions were disabled only in the UI. An anonymous HTTP client could supply the allowed Origin, valid JSON and a UUID idempotency key. If PostgreSQL was configured but email delivery was absent, the shared handler still committed an inquiry and notification job and returned 201.

Missing database configuration already failed closed. Schema validation, body limits, origin checks, idempotency and rate limits remained effective. No customer-data disclosure or unlimited rate-limit bypass was demonstrated. Live deployment exposure was not tested.

## Change

`src/server/quotes/handler.ts` now checks the shared availability policy before database access, including rate-limit writes. Unavailable submissions return a no-store 503 with a WhatsApp/call fallback. Both public intake routes use this handler.

`src/server/config/index.ts` uses the same policy for API and UI. It rejects missing/blank delivery prerequisites and public HTTP preview origins. HTTPS and nonproduction loopback HTTP development remain supported. This checks configuration, not provider health or actual TLS termination.

`tests/intake-availability.test.ts` exercises both exported route handlers with an isolated PGlite database and mocked PostgreSQL transport. It checks every missing prerequisite, HTTP preview rejection, no database effects while disabled, foreign-origin rejection, successful acceptance, exact retries and changed-payload conflicts. Environment and transport mocks are restored afterward; no external database or email service is contacted.

## Verification

The regression test failed before the patch: missing RESEND_API_KEY returned 201 instead of 503. The same test passed after the patch; configured quote and feedback requests each persisted exactly one inquiry and outbox job, and retries remained duplicates.

Production dependency advisory check (`npm audit --omit=dev --json`) reported zero known vulnerabilities on 2026-09-19. This does not establish that dependencies are vulnerability-free.

Outcome: fixed and locally verified.

Verification gates on 2026-09-20:

- Syntax/import/type gate: `git diff --check` and `npm run typecheck` passed.
- Security trigger and legitimate controls: the new route test passed, including the alternate feedback route and HTTP preview configuration.
- Package checks: direct `tsx --test tests/*.test.ts` passed all 18 tests; `npm run lint` and `npm run build` passed. The build generated all 21 static pages and retained the dynamic API routes.

## Coverage and limits

The source audit reviewed public handlers, persistence, notification authorization, AI boundaries, selected browser rendering and analytics paths, and supplied deployment configuration. Remaining presentation-source review was interrupted by a worker usage limit; overall repository coverage is partial. Binary media, generated output and third-party package internals were excluded. No live AWS, provider, TLS, scheduling, retention or backup checks were performed.

An independent pre-patch investigation confirmed the finding. The post-patch reviewer was unavailable due to a usage limit; the parent performed a separate bypass/regression review of both routes and availability consumers. No alternate public persistence path was found. Build-time UI availability can still become stale after configuration changes; rebuilding remains necessary, while the handler checks availability for each request.

Scan-reported usage: 8,669,036 total tokens across five threads, including 8,274,560 cached input tokens. No deployment or remote changes were made.
