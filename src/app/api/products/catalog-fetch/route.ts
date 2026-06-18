import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { safeJson, reqString, badRequest } from "@/lib/validation";
import {
  fetchFromIcecat,
  isIcecatConfigured,
  type IcecatLookup,
  type IcecatResult,
} from "@/lib/catalog/icecat";
import {
  fetchFromAffiliateFeed,
  isAffiliateFeedConfigured,
} from "@/lib/catalog/affiliate-feed";
import {
  getProductById,
  getProductsWithoutImage,
  mergeCatalogData,
} from "@/lib/products/store";

export const dynamic = "force-dynamic";

// Resmî katalog (Icecat) + affiliate-feed fallback görsel/spec çekme — admin-only.
//
// Modlar (body.mode):
//   "preview"  → EAN veya marka+model ile çek, önizle (DB'ye yazma).
//   "save"     → çek + verilen productId'ye işle (mergeCatalogData; ezme yok).
//   "bulk"     → görseli olmayan ürünler için EAN/marka+model ile otomatik dene, rapor.
//
// Affiliate feed yalnızca görsel için fallback olarak kullanılır (Icecat bulamazsa).

type Lookup =
  | { ean?: string; brand?: string; model?: string };

function buildIcecatLookup(l: Lookup): IcecatLookup | null {
  if (l.ean && l.ean.trim()) return { kind: "gtin", gtin: l.ean.trim() };
  if (l.brand && l.brand.trim() && l.model && l.model.trim()) {
    return { kind: "brand-mpn", brand: l.brand.trim(), mpn: l.model.trim() };
  }
  return null;
}

// Tek bir ürün için Icecat → (yoksa) affiliate-feed görsel fallback.
async function lookupOne(l: Lookup): Promise<
  | { ok: true; source: "icecat" | "affiliate"; result: IcecatResult }
  | { ok: false; reason: string; message: string; configured: { icecat: boolean; affiliate: boolean } }
> {
  const icecatLookup = buildIcecatLookup(l);
  const configured = { icecat: isIcecatConfigured(), affiliate: isAffiliateFeedConfigured() };

  if (!icecatLookup) {
    return {
      ok: false,
      reason: "invalid",
      message: "EAN ya da marka+model gerekli.",
      configured,
    };
  }

  const ice = await fetchFromIcecat(icecatLookup);
  if (ice.ok) return { ok: true, source: "icecat", result: ice.result };

  // Icecat bulamadıysa / yapılandırılmadıysa görsel için affiliate-feed dene.
  const feedLookup =
    icecatLookup.kind === "gtin"
      ? ({ kind: "gtin", gtin: icecatLookup.gtin } as const)
      : ({ kind: "brand-model", brand: icecatLookup.brand, model: icecatLookup.mpn } as const);
  const feed = await fetchFromAffiliateFeed(feedLookup);
  if (feed.ok && feed.item.imageUrl) {
    return {
      ok: true,
      source: "affiliate",
      result: {
        title: "",
        brand: l.brand ?? "",
        imageUrl: feed.item.imageUrl,
        gallery: [],
        specs: {},
        sourceUrl: feed.item.url,
      },
    };
  }

  // İkisi de yoksa Icecat'in (daha açıklayıcı) mesajını döndür.
  return { ok: false, reason: ice.reason, message: ice.message, configured };
}

export async function POST(req: NextRequest) {
  if (!(await isAuthorized(req))) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 401 });
  }

  const ip = getClientIp(req);
  // Harici katalog çağrısı — IP başına 60/saat.
  const limit = rateLimit(`catalog-fetch:${ip}`, 60, 60 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Katalog çekme limiti aşıldı." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const body = await safeJson<Record<string, unknown>>(req);
  if (!body) return badRequest("Geçersiz istek.");

  const mode = typeof body.mode === "string" ? body.mode : "preview";

  // ── BULK ──
  if (mode === "bulk") {
    if (!isIcecatConfigured() && !isAffiliateFeedConfigured()) {
      return NextResponse.json({
        success: false,
        configured: { icecat: false, affiliate: false },
        message:
          "Icecat kullanıcı adı tanımlı değil — ücretsiz hesap aç (ICECAT_USERNAME). Affiliate feed de bağlı değil.",
      });
    }
    const candidates = await getProductsWithoutImage();
    const cap = Math.min(candidates.length, 50); // güvenlik: tek seferde en fazla 50.
    const matched: { id: string; label: string; source: string }[] = [];
    const unmatched: { id: string; label: string; reason: string }[] = [];

    for (let i = 0; i < cap; i++) {
      const p = candidates[i];
      const found = await lookupOne({ ean: p.ean, brand: p.brand, model: p.mpn || p.model });
      const label = `${p.brand} ${p.model}`;
      if (found.ok) {
        try {
          await mergeCatalogData(p.id, {
            imageUrl: found.result.imageUrl,
            gallery: found.result.gallery,
            specs: found.result.specs,
            sourceUrl: found.result.sourceUrl,
          });
          matched.push({ id: p.id, label, source: found.source });
        } catch {
          unmatched.push({ id: p.id, label, reason: "kaydedilemedi" });
        }
      } else {
        unmatched.push({ id: p.id, label, reason: found.message });
      }
    }

    return NextResponse.json({
      success: true,
      mode: "bulk",
      scanned: cap,
      totalMissing: candidates.length,
      matched,
      unmatched,
    });
  }

  // ── PREVIEW / SAVE ──
  const ean = reqString(body.ean, "ean", 20, { required: false });
  const brand = reqString(body.brand, "brand", 100, { required: false });
  const model = reqString(body.model, "model", 100, { required: false });
  if (!ean.ok) return badRequest(ean.error);
  if (!brand.ok) return badRequest(brand.error);
  if (!model.ok) return badRequest(model.error);

  const lookup: Lookup = {
    ean: ean.value || undefined,
    brand: brand.value || undefined,
    model: model.value || undefined,
  };

  if (!buildIcecatLookup(lookup)) {
    return badRequest("EAN ya da marka+model gerekli.");
  }

  const found = await lookupOne(lookup);

  if (!found.ok) {
    return NextResponse.json({
      success: false,
      reason: found.reason,
      configured: found.configured,
      message: found.message,
    });
  }

  // SAVE: önceden çekilmiş veriyi ürüne işle.
  if (mode === "save") {
    const productId = typeof body.productId === "string" ? body.productId : "";
    if (!productId) return badRequest("productId gerekli.");
    const existing = await getProductById(productId);
    if (!existing) return badRequest("Ürün bulunamadı.");
    try {
      const updated = await mergeCatalogData(productId, {
        imageUrl: found.result.imageUrl,
        gallery: found.result.gallery,
        specs: found.result.specs,
        ean: lookup.ean,
        sourceUrl: found.result.sourceUrl,
      });
      return NextResponse.json({ success: true, mode: "save", source: found.source, product: updated });
    } catch (e) {
      console.error("catalog-fetch save error:", e);
      return NextResponse.json({ error: "Ürüne kaydedilemedi." }, { status: 502 });
    }
  }

  // PREVIEW.
  return NextResponse.json({
    success: true,
    mode: "preview",
    source: found.source,
    result: found.result,
  });
}
