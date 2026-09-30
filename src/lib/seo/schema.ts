import { site } from "@/content/site";
import { services, type Service } from "@/content/services";
import { business } from "@/content/business";
import { absoluteUrl } from "./config";

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": absoluteUrl("/#business"),
    name: site.name,
    url: absoluteUrl("/"),
    telephone: site.contact.phone.replace(/\s/g, ""),
    email: site.contact.email,
    image: absoluteUrl("/images/hero-merch.jpg"),
    slogan: site.tagline,
    description:
      "Nairobi-based printing, branding and promotional products firm.",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.contact.address.line1}, ${site.contact.address.line2}`,
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    areaServed: { "@type": "City", name: "Nairobi" },
    openingHoursSpecification: business.openingHours.map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: entry.days.map((day) => `https://schema.org/${day}`),
      opens: entry.opens,
      closes: entry.closes,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Printing, branding and promotional services",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.name,
          url: absoluteUrl(`/services/${service.slug}`),
          provider: { "@id": absoluteUrl("/#business") },
        },
      })),
    },
  };
}
export function serviceSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": absoluteUrl(`/services/${service.slug}#service`),
    name: service.name,
    serviceType: service.name,
    description: service.desc,
    url: absoluteUrl(`/services/${service.slug}`),
    image: absoluteUrl(`/images/${service.image}`),
    provider: { "@id": absoluteUrl("/#business") },
    areaServed: { "@type": "City", name: "Nairobi" },
  };
}
export function breadcrumbSchema(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.name, path: `/services/${service.slug}` },
    ].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
