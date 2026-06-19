// Ürün medya (video/embed) alanlarını günceller — admin-only.
//
// POST body: { productId, youtubeUrl?, instagramUrl?, removeImage? }
//   - boş string ("") gönderilirse o alan TEMİZLENİR (kaldır).
//   - alan hiç gönderilmezse dokunulmaz.
//   - removeImage: true → ürünün barındırılan görseli kaldırılır (imageUrl temizlenir).
//
// Görsel barındırma için ayrı route var (upload-image). Bu route yalnızca
// video/embed URL'lerini ürüne işler (YouTube/Instagram). Bkz. Feature 2.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { safeJson, badRequest } from "@/lib/validation";
import { updateProductMedia } from "@/lib/products/store";
import { normalizeYouTube, normalizeInstagram } from "@/lib/media-embed";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const body = await safeJson<Record<string, unknown>>(req);
  if (!body) return badRequest("Geçersiz istek.");

  const productId = typeof body.productId === "string" ? body.productId : "";
  if (!productId) return badRequest("productId gerekli.");

  const patch: { imageUrl?: string | null; youtubeUrl?: string | null; instagramUrl?: string | null } = {};

  // Barındırılan görseli kaldır.
  if (body.removeImage === true) {
    patch.imageUrl = null;
  }

  if (typeof body.youtubeUrl === "string") {
    const raw = body.youtubeUrl.trim();
    if (raw === "") {
      patch.youtubeUrl = null; // temizle
    } else {
      const id = normalizeYouTube(raw);
      if (!id) return badRequest("Geçersiz YouTube URL'i.");
      // Tam URL olarak saklarız; render ederken id tekrar ayıklanır.
      patch.youtubeUrl = raw;
    }
  }

  if (typeof body.instagramUrl === "string") {
    const raw = body.instagramUrl.trim();
    if (raw === "") {
      patch.instagramUrl = null; // temizle
    } else {
      if (!normalizeInstagram(raw)) return badRequest("Geçersiz Instagram URL'i.");
      patch.instagramUrl = raw;
    }
  }

  try {
    const product = await updateProductMedia(productId, patch);
    return NextResponse.json({ success: true, product });
  } catch (e) {
    console.error("product-media POST error:", e);
    return NextResponse.json({ error: "Kaydedilemedi." }, { status: 502 });
  }
}
