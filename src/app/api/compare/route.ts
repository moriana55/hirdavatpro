import { NextRequest, NextResponse } from "next/server";
import { getProductById, getComparisons, saveComparison, generateSlug } from "@/lib/products/store";
import { generateComparisonContent } from "@/lib/products/ai";
import { randomUUID } from "crypto";
import { isAuthorized } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson } from "@/lib/validation";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getComparisons());
  } catch {
    return NextResponse.json({ error: "Karşılaştırmalar yüklenemedi." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  // OpenAI çağrısı — maliyet suistimaline karşı IP başına 60/saat.
  const ip = getClientIp(request);
  const limit = rateLimit(`compare:${ip}`, 60, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Üretim limiti aşıldı." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await safeJson<{ productAId?: unknown; productBId?: unknown }>(request);
  if (!body) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

  const productAId = typeof body.productAId === "string" ? body.productAId : "";
  const productBId = typeof body.productBId === "string" ? body.productBId : "";
  if (!productAId || !productBId) {
    return NextResponse.json({ error: "productAId ve productBId gerekli" }, { status: 400 });
  }

  try {
    const a = await getProductById(productAId);
    const b = await getProductById(productBId);

    if (!a || !b) {
      return NextResponse.json({ error: "Products not found" }, { status: 404 });
    }
    if (a.id === b.id) {
      return NextResponse.json({ error: "Cannot compare same product" }, { status: 400 });
    }

    const slug = generateSlug(a, b);
    const existing = (await getComparisons()).find((c) => c.slug === slug);
    if (existing) {
      return NextResponse.json({ success: true, comparison: existing, existing: true });
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
    return NextResponse.json({ success: true, comparison });
  } catch (err) {
    console.error("compare error:", err);
    return NextResponse.json({ error: "Karşılaştırma oluşturulamadı." }, { status: 502 });
  }
}
