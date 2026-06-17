"use client";

import { useState } from "react";

interface PriceSource {
  source: string;
  price: number;
  inStock: boolean;
  shippingNote: string;
  url: string;
  stub: boolean;
}

interface Resp {
  catalogRange: string | null;
  sources: PriceSource[];
  stub: boolean;
  note: string;
  error?: string;
}

const formatTRY = (v: number) => "₺" + Math.round(v).toLocaleString("tr-TR");

export function FiyatKarsilastirClient({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Resp | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    if (!open && !data) {
      setLoading(true);
      setError(null);
      try {
        const r = await fetch(`/api/price-compare?productId=${encodeURIComponent(productId)}`);
        const d: Resp = await r.json();
        if (!r.ok) setError(d.error || "Fiyatlar yüklenemedi.");
        else setData(d);
      } catch {
        setError("Sunucuya ulaşılamadı.");
      } finally {
        setLoading(false);
      }
    }
    setOpen((o) => !o);
  };

  const best = data?.sources.find((s) => s.inStock) ?? data?.sources[0];

  return (
    <section className="mt-16 pt-10 border-t border-border-subtle">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-[28px]">price_check</span>
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">Fiyat & Stok Karşılaştır</h2>
            <p className="text-secondary text-body-sm mt-0.5">Bu aleti farklı kaynaklarda kıyaslayın.</p>
          </div>
        </div>
        <button
          onClick={load}
          className="bg-primary text-white py-2.5 px-5 rounded font-label-caps text-label-caps font-bold hover:bg-primary/95 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">{open ? "expand_less" : "compare"}</span>
          {open ? "GİZLE" : "FİYATLARI GETİR"}
        </button>
      </div>

      {open && (
        <div className="mt-4">
          {loading ? (
            <p className="text-secondary font-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              Fiyatlar getiriliyor…
            </p>
          ) : error ? (
            <p className="text-error font-body-sm">{error}</p>
          ) : data ? (
            <div className="space-y-4">
              {/* Stub uyarısı — şeffaflık */}
              <div className="bg-warning-amber/10 border border-warning-amber/20 rounded-xl p-3 flex items-start gap-2">
                <span className="material-symbols-outlined text-warning-amber text-[18px]">info</span>
                <p className="text-secondary text-[12px] leading-relaxed">
                  <strong>Temsilî veri:</strong> {data.note} Gerçek fiyat ve stok için entegrasyon yakında.
                </p>
              </div>

              <div className="overflow-x-auto border border-border-subtle rounded-xl bg-white">
                <table className="w-full text-left text-body-sm">
                  <thead>
                    <tr className="bg-surface-container-high border-b border-border-subtle">
                      <th className="p-3 font-label-caps text-[11px] text-secondary font-bold">KAYNAK</th>
                      <th className="p-3 font-label-caps text-[11px] text-secondary font-bold text-right">FİYAT</th>
                      <th className="p-3 font-label-caps text-[11px] text-secondary font-bold text-center">STOK</th>
                      <th className="p-3 font-label-caps text-[11px] text-secondary font-bold hidden md:table-cell">TESLİMAT</th>
                      <th className="p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.sources.map((s) => {
                      const isBest = best && s.source === best.source;
                      return (
                        <tr key={s.source} className="border-b border-border-subtle/50 last:border-0">
                          <td className="p-3 font-bold text-on-surface">
                            {s.source}
                            {isBest && (
                              <span className="ml-2 bg-success-vibrant/10 text-success-vibrant px-2 py-0.5 rounded-full text-[9px] font-bold">EN İYİ</span>
                            )}
                          </td>
                          <td className="p-3 text-right font-spec-data font-bold text-on-surface">{formatTRY(s.price)}</td>
                          <td className="p-3 text-center">
                            {s.inStock ? (
                              <span className="text-success-vibrant text-[11px] font-bold">Stokta</span>
                            ) : (
                              <span className="text-secondary text-[11px] font-bold">Tükendi</span>
                            )}
                          </td>
                          <td className="p-3 text-secondary text-[12px] hidden md:table-cell">{s.shippingNote}</td>
                          <td className="p-3 text-right">
                            <a
                              href={s.url}
                              target="_blank"
                              rel="nofollow noopener noreferrer"
                              className="text-primary font-bold text-[12px] hover:underline inline-flex items-center gap-1"
                            >
                              Git <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
