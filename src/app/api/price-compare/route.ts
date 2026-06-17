import { NextRequest, NextResponse } from "next/server";
import { getProductById } from "@/lib/products/store";
import { getPriceSources } from "@/lib/price-compare/sources";

export const dynamic = "force-dynamic";

// GET /api/price-compare?productId=...
// Bir ürünün temsilî (STUB) çok kaynaklı fiyatlarını döndürür.
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const productId = url.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "productId gerekli." }, { status: 400 });
  }

  const product = await getProductById(productId);
  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }

  const sources = getPriceSources(product);
  return NextResponse.json({
    productId,
    catalogRange: product.priceRange ?? null,
    sources,
    // Veri kaynağı açıkça stub olarak işaretli — UI bunu kullanıcıya bildirir.
    stub: true,
    note: "Fiyatlar temsilîdir; gerçek mağaza fiyatları için bağlantıları ziyaret edin.",
  });
}
