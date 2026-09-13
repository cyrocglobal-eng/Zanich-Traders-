import type { Metadata } from "next";
import { site } from "@/content/site";
import type { Service } from "@/content/services";
import { absoluteUrl, publicSite } from "./config";

export const homeTitle = "Printing Services Nairobi | Zanich General Traders";
export const homeDescription =
  "Printing, branding and promotional products in Nairobi. Visit Zanich at JKM Building, Keekorok Road. Request a quote on WhatsApp.";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
  image = "/opengraph-image",
): Metadata {
  return {
    metadataBase: new URL(publicSite.url),
    title: { absolute: title },
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      type: "website",
      siteName: site.name,
      locale: "en_KE",
      images: [
        {
          url: absoluteUrl(image),
          alt: site.name,
          ...(image === "/opengraph-image" ? { width: 1200, height: 630 } : {}),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [absoluteUrl(image)],
    },
    robots: {
      index: publicSite.indexable,
      follow: publicSite.indexable,
      googleBot: {
        index: publicSite.indexable,
        follow: publicSite.indexable,
        "max-image-preview": "large",
      },
    },
  };
}
export function serviceMetadata(service: Service) {
  let title = `${service.name} Nairobi | Zanich`;
  let description = `${service.desc} Request a tailored quote from Zanich in Nairobi.`;
  if (service.slug === "promotional-merchandise") {
    title = "Custom Promotional Merchandise Kenya | Zanich";
    description =
      "Brand mugs, bottles, pens, notebooks, apparel and gifts with Zanich General Traders. Tell us your quantity and deadline for a tailored quote.";
  }
  if (service.slug === "large-format-printing") {
    title = "Large Format Signage Nairobi | Zanich";
    description =
      "Banners, backdrops, billboards and signage from Zanich General Traders in Nairobi. Share your dimensions, artwork and deadline for a quote.";
  }
  return pageMetadata(
    title,
    description,
    `/services/${service.slug}`,
    `/images/${service.image}`,
  );
}
