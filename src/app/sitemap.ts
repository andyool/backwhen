import type { MetadataRoute } from "next";
import { collections, products } from "@/lib/products";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    { url: base, priority: 1 },
    ...collections.map((c) => ({ url: `${base}/collections/${c.slug}`, priority: 0.8 })),
    ...products.map((p) => ({ url: `${base}/products/${p.slug}`, priority: 0.7 })),
    { url: `${base}/about` },
    { url: `${base}/shipping` },
  ];
}
