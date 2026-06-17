import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProduct, getComparisons, saveComparison, generateSlug } from "@/lib/products/store";
import { fetchProductSpecsWithAI, generateComparisonContent } from "@/lib/products/ai";
import type { ProductCategory } from "@/lib/products/types";
import { randomUUID } from "crypto";
import { isAuthorized } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  // Toplu üretim çok maliyetli — IP başına 300 istek / saat (toplu döngü için makul).
  const ip = getClientIp(request);
  const limit = rateLimit(`bulk-generate:${ip}`, 300, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Üretim limiti aşıldı." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await safeJson<Record<string, unknown>>(request);
  if (!body) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

  const action = body.action;

  try {
    if (action === "add-product") {
      const brand = String(body.brand ?? "").trim();
      const model = String(body.model ?? "").trim();
      const category = String(body.category ?? "").trim();
      if (!brand || !model || !category) {
        return NextResponse.json({ error: "brand, model, category gerekli" }, { status: 400 });
      }
      const existing = (await getProducts()).find(
        (p) => p.brand.toLowerCase() === brand.toLowerCase() && p.model.toLowerCase() === model.toLowerCase()
      );
      if (existing) {
        return NextResponse.json({ success: true, product: existing, skipped: true });
      }
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: "OpenAI yapılandırılmamış." }, { status: 503 });
      }
      const product = await fetchProductSpecsWithAI(brand, model, category as ProductCategory);
      const saved = await saveProduct(product);
      return NextResponse.json({ success: true, product: saved, skipped: false });
    }

    if (action === "compare") {
      const productAId = String(body.productAId ?? "");
      const productBId = String(body.productBId ?? "");
      const products = await getProducts();
      const a = products.find((p) => p.id === productAId);
      const b = products.find((p) => p.id === productBId);
      if (!a || !b) {
        return NextResponse.json({ error: "Products not found" }, { status: 404 });
      }
      const slug = generateSlug(a, b);
      const existing = (await getComparisons()).find((c) => c.slug === slug);
      if (existing) {
        return NextResponse.json({ success: true, comparison: existing, skipped: true });
      }
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: "OpenAI yapılandırılmamış." }, { status: 503 });
      }
      const { content, verdict } = await generateComparisonContent(a, b);
      const comparison = {
        id: randomUUID(),
        slug,
        productA: a.id,
        productB: b.id,
        content,
        verdict,
        createdAt: new Date().toISOString(),
      };
      await saveComparison(comparison);
      return NextResponse.json({ success: true, comparison, skipped: false });
    }

    if (action === "get-pairs") {
      const products = await getProducts();
      const comparisons = await getComparisons();
      const existingSlugs = new Set(comparisons.map((c) => c.slug));

      const byCategory = new Map<string, typeof products>();
      for (const p of products) {
        const list = byCategory.get(p.category) || [];
        list.push(p);
        byCategory.set(p.category, list);
      }

      const pairs: { a: typeof products[0]; b: typeof products[0]; exists: boolean }[] = [];
      for (const [, list] of byCategory) {
        for (let i = 0; i < list.length; i++) {
          for (let j = i + 1; j < list.length; j++) {
            const slug = generateSlug(list[i], list[j]);
            pairs.push({ a: list[i], b: list[j], exists: existingSlugs.has(slug) });
          }
        }
      }

      return NextResponse.json({
        totalProducts: products.length,
        totalComparisons: comparisons.length,
        totalPairs: pairs.length,
        pendingPairs: pairs.filter((p) => !p.exists).length,
        pairs,
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (err) {
    console.error("bulk-generate error:", err);
    return NextResponse.json({ error: "İşlem başarısız." }, { status: 502 });
  }
}
