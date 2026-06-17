import { prisma } from "@/lib/db";

export interface AffiliateClickInput {
  productId?: string | null;
  slug?: string | null;
  retailer: string;
  targetUrl: string;
  referrer?: string | null;
}

// Tıklamayı best-effort kaydeder. Asla throw etmez — kayıt başarısız olsa bile
// kullanıcının yönlendirmesi bloklanmamalı. (Çağıran tarafta await zorunlu değil.)
export async function recordAffiliateClick(data: AffiliateClickInput): Promise<void> {
  try {
    await prisma.affiliateClick.create({
      data: {
        productId: data.productId ?? null,
        slug: data.slug ?? null,
        retailer: data.retailer.slice(0, 80),
        targetUrl: data.targetUrl.slice(0, 2048),
        referrer: data.referrer ? data.referrer.slice(0, 255) : null,
      },
    });
  } catch (err) {
    // Sessizce yut — analytics kaydı kritik yol değil.
    console.error("affiliate click kaydedilemedi:", err);
  }
}

// ── Admin analytics okuma yardımcıları ──

export async function getAffiliateStats() {
  // Tek sorguda gruplama yerine birkaç hafif aggregate; veri seti küçük.
  const [total, byRetailer, byProduct, recent] = await Promise.all([
    prisma.affiliateClick.count(),
    prisma.affiliateClick.groupBy({
      by: ["retailer"],
      _count: { _all: true },
      orderBy: { _count: { retailer: "desc" } },
    }),
    prisma.affiliateClick.groupBy({
      by: ["slug"],
      _count: { _all: true },
      orderBy: { _count: { slug: "desc" } },
      take: 10,
    }),
    prisma.affiliateClick.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { retailer: true, slug: true, createdAt: true },
    }),
  ]);

  return {
    total,
    byRetailer: byRetailer.map((r) => ({ retailer: r.retailer, count: r._count._all })),
    byProduct: byProduct
      .filter((p) => p.slug)
      .map((p) => ({ slug: p.slug as string, count: p._count._all })),
    recent,
  };
}
