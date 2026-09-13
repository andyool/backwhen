import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Needed for the static GitHub Pages export; harmless on a Node host.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/checkout/", "/cart"] },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
