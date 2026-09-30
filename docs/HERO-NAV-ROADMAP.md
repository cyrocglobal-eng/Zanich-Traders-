# Hero and navigation design roadmap

Status: owner selected Option 1; implemented locally for visual review.
Date: 19 September 2026.
Baseline: a85e98d, complete 67-image portfolio.

## Approved brief

Design a premium, polished first impression for a balanced audience of businesses,
organisations, event planners and individual customers. Address the owner's concerns
about plain layout, weak imagery and typography. Retain Zanich's existing logo,
red/black palette, Sora headings and Inter body/navigation text.

Use a floating, rounded, compact navigation bar. Primary action: Get a Quote.
Hero secondary action: Explore Our Work. Services opens a compact dropdown.
Headline rewriting is approved. Use a curated composition of supplied portfolio
images; video is optional, subject to suitable footage being available.

## Research and design constraints

Refero live style search on 19 September returned NO_SUBSCRIPTION. No new live
reference styles were obtained or used. Sources for these concepts are the approved
owner brief, existing DESIGN.md and its sample-book direction, the actual portfolio,
and Refero's bundled typography, craft-details and visual-workflow guides.

Typography guide: clear size/weight hierarchy, tight heading leading, readable body
measure, balanced wrapping. Craft guide: visible keyboard focus and usable controls.
Visual workflow: compare three directions, select one, then build against that target.

The requested navbar radius is a deliberate exception to the current squared
image/control system. Do not propagate pill shapes to every component. Preserve red
for brand and primary action emphasis; WhatsApp green continues to mean that channel.
Do not manufacture project imagery, endorsements or statistics. Existing placeholder
business metrics require verification before reuse as hero proof points.

## Shared navigation

- White floating bar, approximately 1080px maximum width and 68px tall on desktop,
  inset 16px from the top, 24–32px corner radius, subtle border and shadow.
- Existing logo on the left; About, Services, Work and Contact in the centre;
  red Get a Quote on the right. Why Us and Clients remain reachable on the page
  and can appear as supporting links inside the expanded menu.
- Services disclosure contains the eight existing service destinations and an
  All services link. Use two desktop columns; one on mobile. Open on click/tap,
  work with keyboard, close on Escape/outside click and restore focus on Escape.
- Mobile: logo, compact Quote action and a 44px minimum menu button. Expanded
  navigation is a rounded panel below the bar with a Services accordion.
- Keep the bar visible while scrolling. Reserve space so it never covers the
  hero heading or anchor destinations. Avoid scroll-driven resizing at first.

## Option 1: Signature collection — recommended

Primary source: existing Zanich sample-book direction plus the owner's premium brief.
Preserve: white/paper canvas, strong ink typography, restrained red, genuine imagery.
Borrow only: rounded floating navigation from the owner; readable hierarchy from
Refero typography. Rounded geometry belongs primarily to navigation.

Headline: Your brand. Beautifully brought to life.
Supporting copy: Printing, branded apparel and promotional products for businesses,
events and personal projects. Designed and produced with you in Nairobi.

Implementation direction: use a 45/55 desktop split with a large Sora headline on
the left and a deliberately arranged three-image composition on the right. One
apparel example carries the most visual weight; a mug and notebook support it.
Start with image 67 (white polo), 31 (mug) and 34 (notebook), checking their actual
rendered quality before final selection. Preserve entire products and provenance
labels. Use separate image frames, not a fabricated combined product photograph.
Buttons sit directly beneath the copy. Add a short service line below the hero,
without unverified statistics. Mobile order: headline, copy, actions, composition.

Motion: one restrained entrance, static under reduced motion. No autoplay carousel.
Reject: generic overlapping dashboard cards, decorative word recolouring, excessive
empty space and a collage so dense that individual products cannot be read.

## Option 2: Black showcase

Primary source: owner's black/red identity and premium brief; actual portfolio media.
Preserve: deep black hero canvas, white display typography, red action, white nav.
Borrow only: existing photographic caption system and Refero type hierarchy.

Headline: Make every impression count.
Supporting copy: From branded workwear to event displays and everyday merchandise,
bring your next idea to life with Zanich.

Implementation direction: white floating navbar above a dark hero. Keep copy in
the left 45%; place a single large featured portfolio image in the right 55%, with
two smaller supporting examples below it. Consider images 51 (hoodie), 59 (apron)
and 60 (chef hat) as a starting shortlist, preserving their supplied backgrounds.
Do not pretend these are a single client's coordinated project. A narrow caption
line identifies each example. On mobile the featured image follows the buttons.

Video can replace the large image only when suitable footage exists; retain a
poster image, pause control and a static reduced-motion experience. Initial build
can remain still imagery. Use an explicit transition back into the light site.
Reject: stock factory footage presented as Zanich, heavy gradients, glow effects
and unreadable white-on-image text.

## Option 3: Portfolio panorama

Primary source: supplied portfolio and owner's request for a curated composition.
Preserve: bright canvas, centred headline, broad horizontal product presentation.
Borrow only: DESIGN.md's rectangular photography and Refero's short centred copy rule.

Headline: One partner. A world of ways to stand out.
Supporting copy: Discover printing, apparel and branded merchandise for your business,
your event or your next big idea.

Implementation direction: centre the headline below the floating navbar, with a
short two-line introduction and the two actions. A wide composition below uses
three unequal image columns: an apparel example, a merchandise example and signage.
Start with images 55 (sportswear), 34 (notebook) and 21 (banner). Keep captions and
actual image boundaries; do not crop away the work. On phones use one featured
image plus two smaller images below, avoiding horizontal scrolling or a marquee.

Motion: subtle single reveal of the composition, no perpetual movement.
Reject: excessive hero height, decorative tiles without real images, tiny products
and auto-rotating content that changes before users can inspect it.

## Decision ledger

| Decision | Source | Purpose |
| --- | --- | --- |
| Floating rounded nav | Owner | More distinctive, compact first impression |
| Existing logo, Sora/Inter, red/black | Owner and DESIGN.md | Preserve brand recognition |
| Get a Quote / Explore Our Work | Owner-approved recommendation | Clear enquiry and discovery paths |
| Services dropdown | Owner-approved recommendation | Direct service access |
| Real portfolio composition | Owner and supplied assets | Stronger visual evidence |
| Responsive type and visible focus | Refero bundled guides | Readability and accessibility |
| Static images initially | Existing assets; no supplied video | Reliable media and controlled loading |

## Delivery sequence

1. Owner selects one concept, or identifies specific elements to combine.
2. Refine the selected desktop/mobile composition and headline. Inspect shortlisted
   assets at actual display size. Update DESIGN.md with the selected reference lock.
3. Implement Hero and Navbar using existing components/dependencies; preserve quote
   destinations, service routes and page anchors. Keep changes local.
4. Verify desktop/mobile navigation, touch, keyboard, focus return, Escape, outside
   click, anchor offsets, text wrapping and reduced motion. Check 360, 390, 768,
   1024 and 1440px layouts and ensure the hero does not cause layout shift.
5. Run relevant lint, type, build and regression checks; compare screenshots against
   the selected direction. Save a local checkpoint and present the result for review.

Selected direction: Option 1, Signature Collection. Owner approved the recommended
concept. Implement this target and present the finished local preview for review.

## Implementation review

Implemented the selected three-image composition with existing optimized WebPs,
caption provenance, rewritten headline, clear actions and a service footer. The
floating rounded navbar retains the original logo and includes all eight service
routes. Why Us and Clients remain in mobile navigation and in the page content.

Browser checks at 360, 390, 768, 1024 and 1440px cover overflow, heading clearance,
desktop/mobile disclosures, Tab, Escape/focus return, outside dismissal, mobile
anchor navigation, the digital-printing route and reduced motion. No page errors
were observed on the completed implementation. Screenshots were visually reviewed.
TypeScript and all 17 tests pass. The initial full lint found eight navbar link
violations; these were fixed with Next Link, and lint of every changed TS/TSX file
passes. Final build and production preview are checked before the local checkpoint.
