# Local UI redesign

Branch: `codex/zanich-ui-redesign`, starting from `9cf4893`. No pre-existing uncommitted changes.
Production remains on its existing release. No push or deployment is part of this work.

## Ordered backlog

1. Record source and browser baseline; retain evidence in ignored `.local/ui-review/`.
2. Establish DESIGN.md, shared tokens, navigation and representative homepage hero.
3. Extend the direction to services, about, benefits, portfolio, client proof and contact.
4. Align standalone service/privacy pages, quote review, feedback and support dialogs.
5. Verify browser journeys, responsive layouts, keyboard/reduced-motion states and project checks.
6. Save local rollback checkpoints and a concise review handoff.

## Source baseline

Next.js 16.3.5 / React 19, Tailwind 3, Sora/Inter local fonts, Lucide and Framer Motion.
React Hook Form/Zod quote and feedback forms; native gallery/support dialogs. Existing
tests cover contracts, intake and deployment validation. Existing smoke scripts cover
public routes, metadata, preview integrations and gallery media. No existing DESIGN.md.

Observed in source before editing: decorative glows, repeated rounded card treatment,
duplicated continuously scrolling client/tagline strips, inconsistent button reds and
low-opacity text. Reveal helpers set initial=false, so their hidden variants do not
provide a reliable entrance baseline. The hero directly renders the content's 50+ claim;
record this existing content issue separately rather than silently modifying business claims.

Live Refero research is blocked by an inactive subscription. Fallback research and the
chosen direction are documented in DESIGN.md. Playwright CLI 0.1.20 is available through
the npm cache; isolated browser successfully launched. Browser baseline and check outcomes
will be recorded here once captured; tool availability alone is not a verified UI result.

## Implementation and verification — 18 September 2026

Implemented the Pressroom direction across the home page, service catalogue and detail
pages, shared navigation/footer, gallery, contact form, quote review, support, feedback
and privacy preference controls. Preserved service copy, testimonials, all 12 mapped
assets, links, validation, API contracts and submission handlers. Removed perpetual
marquees and decorative background effects. No new dependencies, backend or AWS changes.

Validation:
- Production build passed, including TypeScript and generation of all 21 static pages.
- ESLint passed. All 15 existing contract/deployment/intake tests passed. Tests initially
  failed on sandbox Windows user lookup; the same command passed outside the sandbox.
- Playwright verified gallery filters, image navigation, Escape and focus return;
  quote invalid/review/edit states and recipient/text in the WhatsApp draft; support
  feedback review/edit; mobile menu Escape; reduced-motion smooth-scroll bypass.
- All 12 gallery images decoded. No document overflow at 360, 390, 768 or 1440px.
- Large-format service preselection and privacy preference dismissal passed.
- No actual inquiry, feedback, WhatsApp message or email was sent by browser checks.

Review evidence and reproducible CLI scripts are in ignored `.local/ui-review/`.
Baseline full-page screenshots include not-yet-loaded lazy images and cannot establish
an image-loading failure. Early screenshots changed caret/loading attributes before
hydration and generated test-induced hydration warnings. Final verification uses the
production build and avoids changing DOM attributes. Initial gallery development
compilation exceeded the browser timeout; warm interaction checks passed.

Limitations: Live Refero research remains unavailable (inactive subscription). No
Lighthouse or field Core Web Vitals claim is made. AI replies and successful live
inquiry/email delivery were not exercised; those integrations and handlers were not
changed. Existing 50+ brands claim still needs business verification. Production release
and GitHub push remain pending owner review.

Final production-preview pass: all 14 requested public/SEO routes returned HTTP 200;
mobile lightbox-to-quote prefill passed. No browser console errors, uncaught errors or
failed requests in that pass. Local preview is http://127.0.0.1:3001/.
One preload warning appeared when the test switched from mobile to desktop and selected a different hero image size; the image decoded successfully. No field performance benchmark was run.
