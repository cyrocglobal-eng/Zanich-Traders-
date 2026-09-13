# Gallery and asset mapping

## Plan and scope

Preserve the existing Selected Work heading and brand styling. Replace its six concept tiles with a curated responsive grid using the supplied Desktop assets. Keep category navigation, image inspection and quote actions together. Reuse the existing quote form and WhatsApp helper; do not modify API routes, service lists, testimonials or global SEO.

## Asset audit

The supplied folder contains 68 JPEG files, including product photographs, mockups, design proofs, repeated variants and standalone artwork. Twelve representative images are included across Custom Embroidery, Large Format Signage, Promotional Merchandise, Sublimation and Apparel. Mockups are visibly labeled Design preview; photographs are labeled Product photo. Category groupings describe inquiry types; staff must confirm production methods, suitability and availability. No new client endorsement is inferred from a visible logo.

Repeated variants, low-detail screenshots, standalone promotional artwork and unrelated/private material are omitted from the initial selection. Originals remain unchanged. `gallery-provenance.json` maps each published asset to its source filename and SHA-256 digest. `scripts/map-gallery-assets.mjs` regenerates the chosen WebP copies (maximum 1600px without upscaling, auto-oriented and with metadata stripped). The initial total is approximately 962 KB; Next Image supplies responsive smaller derivatives.

## Components and behavior

- `Portfolio` remains the server section wrapper and preserves its original text.
- `ProductGallery` owns category and selection state, with three/two/one columns across desktop/tablet/mobile. Every card has visible touch-friendly quote actions.
- `GalleryDialog` loads on demand, provides uncropped image inspection, previous/next controls and keyboard arrows. Native modal focus trapping, Escape, focus restoration and scroll locking support keyboard use.
- `GalleryActions` reuses the existing WhatsApp helper. Selecting Request Quote opens the existing QuoteForm with the product title and reference filled in. No message is sent automatically.
- All grid images have descriptive Nairobi/Kenya alt text, lazy loading, reserved dimensions and responsive sizes. Only the explicitly opened lightbox image loads eagerly. Reduced motion preferences suppress hover scaling.

## Review and maintenance

Review the visible labels when adding or replacing assets. Do not treat mockups as installation photographs or infer a particular production process purely from a logo. Keep the asset manifest, provenance and displayed image dimensions together. Gallery changes are local until committed and pushed; deployment is separate.
