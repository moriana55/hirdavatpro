import type { MetadataRoute } from "next";
import { getComparisons, getProducts, productSlug } from "@/lib/products/store";
import { getAllPosts } from "@/lib/blog/posts";
import { prisma } from "@/lib/db";

const BASE = "https://hirdavatpro.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const comparisons = await getComparisons();
  const products = await getProducts();
  const categories = [...new Set(products.map(p => p.category))];
  const blogPosts = await prisma.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } });

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/karsilastirma`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/arama`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/araclar`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/proje-sihirbazi`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/projelerim`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    ...[
      "akilli-secim",
      "beton-karisim",
      "boya-hesaplayici",
      "fayans-hesaplayici",
      "harita-tasarim",
      "kablo-kesiti",
      "matkap-ucu",
      "testere-secimi",
      "vida-dubel",
      "zimpara-secimi",
      "zemin-planlayici",
    ].map((tool) => ({
      url: `${BASE}/araclar/${tool}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
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

  // Birleşim: hem dosya-tabanlı (statik rehberler) hem DB-tabanlı (CMS) blog yazıları, slug'a göre tekilleştir
  const blogSlugSeen = new Set<string>();
  const blogPages: MetadataRoute.Sitemap = [];
  for (const p of getAllPosts()) {
    if (blogSlugSeen.has(p.slug)) continue;
    blogSlugSeen.add(p.slug);
    blogPages.push({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
  }
  for (const p of blogPosts) {
    if (blogSlugSeen.has(p.slug)) continue;
    blogSlugSeen.add(p.slug);
    blogPages.push({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    });
  }

  return [...staticPages, ...categoryPages, ...productPages, ...comparisonPages, ...blogPages];
}
