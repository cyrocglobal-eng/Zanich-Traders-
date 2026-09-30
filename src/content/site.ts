/**
 * =============================================================================
 *  ZANICH GENERAL TRADERS — SINGLE SOURCE OF BUSINESS CONTENT
 * =============================================================================
 *  Everything the client might want to change lives here. Edit these values
 *  and the whole landing page updates. Items marked `PLACEHOLDER` are editable
 *  guesses/fillers — replace them with verified facts before going live.
 * =============================================================================
 */

export const site = {
  name: "Zanich General Traders",
  shortName: "Zanich",
  logoWordmark: { first: "ZANICH", second: "TRADERS" },
  tagline: "Over and above ink on paper",
  positioning: "We empower businesses to get noticed in a busy and competitive world.",

  contact: {
    email: "zanichgeneraltraders@gmail.com",
    phone: "+254 707 293 570",
    phoneHref: "tel:+254707293570",
    whatsappHref: "https://wa.me/254707293570",
    address: {
      line1: "Ground Floor, JKM Building",
      line2: "Keekorok Road",
      city: "Nairobi, Kenya",
    },
    // PLACEHOLDER — confirm working hours before publishing
    hours: "Mon–Fri 8:30am – 5:30pm · Sat 9:00am – 1:00pm",
  },

  nav: [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Why Us", href: "#why" },
    { label: "Work", href: "#portfolio" },
    { label: "Clients", href: "#clients" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    eyebrow: "Printing · Branding · Promotional Products",
    headline: ["Your brand.", "Beautifully", "brought to life."],
    sub: "Printing, branded apparel and promotional products for businesses, events and personal projects. Designed and produced with you in Nairobi.",
    primaryCta: { label: "Get a Quote", href: "#contact" },
    secondaryCta: { label: "Explore Our Work", href: "#portfolio" },
    stats: [
      { value: "7+", label: "Print & branding disciplines" },
      { value: "50+", label: "Brands served" }, // PLACEHOLDER — confirm real figure
      { value: "24hr", label: "Fast-track production*" }, // PLACEHOLDER — confirm SLA
    ],
  },

  about: {
    eyebrow: "About Us",
    title: "A branding partner, not just a printer.",
    body: [
      "Zanich General Traders is a printing and branding firm based in Nairobi, Kenya. We assist businesses to stand out while building collaborative relationships that help you realise your branding and marketing goals.",
      "We carry a wide range of quality, unique products to get your message across. Already have a ready-to-print file from your designer or agency? Your project goes straight to production and is delivered fast.",
      "No artwork, no time to design? Our in-house team of creative graphic designers will handle it end to end — and deliver exactly to your expectations.",
    ],
    pillars: [
      { title: "In-house design team", desc: "Creative designers who take you from idea to print-ready artwork." },
      { title: "Ready-to-print? Go.", desc: "Send a print-ready file and we move straight to production, delivered ASAP." },
      { title: "Collaborative by default", desc: "We build lasting relationships around your branding and marketing goals." },
    ],
  },

  services: {
    eyebrow: "What We Do",
    title: "Printing, branding & promotional products — done right.",
    intro:
      "At Zanich we are experts across your printing, branding and promotional needs. With cutting-edge technology, we deliver the best quality results, fast. Our services include but are not limited to:",
    items: [
      { name: "Digital Printing", desc: "Sharp, colour-accurate short-run printing for cards, flyers, brochures and collateral." },
      { name: "Large Format Printing", desc: "Banners, backdrops, billboards and signage that command attention at any scale." },
      { name: "Sublimation", desc: "Vibrant, durable full-colour prints on fabric, mugs, apparel and more." },
      { name: "Heat Transfer Printing", desc: "Crisp, long-lasting branding on t-shirts, uniforms and textiles." },
      { name: "Vinyl Cutting", desc: "Precision-cut lettering, decals and stickers for signage and vehicles." },
      { name: "Print & Cut", desc: "Custom-shaped labels, decals and graphics printed and contour-cut to spec." },
      { name: "Doming", desc: "Premium 3D resin-domed badges, labels and emblems with a high-end finish." },
      { name: "Promotional Merchandise", desc: "Branded mugs, bottles, pens, notebooks, apparel, umbrellas and gifts." },
    ],
  },

  why: {
    eyebrow: "Why Choose Us",
    title: "We help businesses market themselves professionally — without breaking the bank.",
    reasons: [
      {
        title: "Access to a huge inventory",
        desc: "Customised marketing materials and printed products for business or personal use, to fit any budget, style and occasion.",
      },
      {
        title: "Cutting-edge technology",
        desc: "We've invested in leading printing and branding technology, letting us maximise efficiency and consistently deliver quality.",
      },
      {
        title: "Speed you can plan around",
        desc: "Print-ready work goes straight to production and is delivered fast, so your campaign never waits on us.",
      },
      {
        title: "Value that scales",
        desc: "From a single business card to a full corporate rollout, we make professional branding accessible at every budget.",
      },
    ],
  },

  portfolio: {
    eyebrow: "Selected Work",
    title: "Projects we've brought to life.",
    intro: "A snapshot of the branding, print and promotional projects we've delivered for businesses big and small.",
    categories: [
      { title: "Corporate Apparel", tag: "Embroidery · Print", image: "/images/pf-apparel.jpg" },
      { title: "Branded Drinkware", tag: "Sublimation · Doming", image: "/images/pf-drinkware.jpg" },
      { title: "Signage & Banners", tag: "Large Format", image: "/images/pf-signage.jpg" },
      { title: "Print Collateral", tag: "Digital Printing", image: "/images/pf-print.jpg" },
      { title: "Vehicle Branding", tag: "Vinyl · Wraps", image: "/images/pf-vehicle.jpg" },
      { title: "Promotional Gifts", tag: "Merchandise", image: "/images/hero-merch.jpg" },
    ],
  },

  clients: {
    eyebrow: "Trusted By",
    title: "Businesses, organisations and institutions rely on us.",
    intro:
      "We work with businesses big or small, organisations and individuals who need to brand themselves as professionals. A few of the names we've been proud to serve:",
    logos: [
      "NRG Radio",
      "AAR Healthcare",
      "Ticketsasa",
      "Alpha Grain Millers",
      "Sun King",
      "Mabati Kenya",
      "Kabarak University",
      "County Government of Kajiado",
      "County Government of Homa Bay",
      "County Government of Meru",
      "Pride Drive Tour Solutions",
      "Sandpiper Aviation",
      "Kikao Chill & Vibe",
      "PFP",
    ],
  },

  testimonials: {
    eyebrow: "Client Stories",
    title: "The work speaks. So do our clients.",
    items: [
      {
        quote:
          "Working with Zanich General Traders has been such a smooth experience. They really understood our vibe and brought our branding to life in a clean, creative way. The quality is on point, and they delivered exactly what we needed without stress. Definitely our go-to for anything branding and print.",
        author: "Ticketsasa",
        role: "Events & Ticketing",
      },
      {
        quote:
          "Zanich General Traders exceeded our expectations in every way. From concept to final delivery, their attention to detail, creativity and professionalism stood out. The quality of our branded materials truly elevated our brand image. We highly recommend them for reliable, top-tier branding and printing services.",
        author: "Kikao Chill & Vibe",
        role: "Hospitality & Lounge",
      },
    ],
  },

  cta: {
    title: "Ready to take your marketing to the next level?",
    sub: "Tell us what you need branded — we'll turn it around fast, on budget, and over and above ink on paper.",
    primary: { label: "Talk to Us", href: "#contact" },
  },

  footer: {
    blurb:
      "Nairobi-based printing, branding and promotional products firm. We help businesses get noticed — over and above ink on paper.",
    legal: "Zanich General Traders. All rights reserved.",
  },
} as const;

export type Site = typeof site;
