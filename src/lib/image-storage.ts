// "Akakçe usulü" görsel pipeline — kaynak görseli kendi deponda barındır.
//
// Amaç: bir kaynak URL'i hotlink etmek yerine görseli indirip kendi sunucumuza
// kaydetmek (stabil + optimize + telif/erişim riski düşük). Akakçe gibi tüm
// ürün görselleri kendi domaininizde servis edilir.
//
// Çalışma stratejisi (öncelik sırası):
//   1) BLOB_READ_WRITE_TOKEN env varsa → Vercel Blob'a yükle (her yerden çalışır).
//      Token ZORUNLU DEĞİL; sadece varsa kullanılır.
//   2) Aksi halde (Hostinger varsayılanı) → yerel diske `public/uploads/products/`
//      altına yaz. Dönen URL `/api/uploads/products/<dosya>` olur ve dosya
//      `src/app/api/uploads/[...path]/route.ts` üzerinden stream edilir.
//
// Neden /api/uploads route'u? Next 16 standalone/Node output'unda `public/`
// klasörüne RUNTIME'da yazılan dosyalar her zaman otomatik servis edilmeyebilir
// (build sırasında snapshot alınır). Bu yüzden runtime'da yazdığımız görselleri
// kendimiz stream eden bir route handler ile servis ediyoruz — Hostinger Node
// app'inde güvenilir şekilde çalışır.

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

// İndirme/yükleme güvenlik limitleri.
const MAX_BYTES = 8 * 1024 * 1024; // ~8MB
const FETCH_TIMEOUT_MS = 15_000;

// Gerçek tarayıcı User-Agent — bazı CDN'ler botları/boş UA'yı engeller.
const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// Yerel disk hedefi (Hostinger varsayılanı).
const UPLOAD_SUBDIR = path.join("uploads", "products");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOAD_DIR = path.join(PUBLIC_DIR, UPLOAD_SUBDIR);

// content-type → uzantı eşlemesi (yalnızca güvenli görsel formatları).
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "image/svg+xml": "svg", // not: SVG aktif XSS taşıyabilir; aşağıda reddedilir.
};

// Güvenli, kısa, çakışmasız dosya adı türet.
// Date.now/Math.random YERİNE içerikten (sha256) + slug'tan türetiyoruz:
// aynı görsel + aynı slug → aynı dosya adı (idempotent, tekrar yüklemede şişmez).
function buildFileName(slug: string, bytes: Uint8Array, ext: string): string {
  const safeSlug = (slug || "urun")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "urun";
  const hash = createHash("sha256").update(bytes).digest("hex").slice(0, 12);
  return `${safeSlug}-${hash}.${ext}`;
}

function extFromContentType(contentType: string | null): string | null {
  if (!contentType) return null;
  const type = contentType.split(";")[0].trim().toLowerCase();
  if (type === "image/svg+xml") return null; // SVG güvenlik gereği reddedilir.
  return EXT_BY_TYPE[type] ?? null;
}

// Vercel Blob yapılandırılmış mı? (opsiyonel; yoksa yerel diske düşülür.)
function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

// Bayt dizisini hedefe (Blob ya da yerel disk) yaz, public URL döndür.
async function persistBytes(
  bytes: Uint8Array,
  contentType: string,
  fileName: string
): Promise<string> {
  if (isBlobConfigured()) {
    // Dinamik import: @vercel/blob OPSİYONELDİR ve Hostinger'da kurulu olmayabilir.
    // Paket adını değişkene alıyoruz ki bundler (Turbopack/webpack) build sırasında
    // modülü statik çözmeye çalışıp "module not found" hatası vermesin. Token yoksa
    // bu blok hiç çalışmaz; çalışırsa paketin kurulu olması gerekir.
    const blobPkg = "@vercel/blob";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mod: any = await import(/* webpackIgnore: true */ /* @vite-ignore */ blobPkg);
    const blob = await mod.put(`${UPLOAD_SUBDIR.replace(/\\/g, "/")}/${fileName}`, bytes, {
      access: "public",
      contentType,
      addRandomSuffix: false,
    });
    return blob.url as string;
  }

  // Yerel disk (Hostinger varsayılanı).
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, fileName), bytes);
  // /api/uploads/[...path] route'u bu dosyayı stream eder.
  return `/api/uploads/products/${fileName}`;
}

// Bir görsel byte dizisini doğrula (boyut + uzantı) ve barındır.
async function storeImageBytes(
  buf: ArrayBuffer,
  contentType: string | null,
  slug: string
): Promise<{ url: string }> {
  const bytes = new Uint8Array(buf);
  if (bytes.byteLength === 0) throw new Error("Boş görsel.");
  if (bytes.byteLength > MAX_BYTES) {
    throw new Error(`Görsel çok büyük (max ${Math.round(MAX_BYTES / 1024 / 1024)}MB).`);
  }
  const ext = extFromContentType(contentType);
  if (!ext) {
    throw new Error("Desteklenmeyen görsel türü (yalnızca JPG/PNG/WebP/GIF/AVIF).");
  }
  const fileName = buildFileName(slug, bytes, ext);
  const url = await persistBytes(bytes, contentType!.split(";")[0].trim().toLowerCase(), fileName);
  return { url };
}

// ── Public API ──

// Kaynak URL'den görseli indir + kendi deponda barındır, public URL döndür.
export async function storeImageFromUrl(
  sourceUrl: string,
  slug: string
): Promise<{ url: string }> {
  let parsed: URL;
  try {
    parsed = new URL(sourceUrl);
  } catch {
    throw new Error("Geçersiz kaynak URL.");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("Yalnızca http/https kaynaklar desteklenir.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(parsed.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": BROWSER_UA,
        Accept: "image/avif,image/webp,image/png,image/jpeg,*/*;q=0.8",
      },
    });
  } catch {
    throw new Error("Kaynak görsele ulaşılamadı (zaman aşımı veya ağ hatası).");
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) throw new Error(`Kaynak görsel indirilemedi (HTTP ${res.status}).`);

  const contentType = res.headers.get("content-type");
  // content-type image olmalı (HTML hata sayfası vb. reddedilir).
  if (!contentType || !contentType.toLowerCase().startsWith("image/")) {
    throw new Error("Kaynak bir görsel değil (content-type image değil).");
  }
  // İndirmeden önce Content-Length ile erken boyut kontrolü (varsa).
  const len = Number(res.headers.get("content-length"));
  if (Number.isFinite(len) && len > MAX_BYTES) {
    throw new Error(`Görsel çok büyük (max ${Math.round(MAX_BYTES / 1024 / 1024)}MB).`);
  }

  const buf = await res.arrayBuffer();
  return storeImageBytes(buf, contentType, slug);
}

// Yüklenen dosyayı (multipart File) kendi deponda barındır, public URL döndür.
export async function storeImageFromFile(
  file: File,
  slug: string
): Promise<{ url: string }> {
  const contentType = file.type || null;
  if (!contentType || !contentType.toLowerCase().startsWith("image/")) {
    throw new Error("Yüklenen dosya bir görsel değil.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error(`Görsel çok büyük (max ${Math.round(MAX_BYTES / 1024 / 1024)}MB).`);
  }
  const buf = await file.arrayBuffer();
  return storeImageBytes(buf, contentType, slug);
}

// Route handler'ın dosyaları doğru klasörden okuyabilmesi için yol bilgisi.
export const UPLOADS_ROOT = UPLOAD_DIR;
