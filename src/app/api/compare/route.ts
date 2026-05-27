import { NextRequest, NextResponse } from "next/server";
import { getProductById, getComparisons, saveComparison, generateSlug } from "@/lib/products/store";
import { generateComparisonContent } from "@/lib/products/ai";
import { randomUUID } from "crypto";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getComparisons());
}

export async function POST(request: NextRequest) {
  const { productAId, productBId } = await request.json();

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
}
