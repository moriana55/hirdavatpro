import { NextRequest, NextResponse } from "next/server";
import { recordAffiliateClick } from "@/lib/affiliate/store";
import { isAllowedRetailerUrl } from "@/lib/affiliate/retailers";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

/**
 * GET /git?url=<retailer>&retailer=<ad>&pid=<id>&slug=<slug>
 *
 * "Nereden alınır" dışa yönlendiren mağaza linkleri bu route'tan geçer:
 *   1) Tıklamayı best-effort kaydeder (AffiliateClick).
 *   2) Allowlist'teki gerçek mağaza URL'ine 302 yönlendirir.
 *
 * Güvenlik:
 *   - Açık yönlendirme koruması: hedef URL allowlist host'larında olmalı.
 *   - Public rate limit (mevcut limiter).
 *   - Kayıt başarısız olsa bile yönlendirme bloklanmaz (fail-open redirect).
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const target = url.searchParams.get("url");

  if (!target) {
    return NextResponse.json({ error: "url parametresi gerekli." }, { status: 400 });
  }

  // Open redirect koruması — sadece izin verilen mağaza host'larına gidilebilir.
  const validated = isAllowedRetailerUrl(target);
  if (!validated) {
    return NextResponse.json({ error: "Geçersiz veya izin verilmeyen hedef." }, { status: 400 });
  }

  // Public endpoint — hafif rate limit (kötüye kullanım / log spam'i sınırla).
  const ip = getClientIp(req);
  const limit = rateLimit(`affiliate-click:${ip}`, 120, 60 * 1000);
  // Limit aşılsa bile kullanıcıyı engellemeyiz; sadece kaydı atlarız.

  const retailer = (url.searchParams.get("retailer") || validated.hostname).slice(0, 80);
  const productId = url.searchParams.get("pid");
  const slug = url.searchParams.get("slug");

  // Referrer'dan yalnızca host'u sakla (PII minimizasyonu).
  let referrerHost: string | null = null;
  const ref = req.headers.get("referer");
  if (ref) {
    try {
      referrerHost = new URL(ref).host;
    } catch {
      referrerHost = null;
    }
  }

  if (limit.ok) {
    // Best-effort, await ediyoruz ama recordAffiliateClick zaten asla throw etmiyor.
    await recordAffiliateClick({
      productId,
      slug,
      retailer,
      targetUrl: validated.toString(),
      referrer: referrerHost,
    });
  }

  // 302 — geçici yönlendirme (mağaza URL'i değişebilir).
  return NextResponse.redirect(validated.toString(), 302);
}
