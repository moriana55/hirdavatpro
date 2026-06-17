import { NextRequest, NextResponse } from "next/server";
import { getProducts, saveProduct, deleteProduct } from "@/lib/products/store";
import { fetchProductSpecsWithAI } from "@/lib/products/ai";
import type { ProductCategory } from "@/lib/products/types";
import { isAuthorized } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson, reqString, badRequest } from "@/lib/validation";

export const dynamic = "force-dynamic";

function unauthorized() {
  return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
}

export async function GET() {
  try {
    return NextResponse.json(await getProducts());
  } catch {
    return NextResponse.json({ error: "Ürünler yüklenemedi." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAuthorized(request))) return unauthorized();

  const body = await safeJson<Record<string, unknown>>(request);
  if (!body) return badRequest("Geçersiz istek.");

  const brand = reqString(body.brand, "brand", 100);
  const model = reqString(body.model, "model", 100);
  const category = reqString(body.category, "category", 100);
  if (!brand.ok) return badRequest(brand.error);
  if (!model.ok) return badRequest(model.error);
  if (!category.ok) return badRequest(category.error);

  const useAI = body.useAI === true;

  try {
    if (useAI) {
      if (!process.env.OPENAI_API_KEY) {
        return NextResponse.json({ error: "OpenAI yapılandırılmamış." }, { status: 503 });
      }
      // AI çekimi maliyetli — IP başına 60/saat.
      const ip = getClientIp(request);
      const limit = rateLimit(`product-ai:${ip}`, 60, 60 * 60 * 1000);
      if (!limit.ok) {
        return NextResponse.json(
          { error: "Üretim limiti aşıldı." },
          { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
        );
      }
      const product = await fetchProductSpecsWithAI(brand.value, model.value, category.value as ProductCategory);
      const saved = await saveProduct(product);
      return NextResponse.json({ success: true, product: saved });
    }

    const saved = await saveProduct({
      brand: brand.value,
      model: model.value,
      category: category.value as ProductCategory,
      specs: (body.specs && typeof body.specs === "object") ? (body.specs as Record<string, string>) : {},
      priceRange: typeof body.priceRange === "string" ? body.priceRange : undefined,
    });
    return NextResponse.json({ success: true, product: saved });
  } catch (err) {
    console.error("products POST error:", err);
    return NextResponse.json({ error: "Ürün kaydedilemedi." }, { status: 502 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!(await isAuthorized(request))) return unauthorized();

  const body = await safeJson<{ id?: unknown }>(request);
  if (!body) return badRequest("Geçersiz istek.");
  if (typeof body.id !== "string" || !body.id) return badRequest("id required");

  try {
    await deleteProduct(body.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Ürün silinemedi." }, { status: 500 });
  }
}
