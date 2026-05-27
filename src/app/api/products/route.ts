import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProduct, deleteProduct } from "@/lib/products/store";
import { fetchProductSpecsWithAI } from "@/lib/products/ai";
import type { ProductCategory } from "@/lib/products/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getProducts());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { brand, model, category, useAI } = body;

  if (!brand || !model || !category) {
    return NextResponse.json({ error: "brand, model, category required" }, { status: 400 });
  }

  if (useAI) {
    const product = await fetchProductSpecsWithAI(brand, model, category as ProductCategory);
    const saved = await saveProduct(product);
    return NextResponse.json({ success: true, product: saved });
  }

  const saved = await saveProduct({
    brand,
    model,
    category: category as ProductCategory,
    specs: body.specs || {},
    priceRange: body.priceRange || undefined,
  });
  return NextResponse.json({ success: true, product: saved });
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await deleteProduct(id);
  return NextResponse.json({ success: true });
}
