# Deployment readiness audit

Audit date: 12 September 2026  
Target: `https://zanichtraders.co.ke`  
Repository: Zanich General Traders Next.js application

## Current result

The application is technically ready for deployment to a Node.js host. The production build and TypeScript checks pass, `npm audit --omit=dev` reports zero vulnerabilities, all public routes and eight service pages respond correctly in the local smoke suite, and the quote, WhatsApp, support and feedback flows were verified in desktop and mobile browser checks.

The default build remains deliberately non-indexable and provider integrations remain disabled until production values are supplied. No production deployment or external message was made.

## Blocking items before launch

1. Choose and provision a Node.js host with PostgreSQL. Set `DATABASE_URL`, run `npm run db:migrate`, and verify backups, TLS and a restricted database account.
2. Verify a Resend sender domain and set `RESEND_API_KEY` and `EMAIL_FROM`. Send one authorized test quote and confirm receipt at `zanichgeneraltraders@gmail.com`.
3. Generate separate random values for `OUTBOX_SECRET` and `RATE_LIMIT_SALT` (32+ characters). Set `TRUSTED_IP_HEADER` only after confirming the proxy overwrites it.
4. Configure the scheduler to call `POST /api/internal/outbox` every minute with the bearer secret, then test retry and failure alerts.
5. Decide whether to enable the AI assistant. If yes, set `OPENAI_API_KEY` and an approved structured-output `OPENAI_MODEL`, with a project spending limit. Rebuild after changing flags.
6. Point DNS and HTTPS at the host, verify redirects and the canonical domain, and test the deployed routes from an external network.
7. Set `SITE_INDEXABLE=true` only after domain verification. Add the Search Console verification value, submit `/sitemap.xml`, and inspect the home and service URLs.
8. Configure the GTM container and set `NEXT_PUBLIC_GTM_ID` plus `NEXT_PUBLIC_ANALYTICS_ENABLED=true` only after consent, page-view and lead events are tested. Keep enhanced measurement for outbound clicks, forms and history disabled.
9. Confirm the existing `50+ brands served` claim with the owner before setting `BRANDS_SERVED_CONFIRMED=true`.
10. Decide and document an inquiry retention period and access policy before collecting live customer data.

## Recommended acceptance tests

- Submit a dedicated test quote and private feedback item; confirm exactly one email for each and that duplicate retries do not duplicate records or mail.
- Force an email-provider failure, confirm outbox retry and recovery, and verify failed-job alerting.
- Ask the agent about price, fast-track timing, artwork readiness and an unknown service. Confirm it gives approved policy language and routes quotes or complaints to a human.
- Test WhatsApp drafts on an Android and iOS device without sending them automatically.
- Test keyboard navigation, focus restoration, reduced motion, 390px mobile layout, Core Web Vitals and image loading on the deployed domain.
- Confirm `/robots.txt`, `/sitemap.xml`, JSON-LD, canonical links and the branded Open Graph card after DNS is live.

## Security review

The reviewed public intake, request bounds, origin checks, rate limits, idempotency, outbox bearer authorization, provider handling, security headers, secret configuration and AI prompt boundary produced zero reportable findings. The security scan was recorded with partial source coverage because the desktop security preflight helper was unavailable; a full worker-backed repository scan should be rerun if your release policy requires complete coverage.

The security report artifacts are retained by the Codex Security scan workspace. This audit document is the human-readable launch checklist and does not replace provider, domain or real-device acceptance.

## Commands used

`npm run typecheck` passed. `npm run build` passed. `npm audit --omit=dev` reported zero vulnerabilities. `node scripts/smoke.mjs` passed all public routes, metadata, security headers, API boundaries and the unconfigured-intake check. The 11 application tests passed earlier; a later rerun was blocked by a Windows `ENOMEM` process-memory limit while several Node processes were active, not by a test assertion.
