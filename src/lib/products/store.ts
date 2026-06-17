import { prisma } from "@/lib/db";
import type { Product, Comparison } from "./types";
import fs from "fs";
import path from "path";

// ── JSON fallback ──
// The seeded catalog (data/*.json) is used when the DB is unreachable or empty
// (e.g. local dev against an un-seeded Neon branch). Keeps the site renderable
// without a populated database; the admin write paths still go straight to the DB.
let _fileProducts: Product[] | null = null;
let _fileComparisons: Comparison[] | null = null;

function fileProducts(): Product[] {
  if (_fileProducts) return _fileProducts;
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "data", "products.json"), "utf8");
    const arr = JSON.parse(raw);
    _fileProducts = (Array.isArray(arr) ? arr : []).map(toProduct);
  } catch {
    _fileProducts = [];
  }
  return _fileProducts;
}

function fileComparisons(): Comparison[] {
  if (_fileComparisons) return _fileComparisons;
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), "data", "comparisons.json"), "utf8");
    const arr = JSON.parse(raw);
    _fileComparisons = (Array.isArray(arr) ? arr : []).map(toComparison);
  } catch {
    _fileComparisons = [];
  }
  return _fileComparisons;
}

// ── Read helpers (cached per request via Next.js) ──

export async function getProducts(): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    if (rows.length) return rows.map(toProduct);
  } catch {}
  return fileProducts();
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const row = await prisma.product.findUnique({ where: { id } });
    if (row) return toProduct(row);
  } catch {}
  return fileProducts().find(p => p.id === id);
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const rows = await prisma.product.findMany({ where: { category }, orderBy: { brand: "asc" } });
    if (rows.length) return rows.map(toProduct);
  } catch {}
  return fileProducts().filter(p => p.category === category);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  try {
    const products = await prisma.product.findMany();
    if (products.length) return products.map(toProduct).find(p => productSlug(p) === slug);
  } catch {}
  return fileProducts().find(p => productSlug(p) === slug);
}

export async function getProductByBrandModel(brand: string, model: string): Promise<Product | undefined> {
  try {
    const row = await prisma.product.findUnique({ where: { brand_model: { brand, model } } });
    if (row) return toProduct(row);
  } catch {}
  return fileProducts().find(p => p.brand === brand && p.model === model);
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
  try {
    const rows = await prisma.comparison.findMany({ orderBy: { createdAt: "desc" } });
    if (rows.length) return rows.map(toComparison);
  } catch {}
  return fileComparisons();
}

export async function getComparisonBySlug(slug: string): Promise<Comparison | undefined> {
  try {
    const row = await prisma.comparison.findUnique({ where: { slug } });
    if (row) return toComparison(row);
  } catch {}
  return fileComparisons().find(c => c.slug === slug);
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
