// Affiliate mağaza allowlist'i — açık yönlendirme (open redirect) saldırısını önler.
// Sadece bu host'lara (veya alt alan adlarına) yönlendirmeye izin verilir.

const ALLOWED_HOSTS = [
  "hepsiburada.com",
  "trendyol.com",
  "koctas.com.tr",
  "amazon.com.tr",
  "amazon.com",
  "n11.com",
  "cimri.com",
  "akakce.com",
  // Demo/stub kaynak — gerçek entegrasyon gelene kadar sources.ts example.com kullanır.
  "example.com",
];

// Dışa yönlendiren mağaza linkini /git tıklama-takip route'una saran href üretir.
export function buildAffiliateHref(params: {
  url: string;
  retailer: string;
  productId?: string;
  slug?: string;
}): string {
  const qs = new URLSearchParams();
  qs.set("url", params.url);
  qs.set("retailer", params.retailer);
  if (params.productId) qs.set("pid", params.productId);
  if (params.slug) qs.set("slug", params.slug);
  return `/git?${qs.toString()}`;
}

export function isAllowedRetailerUrl(raw: string): URL | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.toLowerCase();
  const ok = ALLOWED_HOSTS.some(
    (allowed) => host === allowed || host.endsWith("." + allowed)
  );
  return ok ? url : null;
}
