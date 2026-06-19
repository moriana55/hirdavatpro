// Barındırılan ürün görsellerini servis eden route (yerel disk modu).
//
// image-storage.ts görselleri runtime'da `public/uploads/products/` altına yazar.
// Next 16 standalone/Node output'unda runtime'da yazılan public dosyalar her zaman
// otomatik servis edilmediği için burada dosyayı kendimiz okuyup stream ediyoruz.
// Hostinger Node app'inde güvenilir çalışır.
//
// Güvenlik: yalnızca uploads kökü altındaki dosyalar; path traversal (..) engellenir.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { UPLOADS_ROOT } from "@/lib/image-storage";

export const dynamic = "force-dynamic";

// uploads kökü = public/uploads/products. Route /api/uploads/products/<dosya>.
// İlk segment "products" beklenir; sonrası dosya adı.
const UPLOADS_BASE = path.dirname(UPLOADS_ROOT); // .../public/uploads

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/uploads/[...path]">
) {
  const { path: segments } = await ctx.params;
  if (!segments || segments.length === 0) {
    return NextResponse.json({ error: "Dosya yolu eksik." }, { status: 400 });
  }

  // path traversal / mutlak yol koruması.
  if (segments.some((s) => !s || s === "." || s === ".." || s.includes("\0") || path.isAbsolute(s))) {
    return NextResponse.json({ error: "Geçersiz yol." }, { status: 400 });
  }

  const target = path.normalize(path.join(UPLOADS_BASE, ...segments));
  // Çözülen yol mutlaka uploads kökü altında olmalı.
  if (target !== UPLOADS_BASE && !target.startsWith(UPLOADS_BASE + path.sep)) {
    return NextResponse.json({ error: "Geçersiz yol." }, { status: 400 });
  }

  const ext = path.extname(target).slice(1).toLowerCase();
  const contentType = CONTENT_TYPE_BY_EXT[ext];
  if (!contentType) {
    return NextResponse.json({ error: "Desteklenmeyen dosya türü." }, { status: 400 });
  }

  try {
    const data = await fs.readFile(target);
    return new NextResponse(new Uint8Array(data), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        // İçerik adresli dosya adı (hash) → uzun cache güvenli.
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 404 });
  }
}
