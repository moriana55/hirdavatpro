import Link from "next/link";
import { prisma } from "@/lib/db";
import { getAffiliateStats } from "@/lib/affiliate/store";

export const dynamic = "force-dynamic";

// Günlük tıklama serisi (son 14 gün) — recent kayıtlardan istemci kütüphanesi olmadan
// CSS bar grafiği için.
function clicksByDay(recent: { createdAt: Date }[], days = 14) {
  const buckets = new Map<string, number>();
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const r of recent) {
    const key = new Date(r.createdAt).toISOString().slice(0, 10);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

async function safeCount(fn: () => Promise<number>): Promise<number | null> {
  try {
    return await fn();
  } catch {
    return null;
  }
}

export default async function AdminAnalyticsPage() {
  // Affiliate istatistikleri — DB erişilemezse boş değerlerle düş.
  let stats: Awaited<ReturnType<typeof getAffiliateStats>>;
  try {
    stats = await getAffiliateStats();
  } catch {
    stats = { total: 0, byRetailer: [], byProduct: [], recent: [] };
  }

  // Mevcut sinyaller: B2B teklif sayısı + kayıtlı projeler (kaydedilen karşılaştırmalar) + lead'ler.
  const [b2bCount, projectCount, leadCount] = await Promise.all([
    safeCount(() => prisma.b2BQuote.count()),
    safeCount(() => prisma.project.count()),
    safeCount(() => prisma.lead.count()),
  ]);

  const series = clicksByDay(stats.recent);
  const maxDay = Math.max(1, ...series.map((s) => s.count));
  const maxRetailer = Math.max(1, ...stats.byRetailer.map((r) => r.count));
  const maxProduct = Math.max(1, ...stats.byProduct.map((p) => p.count));

  return (
    <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-5xl mx-auto">
      <header className="mb-12 border-b border-border-subtle pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="font-label-caps text-[11px] font-bold text-primary tracking-wider bg-primary/10 px-2 py-0.5 rounded">
            ANALİTİK
          </span>
          <h1 className="font-headline-lg text-headline-lg font-bold mt-2">Affiliate & Lead Analitiği</h1>
          <p className="text-secondary text-body-md mt-1">
            &quot;Nereden alınır&quot; çıkış tıklamaları, mağaza kırılımı ve lead-gen sinyalleri.
          </p>
        </div>
        <Link
          href="/x9k4-sys"
          className="text-xs bg-slate-gray text-white px-4 py-2 font-bold rounded font-label-caps text-label-caps hover:bg-primary transition-all decoration-none flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          PANELE DÖN
        </Link>
      </header>

      {/* Üst metrikler */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-gutter mb-12">
        <Stat icon="ads_click" label="Toplam Çıkış Tıklaması" value={stats.total} />
        <Stat icon="request_quote" label="B2B Teklif Talepleri" value={b2bCount} />
        <Stat icon="bookmark" label="Kayıtlı Projeler" value={projectCount} />
        <Stat icon="mail" label="Toplanan Lead" value={leadCount} />
      </section>

      {/* Mağaza kırılımı */}
      <section className="mb-12">
        <h2 className="font-title-lg text-title-lg font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">storefront</span>
          Mağazaya Göre Tıklamalar
        </h2>
        {stats.byRetailer.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-3 bg-surface-container-low border border-border-subtle rounded-2xl p-6">
            {stats.byRetailer.map((r) => (
              <div key={r.retailer} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-body-sm font-bold text-on-surface truncate">{r.retailer}</span>
                <div className="flex-1 bg-surface-container-high rounded-full h-5 overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${Math.round((r.count / maxRetailer) * 100)}%` }}
                  />
                </div>
                <span className="w-12 text-right font-spec-data font-bold text-on-surface">{r.count}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Günlük seri */}
      <section className="mb-12">
        <h2 className="font-title-lg text-title-lg font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">timeline</span>
          Son 14 Gün (çıkış tıklamaları)
        </h2>
        <div className="bg-surface-container-low border border-border-subtle rounded-2xl p-6">
          <div className="flex items-end gap-1.5 h-40">
            {series.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center justify-end gap-1 group" title={`${d.date}: ${d.count}`}>
                <span className="text-[10px] font-bold text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.count}
                </span>
                <div
                  className="w-full bg-primary/80 rounded-t min-h-[2px]"
                  style={{ height: `${Math.round((d.count / maxDay) * 100)}%` }}
                />
                <span className="text-[9px] text-secondary">{d.date.slice(8, 10)}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-secondary mt-3">
            En çok günlük: {maxDay} tıklama. (Seri son ~200 kayıttan türetilir.)
          </p>
        </div>
      </section>

      {/* En çok tıklanan ürünler */}
      <section className="mb-12">
        <h2 className="font-title-lg text-title-lg font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">trending_up</span>
          En Çok Tıklanan Ürünler
        </h2>
        {stats.byProduct.length === 0 ? (
          <Empty />
        ) : (
          <div className="overflow-x-auto border border-border-subtle rounded-2xl bg-white">
            <table className="w-full text-left text-body-sm">
              <thead>
                <tr className="bg-surface-container-high border-b border-border-subtle">
                  <th className="p-3 font-label-caps text-[11px] text-secondary font-bold">ÜRÜN (SLUG)</th>
                  <th className="p-3 font-label-caps text-[11px] text-secondary font-bold w-1/2">TIKLAMA</th>
                  <th className="p-3 font-label-caps text-[11px] text-secondary font-bold text-right">ADET</th>
                </tr>
              </thead>
              <tbody>
                {stats.byProduct.map((p) => (
                  <tr key={p.slug} className="border-b border-border-subtle/50 last:border-0">
                    <td className="p-3 font-bold text-on-surface">
                      <Link href={`/urun/${p.slug}`} className="text-primary hover:underline">
                        {p.slug}
                      </Link>
                    </td>
                    <td className="p-3">
                      <div className="bg-surface-container-high rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${Math.round((p.count / maxProduct) * 100)}%` }}
                        />
                      </div>
                    </td>
                    <td className="p-3 text-right font-spec-data font-bold text-on-surface">{p.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: string; label: string; value: number | null }) {
  return (
    <div className="bg-surface-container-low border border-border-subtle p-6 rounded-2xl">
      <span className="material-symbols-outlined text-primary text-[28px] mb-2">{icon}</span>
      <p className="font-label-caps text-[10px] text-slate-gray font-bold uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-bold mt-1 text-on-surface">{value ?? "—"}</p>
    </div>
  );
}

function Empty() {
  return (
    <div className="bg-surface-container-low border border-dashed border-border-subtle rounded-2xl p-8 text-center text-secondary text-body-sm">
      Henüz veri yok. Kullanıcılar &quot;nereden alınır&quot; linklerine tıkladıkça burada görünecek.
    </div>
  );
}
