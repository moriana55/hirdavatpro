/**
 * Icecat Open Catalog entegrasyonu (resmî ürün görseli + teknik özellik çekimi).
 *
 * Icecat Open Catalog ÜCRETSİZ ve üretici onaylı görsel + spec sağlar (icecat.biz).
 * Erişim için ücretsiz bir kullanıcı adı gerekir → `ICECAT_USERNAME` env'inden okunur.
 *
 * ENV-GATED: `ICECAT_USERNAME` tanımlı değilse tool çökmez, uydurmaz; dürüst bir
 * "kullanıcı adı tanımlı değil — ücretsiz hesap aç" mesajı döner.
 *
 * Eşleştirme:
 *   1) GTIN/EAN barkodu (en güvenilir) → `gtin` parametresi
 *   2) Marka + MPN/model               → `brand` + `productCode` parametreleri
 *
 * Veri kaynağı resmî olduğu için scraping YOK; yalnızca Icecat'in açık JSON uç noktası.
 * Yanıt defansif parse edilir (timeout, try/catch, eksikte null).
 */

// Icecat Open Catalog JSON uç noktası (canlı, dil parametreli).
const ICECAT_BASE = "https://live.icecat.biz/api";
const DEFAULT_LANG = "TR"; // Türkçe içerik; bulunmazsa Icecat İngilizce'ye düşer.
const FETCH_TIMEOUT_MS = 12_000;

export interface IcecatResult {
  title: string;
  brand: string;
  imageUrl?: string;
  gallery: string[];
  specs: Record<string, string>;
  /** Icecat ürün sayfası (kaynak / atıf linki). */
  sourceUrl?: string;
}

export type IcecatLookup =
  | { kind: "gtin"; gtin: string }
  | { kind: "brand-mpn"; brand: string; mpn: string };

export type IcecatResponse =
  | { ok: true; result: IcecatResult }
  | { ok: false; reason: "not_configured" | "not_found" | "error"; message: string };

// ── Basit bellek-içi cache (sunucu instance başına) ──
// Aynı EAN/MPN için tekrar tekrar Icecat'e gitmemek için kısa süreli cache.
type CacheEntry = { at: number; value: IcecatResponse };
const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6 saat
const CACHE_MAX = 500;

function cacheKey(lang: string, lookup: IcecatLookup): string {
  return lookup.kind === "gtin"
    ? `gtin:${lang}:${lookup.gtin}`
    : `bm:${lang}:${lookup.brand.toLowerCase()}:${lookup.mpn.toLowerCase()}`;
}

function cacheGet(key: string): IcecatResponse | null {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() - e.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return e.value;
}

function cacheSet(key: string, value: IcecatResponse) {
  // not_found / başarılı sonuçları cache'le; geçici hataları cache'leme.
  if (value.ok === false && value.reason === "error") return;
  if (cache.size >= CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, { at: Date.now(), value });
}

// ── Yardımcılar ──

function notConfigured(): IcecatResponse {
  return {
    ok: false,
    reason: "not_configured",
    message:
      "Icecat kullanıcı adı tanımlı değil — icecat.biz'den ücretsiz hesap aç ve ICECAT_USERNAME env'ini ayarla.",
  };
}

async function fetchWithTimeout(url: string): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
      // Icecat verisi yavaş değişir; Next data cache'ine güven.
      next: { revalidate: 60 * 60 * 24 },
    });
    return res;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// Icecat JSON yanıtını defansif olarak normalize et.
function parseIcecat(json: any): IcecatResult | null {
  if (!json || typeof json !== "object") return null;
  const data = json.data ?? json.Data ?? json;
  if (!data || typeof data !== "object") return null;

  const general = data.GeneralInfo ?? data.generalInfo ?? {};
  const brand =
    general.Brand ??
    general.brand ??
    data.Supplier?.Name ??
    "";
  const title =
    general.Title ??
    general.ProductName ??
    general.title ??
    [brand, general.ProductCode].filter(Boolean).join(" ") ??
    "";

  // Görseller: ana resim + galeri.
  const gallery: string[] = [];
  let imageUrl: string | undefined;

  const image = data.Image ?? data.image;
  const pickUrl = (img: any): string | undefined => {
    if (!img || typeof img !== "object") return undefined;
    return (
      img.HighPic || img.highPic || img.Pic || img.pic || img.Pic500x500 || undefined
    );
  };
  imageUrl = pickUrl(image);

  const gallerySrc = data.Gallery ?? data.gallery ?? [];
  if (Array.isArray(gallerySrc)) {
    for (const g of gallerySrc) {
      const u = pickUrl(g) ?? g?.Pic ?? g?.pic;
      if (typeof u === "string" && u) gallery.push(u);
    }
  }
  if (imageUrl && !gallery.includes(imageUrl)) gallery.unshift(imageUrl);
  if (!imageUrl && gallery.length) imageUrl = gallery[0];

  // Teknik özellikler: FeaturesGroups → Features.
  const specs: Record<string, string> = {};
  const groups =
    data.FeaturesGroups ?? data.featuresGroups ?? data.SpecsGroups ?? [];
  if (Array.isArray(groups)) {
    for (const group of groups) {
      const features = group?.Features ?? group?.features ?? [];
      if (!Array.isArray(features)) continue;
      for (const f of features) {
        const name =
          f?.Feature?.Name?.Value ??
          f?.Feature?.Name?.value ??
          f?.Name ??
          f?.LocalName ??
          f?.name;
        const value =
          f?.PresentationValue ??
          f?.presentationValue ??
          f?.Value ??
          f?.value ??
          f?.RawValue;
        if (typeof name === "string" && name && value != null && String(value).trim()) {
          specs[name] = String(value).trim();
        }
      }
    }
  }

  // En az bir anlamlı veri yoksa null.
  if (!imageUrl && Object.keys(specs).length === 0) return null;

  return {
    title: String(title || "").trim(),
    brand: String(brand || "").trim(),
    imageUrl,
    gallery: Array.from(new Set(gallery)).filter(Boolean),
    specs,
    sourceUrl:
      general.ProductPage ?? data.ProductPage ?? general.productPage ?? undefined,
  };
}

function buildUrl(username: string, lang: string, lookup: IcecatLookup): string {
  const params = new URLSearchParams({
    UserName: username,
    Language: lang,
    Content: "All",
    app_key: username, // Icecat bazı uçlarda app_key bekler; UserName ile aynı ücretsiz anahtar.
  });
  if (lookup.kind === "gtin") {
    params.set("GTIN", lookup.gtin);
  } else {
    params.set("Brand", lookup.brand);
    params.set("ProductCode", lookup.mpn);
  }
  return `${ICECAT_BASE}?${params.toString()}`;
}

/**
 * Icecat Open Catalog'tan ürün görseli + spec çek.
 * @returns ENV yoksa not_configured; bulunamazsa not_found; başarıda result.
 */
export async function fetchFromIcecat(
  lookup: IcecatLookup,
  opts: { lang?: string } = {}
): Promise<IcecatResponse> {
  const username = process.env.ICECAT_USERNAME?.trim();
  if (!username) return notConfigured();

  // Girdi doğrulama (defansif).
  if (lookup.kind === "gtin") {
    const gtin = lookup.gtin.replace(/\s+/g, "");
    if (!/^\d{8,14}$/.test(gtin)) {
      return { ok: false, reason: "error", message: "Geçersiz EAN/GTIN (8-14 hane olmalı)." };
    }
    lookup = { kind: "gtin", gtin };
  } else {
    if (!lookup.brand.trim() || !lookup.mpn.trim()) {
      return { ok: false, reason: "error", message: "Marka ve model/MPN gerekli." };
    }
  }

  const lang = (opts.lang || DEFAULT_LANG).toUpperCase();
  const key = cacheKey(lang, lookup);
  const cached = cacheGet(key);
  if (cached) return cached;

  const url = buildUrl(username, lang, lookup);
  const res = await fetchWithTimeout(url);

  if (!res) {
    return { ok: false, reason: "error", message: "Icecat'e ulaşılamadı (zaman aşımı/ağ)." };
  }

  if (res.status === 404) {
    const r: IcecatResponse = {
      ok: false,
      reason: "not_found",
      message: "Bu ürün Icecat kataloğunda bulunamadı.",
    };
    cacheSet(key, r);
    return r;
  }

  if (!res.ok) {
    return {
      ok: false,
      reason: "error",
      message: `Icecat yanıt hatası (HTTP ${res.status}).`,
    };
  }

  let json: any;
  try {
    json = await res.json();
  } catch {
    return { ok: false, reason: "error", message: "Icecat yanıtı çözümlenemedi." };
  }

  // Icecat hata gövdesi: { Message / StatusCode } olabilir.
  if (json && (json.StatusCode === "0" || json.statusCode === 0) && json.Message) {
    const r: IcecatResponse = {
      ok: false,
      reason: "not_found",
      message: typeof json.Message === "string" ? json.Message : "Ürün bulunamadı.",
    };
    cacheSet(key, r);
    return r;
  }

  const result = parseIcecat(json);
  if (!result) {
    const r: IcecatResponse = {
      ok: false,
      reason: "not_found",
      message: "Icecat'te eşleşme bulundu ama görsel/spec çıkarılamadı.",
    };
    cacheSet(key, r);
    return r;
  }

  const ok: IcecatResponse = { ok: true, result };
  cacheSet(key, ok);
  return ok;
}

export function isIcecatConfigured(): boolean {
  return Boolean(process.env.ICECAT_USERNAME?.trim());
}
