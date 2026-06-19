// "Akakçe usulü" görsel barındırma API'si — admin-only.
//
// İki kullanım:
//   1) JSON body { sourceUrl, slug?, productId? }
//        → kaynak URL'den görseli indirip kendi deponda barındırır.
//   2) multipart/form-data: file=<dosya>, slug?, productId?
//        → yüklenen dosyayı kendi deponda barındırır.
//
// Her iki durumda barındırılan public URL döner ({ url }). productId verilirse
// görsel doğrudan ürüne yazılır (imageUrl). Depo: Vercel Blob (token varsa) ya da
// yerel disk (Hostinger varsayılanı). Bkz. src/lib/image-storage.ts.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { storeImageFromUrl, storeImageFromFile } from "@/lib/image-storage";
import { getProductById, updateProductMedia, productSlug } from "@/lib/products/store";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  // Görsel indir/yükle — IP başına 60/saat.
  const ip = getClientIp(req);
  const limit = rateLimit(`upload-image:${ip}`, 60, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Görsel yükleme limiti aşıldı." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const contentType = req.headers.get("content-type") || "";

  let slug = "";
  let productId: string | undefined;
  let result: { url: string };

  try {
    if (contentType.includes("multipart/form-data")) {
      // ── Dosya yükleme ──
      const form = await req.formData();
      const file = form.get("file");
      slug = typeof form.get("slug") === "string" ? (form.get("slug") as string) : "";
      const pid = form.get("productId");
      productId = typeof pid === "string" && pid ? pid : undefined;

      if (!(file instanceof File)) {
        return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 });
      }
      slug = await resolveSlug(slug, productId);
      result = await storeImageFromFile(file, slug);
    } else {
      // ── Kaynak URL'den indir ──
      const body = (await req.json().catch(() => null)) as
        | { sourceUrl?: unknown; slug?: unknown; productId?: unknown }
        | null;
      if (!body) return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });

      const sourceUrl = typeof body.sourceUrl === "string" ? body.sourceUrl.trim() : "";
      slug = typeof body.slug === "string" ? body.slug : "";
      productId = typeof body.productId === "string" && body.productId ? body.productId : undefined;

      if (!sourceUrl) {
        return NextResponse.json({ error: "sourceUrl gerekli." }, { status: 400 });
      }
      slug = await resolveSlug(slug, productId);
      result = await storeImageFromUrl(sourceUrl, slug);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Görsel barındırılamadı.";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // productId verildiyse görseli ürüne yaz.
  let product = null;
  if (productId) {
    try {
      product = await updateProductMedia(productId, { imageUrl: result.url });
    } catch (e) {
      console.error("upload-image: ürüne yazılamadı:", e);
      // Görsel barındırıldı ama ürüne yazılamadı — URL'i yine de dön.
    }
  }

  return NextResponse.json({ success: true, url: result.url, product });
}

// Slug verilmemişse productId üzerinden türet; o da yoksa "urun" kullan.
async function resolveSlug(slug: string, productId?: string): Promise<string> {
  if (slug && slug.trim()) return slug.trim();
  if (productId) {
    const p = await getProductById(productId);
    if (p) return productSlug(p);
  }
  return "urun";
}
