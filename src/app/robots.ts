import type { MetadataRoute } from "next";
import { absoluteUrl, publicSite } from "@/lib/seo/config";
export default function robots(): MetadataRoute.Robots {
  return publicSite.indexable
    ? {
        rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
        sitemap: absoluteUrl("/sitemap.xml"),
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
