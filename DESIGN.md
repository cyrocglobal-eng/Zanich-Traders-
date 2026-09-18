---
version: alpha
name: Zanich Pressroom
description: A precise, photographic print studio identity for Zanich General Traders.
colors:
  primary: "#0A0A0B"
  secondary: "#56565C"
  brand: "#E4231F"
  action: "#C71915"
  paper: "#FAFAF9"
  surface: "#FFFFFF"
  line: "#D8D8D5"
  inverse: "#FFFFFF"
  whatsapp: "#126B3F"
  error: "#A51717"
typography:
  display:
    fontFamily: Sora
    fontSize: 72px
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: -0.045em
  heading:
    fontFamily: Sora
    fontSize: 44px
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: -0.04em
  title:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.65
  small:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: 0.12em
rounded:
  none: 0px
  control: 4px
  panel: 8px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  section: 96px
  container: 1280px
components:
  button-primary:
    backgroundColor: "{colors.action}"
    textColor: "{colors.inverse}"
    rounded: "{rounded.control}"
    height: 48px
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    rounded: "{rounded.control}"
    height: 48px
---

# Zanich Pressroom

## Overview

Designing a printing and branding catalogue for Kenyan business owners, event organisers
and procurement teams. The essential journey is discover a service, inspect examples,
prepare a brief and contact Zanich. Retain the red/black identity, Sora and Inter fonts,
existing logo, service matrix, portfolio evidence and client testimonials.

Reference lock: **the print studio sample book**. Preserve strong black type on a clean
paper canvas, a disciplined red accent, rectangular photography, numbered service entries
and fine divider rules. Use existing images; do not manufacture project evidence or add 3D.

Research on 18 September 2026: Refero's three style searches returned `NO_SUBSCRIPTION`.
No live Refero styles or screens were obtained. Fallback sources are Refero's bundled
typography, motion and craft guides, the existing Zanich brand, and the public structures
of [Pentagram](https://www.pentagram.com/), [PRINT.WORK](https://www.print.work/) and
[MOO](https://www.moo.com/). These are reference ingredients, not templates to copy.
Pentagram's separation of work, disciplines and project captions informs the catalogue;
PRINT.WORK supplies a print-specific reference for exploring products. MOO's opened root
was a region selector, so it contributes no visual implementation claims.

Three directions considered: a dark promotional showroom (too close to the baseline's
heavy panels); colourful product retail (risks diluting the supplied brand); a print
sample book (selected for strong typography and direct access to real work). The user
authorised autonomous selection and direct implementation.

| Decision | Source and role | Rationale |
| --- | --- | --- |
| Paper canvas, red/black identity | Existing Zanich brand | Recognisable and focused on printed work |
| Large rectangular product imagery | Supplied portfolio, sample-book direction | Show what a client can commission |
| Numbered services and captioned work | Pentagram content organisation; print brief | Help scanning without inventing products |
| Small corner radius and rule-based grouping | Selected sample-book direction | Replace repetitive floating cards |
| 48px controls, visible labels and focus | Refero craft-details | Usable on touch and keyboard |
| 120/200/320ms motion, reduced-motion bypass | Refero motion guide | Fast feedback without perpetual decoration |

## Colors

Ink is the text and dark-section colour; paper and white are primary surfaces. Brand red
is for identity accents. The darker action red is used for white-labelled buttons and
small labels on white to preserve contrast. WhatsApp green means that channel only.
Muted copy uses solid secondary ink or at least 70% white on the dark canvas. Never use
low-opacity small text as decoration. Errors include text as well as a red boundary.

## Typography

Self-hosted Sora remains the display face; Inter remains the reading and control face.
Display scales from 38px on narrow phones to 72px on desktop. Headings scale 30–44px.
Use balanced headings, normal body wrapping and 60–65 character reading measures.
Small uppercase labels describe sections; don't apply tracking to long body copy.

## Layout

1280px maximum container; 20px phone, 32px tablet and 40px desktop gutters. Sections use
64px phone and 96px desktop vertical spacing. The hero pairs the existing headline with
a rectangular product composition and captions. Service lists use two desktop columns,
one on mobile. Gallery stays three/two/one columns with all current filters and images.
Quote/contact uses two columns on desktop and a single flow below 1024px. Preserve route
anchors and sufficient scroll margin for the 72px fixed navigation.

## Elevation & Depth

Separate content with 1px rules, spacing and surface contrast. No ambient glows, blurred
decorative blobs or floating testimonial shadows. Reserve a restrained shadow for the
fixed contact controls and dialogs. Photographs carry the visual interest.

## Shapes

Image frames and section dividers are square. Controls use 4px and dialogs 8px radii.
Circular geometry is reserved for the existing logo and compact icon affordances.

## Components

Buttons: at least 48px high, 14px semibold, no animated shadows. Hover changes colour;
active moves at most 1px. Focus uses a 3px visible ring with an offset; inverse areas use
a light ring. Disabled controls keep their label, expose native disabled state and use
an unavailable cursor. Never make a disabled button look like the primary active action.

Forms: preserve labels, optional indicators, validation associations, consent, service
specific inputs, preview/edit flow and request handlers. Use a white paper panel, clear
dividers and explicit request/review headings. Errors, request review, saving and saved states
use the same tokens. A loading state must never remove essential controls.

Gallery: filters retain aria-pressed and a visible selected state. Images retain contain
fitting to avoid cropping evidence. Captions and quick actions remain visible on touch.
The native dialog retains keyboard navigation, Escape, focus return and scroll locking.
Show content transitions only, not layout movement or delayed access to controls.

Navigation: fixed 72px bar, clear underline/focus feedback, mobile disclosure with its
existing Escape handler. Footer and all standalone pages share the same scale and rules.
Support is a native dialog with matching controls; preserve unavailable, chat, quote and
feedback modes and all existing external contact links.

Motion: CSS tokens `--duration-fast: 120ms`, `--duration-default: 200ms`,
`--duration-slow: 320ms`, ease-out `cubic-bezier(0.2,0,0,1)`. Restrained hover zoom (1.025)
on work images and 8px reveal translation only. Do not hide essential content before
hydration. No perpetual marquees, pulsing decorations, scroll hijacking or extra animation
dependencies. Reduced motion removes transforms, smooth scrolling and decorative motion.

## Do's and Don'ts

- Keep claims, contact details, client words and service destinations intact.
- Use existing product images and retain their provenance labels and alt text.
- Maintain keyboard access, 44px minimum icon targets, readable contrast and stable media slots.
- Don't change backend, AWS, secrets or production settings as part of this redesign.
- Don't push or release until the owner has reviewed the local result.
