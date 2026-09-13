# Zanich General Traders — Application

Implementation update: Next.js 16, React and TypeScript with eight service pages, reviewed WhatsApp quote handoffs, durable website inquiries, an email outbox, constrained AI support, private feedback and consent-controlled analytics. Production domain: https://zanichtraders.co.ke.

See [the production guide](docs/PRODUCTION.md) and `.env.example` for current setup and activation. Default builds are not indexable. Database, email sender, notification scheduling, AI, Search Console and GTM require account configuration. Rebuild after configuring integrations. Fast-track work always receives an individual quote and team confirmation.

Run `npm ci`, `npm run dev` for local work; `npm run build` and `npm start` for a production-style preview. Validation: `npm run lint`, `npm run typecheck`, `npm test`, then `node scripts/smoke.mjs` against the running preview. `npm run check:production` lists deployment configuration gaps.

Architecture: `src/content` holds business facts; `src/contracts` holds shared validation; `src/components` holds UI; `src/server` holds intake, persistence, notifications and AI; `src/lib/seo` holds SEO builders. Database setup and workers live in `migrations` and `scripts`.

The original brand copy and testimonials are preserved. The existing concept imagery is retained; confirm or replace it with approved photographs before launch. Additional supplied photographs are in the parent Desktop project folder.
