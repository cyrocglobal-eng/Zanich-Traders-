# Production activation — Zanich General Traders

The implementation targets **https://zanichtraders.co.ke**. Run it on a Node.js host that supports Next.js server routes and PostgreSQL connections. This is not a static export. No external account was provisioned, no email was sent, and no production deployment was performed during implementation.

## Setup

1. Use Node.js 24 LTS and `npm ci`. Copy `.env.example` to `.env.local` for local work; set equivalent secrets in the deployment host for production. Never commit secrets.
2. Provision managed PostgreSQL with backups, TLS certificate verification and a restricted application account. Run `npm run db:migrate` with a migration-capable account. The application needs select/insert/update/delete on the three application tables, not schema administration.
3. Configure Resend with a verified sender on your domain. Set `EMAIL_FROM` to that identity. All notifications go to `zanichgeneraltraders@gmail.com`; customer email is Reply-To, not From. Configure SPF and DKIM as provided by the email service.
4. Configure an OpenAI project key and `OPENAI_MODEL` supporting Responses API structured outputs. Apply a project spending limit. No API model is assumed to be available in your account. The server uses `store:false`, bounded input/output and no autonomous sending tools. The model classifies intent, identifies missing specifications and drafts a customer-reviewable summary. Customer-facing factual replies are composed from approved content, not model-generated prices or commitments.
5. Generate distinct strong `OUTBOX_SECRET` and `RATE_LIMIT_SALT` values. Choose `TRUSTED_IP_HEADER` only after verifying the deployment proxy overwrites incoming values. Without it, all visitors share a conservative bucket. Configure infrastructure rate limiting as an additional layer.
6. Schedule an authenticated POST to `/api/internal/outbox` every minute with `Authorization: Bearer <OUTBOX_SECRET>`. Alternatively run `npm run notifications:work` on a worker host. Scheduling is a required deployment step, not an automatic browser action. The endpoint processes three jobs per call; the CLI processes ten. Increase scheduler throughput deliberately as traffic grows.
7. Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`. Use `npm start` to serve the build. Feature availability and public configuration are rendered at build time; rebuild after changing them.

## Delivery and recovery

Quote/feedback intake atomically stores an inquiry and one outbox job. Idempotent retries return the original reference. A changed payload cannot reuse its prior key. The UI distinguishes saved requests from WhatsApp drafts; it never claims WhatsApp delivery.

The outbox leases work, retries failures with exponential backoff, and marks jobs failed after eight attempts. Alert on `failed > 0` and on the age of pending jobs. `sent` means the email provider accepted the request, not that a human read it. Monitor provider bounces and delivery events in its dashboard.

An operator may inspect failed jobs through protected database access, correct the underlying issue, and requeue specific jobs. Verify provider delivery history before requeuing old jobs: provider idempotency has a finite retention window, so very late recovery can duplicate an email. Never expose database tables or quote lookup by reference publicly.

## Business rules

- Existing copy, eight services, client list and both testimonials are preserved in `src/content/site.ts`.
- The owner selected inquiry-based pricing for fast-track work. No numeric price card or automatic SLA is enabled. Edit approved operating facts in `src/content/business.ts` and the versioned agent knowledge.
- Confirm the existing “50+ brands served” claim before setting `BRANDS_SERVED_CONFIRMED=true` and launching.
- Customer-reported print readiness still requires staff review. Quotes, stock, installation, delivery coverage and deadlines require team confirmation.
- Desktop images remain untouched in the parent folder. Existing repository imagery is retained; approve any later portfolio replacements before describing them as delivered client work.

## SEO and analytics

1. Connect the domain, enable HTTPS and redirect alternate hosts to the canonical host. Confirm all expected routes return 200 and nonexistent services return 404.
2. Set `SITE_INDEXABLE=true` only on production. Preview deployments use `noindex` and crawler exclusions; enable hosting access protection for private previews. Robots.txt is not access control.
3. Set `GOOGLE_SITE_VERIFICATION` for a URL-prefix Search Console property; a Domain property requires Google's DNS record. Verify ownership in Search Console, submit `/sitemap.xml`, and inspect key URLs.
4. Set `NEXT_PUBLIC_GTM_ID` and enable analytics on production. Configure the GA4 Google tag in GTM with automatic page views disabled. Trigger page views only from the application's `page_view` event. Route its `page_path` to a clean page location using the canonical domain; never use URL query strings.
5. Disable enhanced measurement for outbound clicks, form interactions and history page views. In GTM, forward only the typed events in `src/lib/analytics/index.ts` and their allowlisted fields. Do not add generic link/form variables: prefilled WhatsApp URLs contain personal information.
6. Consent defaults to off. GTM is loaded only after acceptance; declining leaves quote/WhatsApp flows operational. Verify decline, acceptance and preference reset. Mark `generate_lead` as the primary GA4 key event and treat `whatsapp_click` as intent, not a confirmed lead.
7. Validate metadata, the branded OG image, JSON-LD and sitemap on the deployed domain. `PrintingStore` is not a valid Schema.org type; this implementation uses LocalBusiness and Service. Do not fabricate review ratings, coordinates, prices or social profiles.

## Acceptance checks

Use dedicated test details and an explicitly authorized test email before accepting live submissions. Check receipt in the team mailbox, provider failure/recovery, duplicate submissions, private feedback, agent outages, AI price/turnaround escalation, and a user-confirmed agent handoff. Verify WhatsApp drafts on mobile and desktop; sending the draft is the user's action.

Measure mobile and desktop usability, keyboard navigation, reduced motion, metadata/share cards, real-world Core Web Vitals, and zero personal information in analytics. Confirm backups restore successfully. Decide a documented retention period for inquiries and configure deletion accordingly before collecting production data; restrict database and mailbox access to authorized staff.

Rollback uses the previous known-good application build. The initial migration is additive; do not drop inquiry tables during rollback.
