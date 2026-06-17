import Link from "next/link";
import { getComparisons, getProducts } from "@/lib/products/store";
import { CATEGORY_LABELS } from "@/lib/products/types";
import type { ProductCategory } from "@/lib/products/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hırdavat & Alet Karşılaştırmaları — Tüm Kategoriler",
  description: "Bosch vs Makita, DeWalt vs Milwaukee ve yüzlerce endüstriyel alet karşılaştırması. Matkap, taşlama, testere, kaynak makinesi, el aleti ve daha fazlası.",
  alternates: { canonical: "https://hirdavatpro.com/karsilastirma" },
};

export const dynamic = "force-dynamic";

export default async function ComparisonsListPage() {
  const comparisons = await getComparisons();
  const products = await getProducts();
  const productMap = new Map(products.map(p => [p.id, p]));

  const grouped = new Map<string, typeof comparisons>();
  for (const c of comparisons) {
    const a = productMap.get(c.productA);
    if (!a) continue;
    const cat = a.category;
    const list = grouped.get(cat) || [];
    list.push(c);
    grouped.set(cat, list);
  }

  const sortedCategories = [...grouped.entries()].sort((a, b) => b[1].length - a[1].length);

  return (
    <div className="bg-background min-h-screen pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
      {/* Header */}
      <header className="mb-12">
        <p className="font-label-caps text-label-caps text-slate-gray mb-1 font-bold">EDİTÖR ANALİZLERİ</p>
        <h1 className="font-headline-lg text-headline-lg md:text-display-lg font-bold text-on-surface">
          Teknik Karşılaştırmalar
        </h1>
        <p className="mt-3 text-secondary font-body-lg">
          <span className="font-spec-data text-spec-data font-bold text-primary">{comparisons.length}</span> teknik analiz,{" "}
          <span className="font-spec-data text-spec-data font-bold text-primary">{products.length}</span> endüstriyel alet,{" "}
          <span className="font-spec-data text-spec-data font-bold text-primary">{grouped.size}</span> farklı kategoride.
        </p>
      </header>

      {/* Comparisons List or Empty State */}
      {comparisons.length === 0 ? (
        <div className="mt-16 bg-white border border-border-subtle p-12 text-center rounded shadow-sm max-w-2xl mx-auto">
          <span className="material-symbols-outlined text-secondary text-5xl mb-4">compare_arrows</span>
          <p className="font-title-md text-title-md font-bold text-on-surface mb-2">Henüz karşılaştırma eklenmedi.</p>
          <p className="text-body-sm text-secondary leading-relaxed mb-6">
            İçerik hazırlanıyor. Seçim araçlarını kullanmaya başlayabilirsiniz.
          </p>
          <Link href="/araclar"
            className="bg-primary text-on-primary px-6 py-3 rounded font-label-caps text-label-caps hover:bg-primary-container transition-all decoration-none inline-flex items-center gap-2">
            Seçim Araçlarına Git
          </Link>
        </div>
      ) : (
        <div className="space-y-16">
          {sortedCategories.map(([cat, items]) => (
            <section key={cat} id={cat} className="scroll-mt-36">
              <div className="flex items-center gap-3 mb-6 border-b border-border-subtle pb-3">
                <Link
                  href={`/kategori/${cat}`}
                  className="font-heading text-2xl font-bold text-on-surface hover:text-primary transition-colors decoration-none"
                >
                  {CATEGORY_LABELS[cat as ProductCategory] || cat}
                </Link>
                <span className="bg-surface-container text-slate-gray px-2.5 py-0.5 font-label-caps text-xs rounded uppercase font-bold">
                  {items.length} Analiz
                </span>
              </div>
              <div className="grid gap-gutter grid-cols-1 md:grid-cols-2">
                {items.map(c => {
                  const a = productMap.get(c.productA);
                  const b = productMap.get(c.productB);
                  if (!a || !b) return null;
                  return (
                    <Link
                      key={c.id}
                      href={`/karsilastirma/${c.slug}`}
                      className="bg-white border border-border-subtle p-6 hover:border-primary hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full rounded decoration-none group"
                    >
                      <div>
                        <div className="flex items-center gap-2.5 text-[15px] font-semibold text-on-surface group-hover:text-primary transition-colors">
                          <span>{a.brand} {a.model}</span>
                          <span className="bg-compare-action/10 text-compare-action px-2 py-0.5 text-[9px] rounded font-bold">VS</span>
                          <span>{b.brand} {b.model}</span>
                        </div>
                        {c.verdict && (
                          <p className="mt-3 text-[13px] text-secondary leading-relaxed line-clamp-2">{c.verdict}</p>
                        )}
                      </div>
                      <div className="mt-6 flex items-center justify-between border-t border-surface-container-low pt-4">
                        <span className="text-[12px] font-semibold text-primary group-hover:text-accent-hover transition-colors font-bold">
                          Detaylı analizi oku →
                        </span>
                        <div className="flex items-center gap-2 font-spec-data text-[11px] text-secondary/60">
                          {a.priceRange && <span>{a.priceRange}</span>}
                          {a.priceRange && b.priceRange && <span className="text-border-subtle">vs</span>}
                          {b.priceRange && <span>{b.priceRange}</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Sibling Categories Shortcuts */}
      {sortedCategories.length > 3 && (
        <nav className="mt-16 pt-8 border-t border-border-subtle">
          <p className="font-label-caps text-label-caps text-slate-gray mb-4 font-bold">HIZLI KATEGORİ GEZİNTİSİ</p>
          <div className="flex flex-wrap gap-2">
            {sortedCategories.map(([cat, items]) => (
              <a
                key={cat}
                href={`#${cat}`}
                className="rounded border border-border-subtle bg-white px-3.5 py-2 text-[12px] font-medium text-secondary transition-all hover:border-primary hover:text-primary decoration-none font-bold"
              >
                {CATEGORY_LABELS[cat as ProductCategory] || cat} ({items.length})
              </a>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
