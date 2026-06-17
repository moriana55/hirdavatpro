import Link from "next/link";
import { getQuotes, matchQuoteItems, parseQuoteItems, type ItemMatch } from "@/lib/b2b/store";
import { QuoteStatusSelect } from "./QuoteStatusSelect";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  new: "Yeni",
  quoted: "Teklif Verildi",
  won: "Kazanıldı",
  lost: "Kaybedildi",
};

const MATCH_BADGE: Record<string, { label: string; cls: string }> = {
  exact: { label: "Birebir", cls: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  fuzzy: { label: "Yakın eşleşme", cls: "bg-amber-100 text-amber-700 border-amber-300" },
  ambiguous: { label: "Belirsiz", cls: "bg-orange-100 text-orange-700 border-orange-300" },
  unmatched: { label: "Eşleşmedi", cls: "bg-red-100 text-red-700 border-red-300" },
};

export default async function AdminQuotesPage() {
  let quotes: Awaited<ReturnType<typeof getQuotes>> = [];
  let dbError = false;
  try {
    quotes = await getQuotes();
  } catch {
    dbError = true;
  }

  // Her teklif için satırları eşleştir (heuristik).
  const enriched = await Promise.all(
    quotes.map(async (q) => {
      const items = parseQuoteItems(q.items);
      let matches: ItemMatch[] = [];
      let summary = { total: items.length, matched: 0, ambiguous: 0, unmatched: items.length };
      try {
        const res = await matchQuoteItems(items);
        matches = res.matches;
        summary = res.summary;
      } catch {
        // Eşleştirme başarısız olsa bile teklif görüntülenmeli.
      }
      return { quote: q, matches, summary };
    })
  );

  return (
    <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-5xl mx-auto">
      <header className="mb-10 border-b border-border-subtle pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="font-label-caps text-[11px] font-bold text-primary tracking-wider bg-primary/10 px-2 py-0.5 rounded">
            B2B
          </span>
          <h1 className="font-headline-lg text-headline-lg font-bold mt-2">B2B Teklif Talepleri</h1>
          <p className="text-secondary text-body-md mt-1">
            Gelen teklif satırları otomatik olarak katalog ürünleriyle eşleştirilir. Eşleşmeyen veya belirsiz SKU&apos;lar işaretlenir.
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

      {dbError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Teklifler yüklenemedi (veritabanı erişilemiyor olabilir).
        </div>
      )}

      {!dbError && enriched.length === 0 && (
        <div className="bg-surface-container-low border border-dashed border-border-subtle rounded-2xl p-10 text-center text-secondary text-body-sm">
          Henüz B2B teklif talebi yok.
        </div>
      )}

      <div className="space-y-6">
        {enriched.map(({ quote, matches, summary }) => (
          <article key={quote.id} className="rounded-2xl border border-border-subtle bg-white overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border-subtle bg-surface-container-low p-5">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-title-lg text-title-lg font-bold text-on-surface">{quote.companyName}</h2>
                  <span className="text-[11px] text-secondary">
                    {new Date(quote.createdAt).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                </div>
                <p className="text-body-sm text-secondary mt-0.5">
                  {quote.contactName} · {quote.email} · {quote.phone}
                  {quote.taxNumber ? ` · VKN: ${quote.taxNumber}` : ""}
                </p>
                {quote.note && <p className="text-body-sm text-zinc-500 mt-1 italic">“{quote.note}”</p>}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <QuoteStatusSelect id={quote.id} initial={quote.status} />
                <span className="text-[10px] text-secondary uppercase tracking-wider font-bold">
                  Durum: {STATUS_LABELS[quote.status] ?? quote.status}
                </span>
              </div>
            </div>

            {/* Eşleştirme özeti */}
            <div className="flex flex-wrap gap-2 px-5 pt-4">
              <SummaryPill label="Toplam satır" value={summary.total} cls="bg-zinc-100 text-zinc-700 border-zinc-300" />
              <SummaryPill label="Eşleşti" value={summary.matched} cls="bg-emerald-100 text-emerald-700 border-emerald-300" />
              {summary.ambiguous > 0 && (
                <SummaryPill label="Belirsiz" value={summary.ambiguous} cls="bg-orange-100 text-orange-700 border-orange-300" />
              )}
              {summary.unmatched > 0 && (
                <SummaryPill label="Eşleşmedi" value={summary.unmatched} cls="bg-red-100 text-red-700 border-red-300" />
              )}
            </div>

            {/* Satır tablosu */}
            <div className="overflow-x-auto p-5">
              <table className="w-full text-left text-body-sm border-collapse">
                <thead>
                  <tr className="border-b border-border-subtle text-secondary">
                    <th className="py-2 pr-3 font-label-caps text-[11px] font-bold">TALEP EDİLEN</th>
                    <th className="py-2 px-3 font-label-caps text-[11px] font-bold">ADET</th>
                    <th className="py-2 px-3 font-label-caps text-[11px] font-bold">EŞLEŞME</th>
                    <th className="py-2 pl-3 font-label-caps text-[11px] font-bold">KATALOG ÜRÜNÜ</th>
                  </tr>
                </thead>
                <tbody>
                  {matches.map((m, i) => {
                    const badge = MATCH_BADGE[m.status];
                    return (
                      <tr key={i} className="border-b border-border-subtle/50 last:border-0 align-top">
                        <td className="py-3 pr-3 font-medium text-on-surface">
                          {[m.item.brand, m.item.model].filter(Boolean).join(" ") || m.item.query || "—"}
                          {m.item.query && (m.item.brand || m.item.model) && (
                            <span className="block text-[11px] text-zinc-400">girilen: {m.item.query}</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-spec-data font-bold text-on-surface">{m.item.qty}</td>
                        <td className="py-3 px-3">
                          <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border ${badge.cls}`}>
                            {badge.label}
                            {m.status !== "unmatched" && ` · %${Math.round(m.score * 100)}`}
                          </span>
                        </td>
                        <td className="py-3 pl-3">
                          {m.product ? (
                            <Link href={`/urun/${m.product.slug}`} className="text-primary font-bold hover:underline">
                              {m.product.brand} {m.product.model}
                            </Link>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                          {m.alternatives.length > 0 && (
                            <div className="mt-1 text-[11px] text-secondary">
                              Diğer adaylar:{" "}
                              {m.alternatives.map((a, j) => (
                                <span key={a.id}>
                                  <Link href={`/urun/${a.slug}`} className="hover:underline">
                                    {a.brand} {a.model} (%{Math.round(a.score * 100)})
                                  </Link>
                                  {j < m.alternatives.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}

function SummaryPill({ label, value, cls }: { label: string; value: number; cls: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cls}`}>
      {label}: <span className="font-spec-data">{value}</span>
    </span>
  );
}
