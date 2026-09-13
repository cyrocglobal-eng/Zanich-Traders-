import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { absoluteUrl, publicSite } from "@/lib/seo/config";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!publicSite.indexable) return [];
  return [
    { url: absoluteUrl("/"), priority: 1, changeFrequency: "monthly" },
    {
      url: absoluteUrl("/services"),
      priority: 0.9,
      changeFrequency: "monthly",
    },
    ...services.map((service) => ({
      url: absoluteUrl(`/services/${service.slug}`),
      priority: 0.8,
      changeFrequency: "monthly" as const,
    })),
    { url: absoluteUrl("/contact"), priority: 0.7, changeFrequency: "yearly" },
    { url: absoluteUrl("/privacy"), priority: 0.3, changeFrequency: "yearly" },
  ];
}
