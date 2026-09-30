# Complete portfolio collection

The 67 numbered JPEGs supplied on 18 September 2026 are all represented. Twelve
exact SHA-256 matches reuse the existing portfolio IDs; 55 new entries complete the
collection. Different designs and alternate views remain separate. No original is
cropped, edited or deleted. Labels distinguish photos, design previews and references;
logos do not imply an endorsement or a confirmed production method.

## Local storage and maintenance

- `assets/portfolio-originals/`: archived original JPEGs, outside the web-served directory.
- `scripts/portfolio-catalogue.json`: reviewed titles, categories, descriptions and labels.
- `public/images/gallery/`: full WebP renditions, at most 1600px on either side.
- `public/images/gallery/thumbs/`: prebuilt WebP thumbnails bounded to 360px and 720px.
- `src/content/gallery-assets.json`: local paths, dimensions, alt text and responsive widths.
- `docs/gallery-provenance.json`: source filename and SHA-256 for every item.

Run `node scripts/build-portfolio.mjs` from the app directory to regenerate. The legacy
`map-gallery-assets.mjs` entry point delegates to the complete generator. It no longer
replaces the full collection with the former 12-image selection. No Desktop path is
needed at runtime or when regenerating from the archived sources.

Originals total 6,478,395 bytes; full WebPs total 3,602,710 bytes. The largest thumbnails
for all 67 items total 1,405,976 bytes. The first 12 largest thumbnails total 318,356
bytes; browsers choose smaller variants as appropriate and lazy-load offscreen media.
These are file sizes, not network timing or Core Web Vitals measurements.

## Browsing and accessibility

Show 12 cards initially, then 12 per explicit Show more action. Search and categories
always query the full collection. This keeps the footer reachable and avoids endlessly
loading content during scrolling. Empty results offer a Clear filters action. Added
cards receive keyboard focus at the first new image. Category changes reset the batch.

Retain three/two/one columns at desktop/tablet/phone sizes, full uncropped image fitting,
visible quote/WhatsApp controls, native dialog focus trapping, Escape and focus return.
Lightbox navigation covers all matching results, including cards not yet revealed.
Only the selected large image loads; no bulk large-image preloading is added.

Use a subtle 8px/opacity scroll reveal where CSS view timelines are supported. Other
browsers show static cards. Reduced-motion users get static cards. Essential content
is never hidden behind an observer or animation. No animation dependency was added.

Thumbnails are ordinary responsive local images with reserved dimensions and an error
fallback. Full views use pre-encoded WebPs without Next runtime conversion. This avoids
cold image-optimization CPU work on the EC2 host. Files must be included in any eventual
deployment. Future CDN storage can preserve the same manifest structure; no cloud
resources or deployment changes are included here. Availability still depends on the
hosting service and backups; local file storage is not an uptime guarantee.
