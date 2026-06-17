import type { Metadata } from "next";
import Link from "next/link";
import { getCraftsmen, TRADES, CITIES, TRADE_LABELS, type Craftsman } from "@/lib/craftsman/store";
import { UstaBasvuruClient } from "@/components/usta-bul/UstaBasvuruClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Usta Bul — Doğrulanmış Tadilat & Tamirat Ustaları",
  description:
    "Şehrinize ve ihtiyacınıza göre doğrulanmış elektrikçi, tesisatçı, boyacı, fayans ustası ve daha fazlasını bulun. Usta mısınız? Hemen başvurun, profilinizi oluşturun.",
  alternates: { canonical: "https://hirdavatpro.com/usta-bul" },
};

type Props = { searchParams: Promise<{ city?: string; trade?: string }> };

function StarRow({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="material-symbols-outlined text-warning-amber text-[16px]"
          style={{ fontVariationSettings: i <= full ? "'FILL' 1" : "'FILL' 0" }}
        >
          star
        </span>
      ))}
      <span className="ml-1 text-[12px] text-secondary font-bold">{rating.toFixed(1)}</span>
    </div>
  );
}

function CraftsmanCard({ c }: { c: Craftsman }) {
  return (
    <div className="bg-white border border-border-subtle rounded-xl p-5 shadow-sm flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-title-md text-title-md font-bold flex items-center gap-1.5">
            {c.name}
            {c.verified && (
              <span className="material-symbols-outlined text-tertiary text-[18px]" title="Doğrulanmış usta" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified
              </span>
            )}
          </h3>
          <p className="text-secondary text-body-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px]">location_on</span>{c.city}
          </p>
        </div>
        <StarRow rating={c.rating} />
      </div>
      <div className="flex flex-wrap gap-1.5 my-3">
        {c.trades.map((t) => (
          <span key={t} className="bg-surface-container px-2.5 py-1 rounded-full text-[11px] font-medium text-secondary">
            {TRADE_LABELS[t] || t}
          </span>
        ))}
      </div>
      {c.about && <p className="text-secondary text-body-sm leading-relaxed line-clamp-2 mb-3">{c.about}</p>}
      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border-subtle">
        <span className="text-[12px] text-secondary font-bold">{c.jobsDone} tamamlanan iş</span>
        <a
          href={`tel:${c.phone.replace(/\s/g, "")}`}
          className="bg-primary text-white px-4 py-2 rounded font-label-caps text-[11px] font-bold hover:bg-primary/90 transition-colors decoration-none flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">call</span>ARA
        </a>
      </div>
    </div>
  );
}

export default async function UstaBulPage({ searchParams }: Props) {
  const { city, trade } = await searchParams;

  let craftsmen: Craftsman[] = [];
  let dbError = false;
  try {
    craftsmen = await getCraftsmen({ city, trade });
  } catch (e) {
    console.error("usta-bul load error:", e);
    dbError = true;
  }

  const buildHref = (next: { city?: string; trade?: string }) => {
    const p = new URLSearchParams();
    const c = next.city ?? city;
    const t = next.trade ?? trade;
    if (c) p.set("city", c);
    if (t) p.set("trade", t);
    const qs = p.toString();
    return `/usta-bul${qs ? `?${qs}` : ""}`;
  };

  return (
    <div className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-[13px] text-secondary font-body-sm">
        <Link href="/" className="hover:text-primary transition-colors decoration-none font-bold">Ana Sayfa</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Usta Bul</span>
      </nav>

      <header className="mb-8 max-w-3xl">
        <h1 className="font-headline-lg text-headline-lg md:text-display-lg font-bold mb-3">Usta Bul</h1>
        <p className="text-secondary font-body-lg leading-relaxed">
          Şehrinize ve işinize uygun doğrulanmış ustaları keşfedin. Doğru aleti seçtikten sonra,
          işi yapacak doğru ustayı da burada bulun.
        </p>
      </header>

      {/* Filters */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-5 mb-8 shadow-sm">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="font-label-caps text-[11px] text-secondary font-bold uppercase mb-2">Şehir</p>
            <div className="flex flex-wrap gap-2">
              <Link href={buildHref({ city: "" })} className={`px-3 py-1.5 rounded-full text-[12px] font-bold decoration-none transition-colors ${!city ? "bg-primary text-white" : "bg-surface-container text-secondary hover:text-primary"}`}>Tümü</Link>
              {CITIES.map((cc) => (
                <Link key={cc} href={buildHref({ city: cc })} className={`px-3 py-1.5 rounded-full text-[12px] font-bold decoration-none transition-colors ${city === cc ? "bg-primary text-white" : "bg-surface-container text-secondary hover:text-primary"}`}>{cc}</Link>
              ))}
            </div>
          </div>
          <div>
            <p className="font-label-caps text-[11px] text-secondary font-bold uppercase mb-2">Meslek</p>
            <div className="flex flex-wrap gap-2">
              <Link href={buildHref({ trade: "" })} className={`px-3 py-1.5 rounded-full text-[12px] font-bold decoration-none transition-colors ${!trade ? "bg-primary text-white" : "bg-surface-container text-secondary hover:text-primary"}`}>Tümü</Link>
              {TRADES.map((t) => (
                <Link key={t.key} href={buildHref({ trade: t.key })} className={`px-3 py-1.5 rounded-full text-[12px] font-bold decoration-none transition-colors ${trade === t.key ? "bg-primary text-white" : "bg-surface-container text-secondary hover:text-primary"}`}>{t.label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Listing */}
      {dbError ? (
        <div className="bg-warning-amber/10 border border-warning-amber/30 rounded-xl p-6 text-center mb-8">
          <p className="text-secondary font-body-md">Usta listesi şu an yüklenemedi. Veritabanı henüz hazır olmayabilir (migration gerekli).</p>
        </div>
      ) : craftsmen.length === 0 ? (
        <div className="bg-surface-container-low border border-border-subtle rounded-xl p-10 text-center mb-8">
          <span className="material-symbols-outlined text-[48px] text-secondary mb-3">person_search</span>
          <p className="text-secondary font-body-md">Bu kriterlere uygun doğrulanmış usta bulunamadı. Filtreleri değiştirin veya aşağıdan başvuru yapın.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {craftsmen.map((c) => <CraftsmanCard key={c.id} c={c} />)}
        </div>
      )}

      {/* Apply CTA + form */}
      <UstaBasvuruClient />
    </div>
  );
}
