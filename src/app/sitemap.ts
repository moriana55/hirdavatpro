import type { MetadataRoute } from "next";
import { getComparisons, getProducts, productSlug } from "@/lib/products/store";

const BASE = "https://hirdavatpro.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const comparisons = await getComparisons();
  const products = await getProducts();
  const categories = [...new Set(products.map(p => p.category))];

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/karsilastirma`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/arama`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/araclar`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/araclar/matkap-ucu`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/araclar/testere-secimi`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map(cat => ({
    url: `${BASE}/kategori/${cat}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map(p => ({
    url: `${BASE}/urun/${productSlug(p)}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const comparisonPages: MetadataRoute.Sitemap = comparisons.map(c => ({
    url: `${BASE}/karsilastirma/${c.slug}`,
    lastModified: new Date(c.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...comparisonPages];
}
