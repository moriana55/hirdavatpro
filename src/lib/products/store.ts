import { prisma } from "@/lib/db";
import type { Product, Comparison } from "./types";

// ── Read helpers (cached per request via Next.js) ──

export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toProduct);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toProduct(row) : undefined;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  const rows = await prisma.product.findMany({ where: { category }, orderBy: { brand: "asc" } });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await prisma.product.findMany();
  return products.map(toProduct).find(p => productSlug(p) === slug);
}

export async function getProductByBrandModel(brand: string, model: string): Promise<Product | undefined> {
  const row = await prisma.product.findUnique({ where: { brand_model: { brand, model } } });
  return row ? toProduct(row) : undefined;
}

export function productSlug(p: Pick<Product, "brand" | "model">): string {
  return `${p.brand}-${p.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

// ── Write helpers ──

export async function saveProduct(product: Omit<Product, "id" | "createdAt"> & { id?: string }): Promise<Product> {
  const row = await prisma.product.upsert({
    where: { brand_model: { brand: product.brand, model: product.model } },
    update: {
      category: product.category,
      specs: product.specs as any,
      priceRange: product.priceRange,
      imageUrl: product.imageUrl,
      sourceUrl: product.sourceUrl,
    },
    create: {
      brand: product.brand,
      model: product.model,
      category: product.category,
      specs: product.specs as any,
      priceRange: product.priceRange,
      imageUrl: product.imageUrl,
      sourceUrl: product.sourceUrl,
    },
  });
  return toProduct(row);
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
}

// ── Comparisons ──

export async function getComparisons(): Promise<Comparison[]> {
  const rows = await prisma.comparison.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toComparison);
}

export async function getComparisonBySlug(slug: string): Promise<Comparison | undefined> {
  const row = await prisma.comparison.findUnique({ where: { slug } });
  return row ? toComparison(row) : undefined;
}

export async function saveComparison(comparison: Omit<Comparison, "createdAt"> & { createdAt?: string }): Promise<Comparison> {
  const row = await prisma.comparison.upsert({
    where: { slug: comparison.slug },
    update: {
      content: comparison.content,
      verdict: comparison.verdict,
    },
    create: {
      id: comparison.id,
      slug: comparison.slug,
      productA: comparison.productA,
      productB: comparison.productB,
      content: comparison.content,
      verdict: comparison.verdict,
    },
  });
  return toComparison(row);
}

export function generateSlug(a: Pick<Product, "brand" | "model">, b: Pick<Product, "brand" | "model">): string {
  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return `${slugify(a.brand + "-" + a.model)}-vs-${slugify(b.brand + "-" + b.model)}`;
}

// ── Mappers ──

function toProduct(row: any): Product {
  return {
    id: row.id,
    brand: row.brand,
    model: row.model,
    category: row.category,
    specs: (typeof row.specs === "string" ? JSON.parse(row.specs) : row.specs) || {},
    priceRange: row.priceRange ?? undefined,
    imageUrl: row.imageUrl ?? undefined,
    sourceUrl: row.sourceUrl ?? undefined,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
  };
}

function toComparison(row: any): Comparison {
  return {
    id: row.id,
    slug: row.slug,
    productA: row.productA,
    productB: row.productB,
    content: row.content,
    verdict: row.verdict,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
  };
}
