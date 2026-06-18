/**
 * Affiliate-feed görsel/fiyat fallback adaptörü (STUB, ENV-GATED).
 *
 * Bir affiliate marketplace feed'inden (Trendyol / Hepsiburada / Koçtaş) EAN veya
 * marka+model ile görsel + fiyat çekmek için TEMİZ adaptör arayüzü.
 *
 * ⚠️ Bu bir STUB'tır: scraping YOK. Yalnızca kablolanmış adaptör + dürüst fallback.
 * `AFFILIATE_FEED_URL` (+ opsiyonel `AFFILIATE_FEED_KEY`) env tanımlı DEĞİLSE,
 * dürüst "bağlı değil" yanıtı döner — uydurma veri üretmez, çökmez.
 *
 * Görsel affiliate lisansı altında kullanılır; bu yüzden model bozulmaz (satış/sepet YOK,
 * yalnızca "nereden alınır" dışa yönlendirme için görsel/fiyat zenginleştirme).
 *
 * TODO(owner): Gerçek bağlantı için:
 *   - AFFILIATE_FEED_URL  → partner XML/JSON ürün feed uç noktası
 *   - AFFILIATE_FEED_KEY  → (opsiyonel) API anahtarı / partner token
 *   `parseFeedItem` içinde feed'in alan adlarını eşleştir.
 */

export interface AffiliateFeedItem {
  imageUrl?: string;
  /** TRY cinsinden güncel fiyat (varsa). */
  price?: number;
  /** Mağaza adı (Trendyol / Hepsiburada / Koçtaş ...). */
  retailer?: string;
  /** Affiliate ürün linki (dışa yönlendirme için). */
  url?: string;
}

export type AffiliateFeedLookup =
  | { kind: "gtin"; gtin: string }
  | { kind: "brand-model"; brand: string; model: string };

export type AffiliateFeedResponse =
  | { ok: true; item: AffiliateFeedItem }
  | { ok: false; reason: "not_configured" | "not_found" | "error"; message: string };

const FETCH_TIMEOUT_MS = 10_000;

export function isAffiliateFeedConfigured(): boolean {
  return Boolean(process.env.AFFILIATE_FEED_URL?.trim());
}

function notConnected(): AffiliateFeedResponse {
  return {
    ok: false,
    reason: "not_configured",
    message:
      "Affiliate feed bağlı değil — AFFILIATE_FEED_URL env'ini ayarla (opsiyonel AFFILIATE_FEED_KEY).",
  };
}

// Feed öğesini defansif normalize et. Feed şeması partnere göre değişir;
// yaygın alan adlarını tolere eder. (TODO owner: kendi feed alanlarını ekle.)
function parseFeedItem(raw: any): AffiliateFeedItem | null {
  if (!raw || typeof raw !== "object") return null;
  const imageUrl = raw.image ?? raw.imageUrl ?? raw.picture ?? raw.image_url;
  const priceRaw = raw.price ?? raw.salePrice ?? raw.amount;
  const price =
    typeof priceRaw === "number"
      ? priceRaw
      : typeof priceRaw === "string"
        ? Number(priceRaw.replace(/[^\d.]/g, "")) || undefined
        : undefined;
  const url = raw.url ?? raw.link ?? raw.productUrl;
  const retailer = raw.retailer ?? raw.merchant ?? raw.store;

  if (!imageUrl && !price && !url) return null;
  return {
    imageUrl: typeof imageUrl === "string" ? imageUrl : undefined,
    price,
    url: typeof url === "string" ? url : undefined,
    retailer: typeof retailer === "string" ? retailer : undefined,
  };
}

/**
 * Affiliate feed'inden görsel/fiyat çek. ENV yoksa dürüst not_configured döner.
 */
export async function fetchFromAffiliateFeed(
  lookup: AffiliateFeedLookup
): Promise<AffiliateFeedResponse> {
  const base = process.env.AFFILIATE_FEED_URL?.trim();
  if (!base) return notConnected();

  const key = process.env.AFFILIATE_FEED_KEY?.trim();
  const params = new URLSearchParams();
  if (lookup.kind === "gtin") params.set("gtin", lookup.gtin);
  else {
    params.set("brand", lookup.brand);
    params.set("model", lookup.model);
  }
  if (key) params.set("key", key);

  const url = `${base}${base.includes("?") ? "&" : "?"}${params.toString()}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: "application/json", ...(key ? { Authorization: `Bearer ${key}` } : {}) },
    });
    if (res.status === 404) {
      return { ok: false, reason: "not_found", message: "Feed'de eşleşme bulunamadı." };
    }
    if (!res.ok) {
      return { ok: false, reason: "error", message: `Feed yanıt hatası (HTTP ${res.status}).` };
    }
    const json = await res.json().catch(() => null);
    // Feed tek öğe ya da liste dönebilir; ilk eşleşeni al.
    const candidate = Array.isArray(json) ? json[0] : json?.item ?? json?.data ?? json;
    const item = parseFeedItem(candidate);
    if (!item) return { ok: false, reason: "not_found", message: "Feed öğesi çözümlenemedi." };
    return { ok: true, item };
  } catch {
    return { ok: false, reason: "error", message: "Affiliate feed'e ulaşılamadı." };
  } finally {
    clearTimeout(timer);
  }
}
