import { site } from "./site";

const details = [
  {
    slug: "digital-printing",
    image: "pf-print.jpg",
    fields: ["Finished size", "Paper or card stock", "Colour and finishing"],
    preparation:
      "Tell us whether you need cards, flyers, brochures or other collateral. Include the finished size, number of copies and preferred paper. If you are unsure of the stock or finish, our team can help you choose.",
    artwork:
      "Share your finished dimensions and artwork format. Our team will check resolution, bleed and colour requirements before production.",
  },
  {
    slug: "large-format-printing",
    image: "pf-signage.jpg",
    fields: [
      "Width × height and units",
      "Material",
      "Indoor/outdoor and installation needs",
    ],
    preparation:
      "For banners, backdrops, billboards and signage, include the width and height with units, the display location and your deadline. Let us know if you need the team to assess installation requirements.",
    artwork:
      "Large-format artwork needs to match the intended viewing distance and final size. Tell us the artwork dimensions and scale so the team can advise.",
  },
  {
    slug: "sublimation",
    image: "pf-drinkware.jpg",
    fields: [
      "Product or substrate",
      "Print area",
      "Product supplied by customer or needed",
    ],
    preparation:
      "Choose the product you want to brand and tell us the quantity, print area and whether you already have the items. The team will confirm whether the surface is suitable for sublimation.",
    artwork:
      "Full-colour artwork and the intended print area help us assess your brief. If your design is not ready, our in-house team can help.",
  },
  {
    slug: "heat-transfer-printing",
    image: "pf-apparel.jpg",
    fields: [
      "Garment type and sizes",
      "Print positions",
      "Garment supplied by customer or needed",
    ],
    preparation:
      "Tell us the garment type, colour, size breakdown and print positions. Include the number of garments and whether they are supplied by you or required as part of the quote.",
    artwork:
      "Share your logo or design and the approximate size of each print. The team will check artwork and garment suitability before confirming production.",
  },
  {
    slug: "vinyl-cutting",
    image: "pf-vehicle.jpg",
    fields: [
      "Application surface",
      "Dimensions and colour",
      "Installation requirements",
    ],
    preparation:
      "For lettering, decals and vehicle or shop graphics, include the surface, dimensions, colour and quantity. A clear description of where the graphics will be applied helps the team assess the job.",
    artwork:
      "Tell us if you have vector artwork or only a photo or logo image. We can assess whether artwork preparation is needed for clean cutting.",
  },
  {
    slug: "print-and-cut",
    image: "pf-print.jpg",
    fields: [
      "Dimensions and shape",
      "Material and finish",
      "Cut path available?",
    ],
    preparation:
      "Describe your labels, decals or custom-shaped graphics. Include dimensions, material preferences, quantity and whether each item needs its own contour cut.",
    artwork:
      "Let us know whether your file includes a cut path. If not, our team can review the design and quote for preparation where needed.",
  },
  {
    slug: "doming",
    image: "pf-drinkware.jpg",
    fields: ["Badge dimensions", "Shape and application", "Artwork format"],
    preparation:
      "For resin-domed badges, labels and emblems, share the dimensions, shape, quantity and intended application. These details help the team assess the finish and production requirements.",
    artwork:
      "Provide the design at its intended badge size where possible. The team will review details and legibility before confirming production.",
  },
  {
    slug: "promotional-merchandise",
    image: "hero-merch.jpg",
    fields: ["Product", "Branding positions", "Optional budget in KES"],
    preparation:
      "Choose mugs, bottles, pens, notebooks, apparel, umbrellas or gifts. Tell us your quantity, branding positions and occasion. An optional budget helps the team narrow down suitable options.",
    artwork:
      "Share your logo and any brand guidelines, or tell us you need design assistance. Product availability and branding suitability are confirmed with your quote.",
  },
] as const;

export const services = site.services.items.map((service, index) => ({
  ...service,
  ...details[index],
}));
export type Service = (typeof services)[number];
export const findService = (slug: string) =>
  services.find((service) => service.slug === slug);
