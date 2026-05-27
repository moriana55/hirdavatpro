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
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-20">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
        Karşılaştırma<span className="text-orange-600">lar</span>
      </h1>
      <p className="mt-3 max-w-xl text-sm text-zinc-500">
        {comparisons.length} karşılaştırma, {products.length} ürün, {grouped.size} kategoride. Tarafsız, spec tabanlı, net sonuç.
      </p>

      {comparisons.length === 0 ? (
        <div className="mt-12 rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center">
          <p className="text-sm text-zinc-500">Henüz karşılaştırma eklenmemiş.</p>
          <Link href="/admin/toplu-uretim" className="mt-3 inline-block text-sm font-medium text-orange-600 hover:text-orange-500">
            Toplu üretici ile başla →
          </Link>
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          {sortedCategories.map(([cat, items]) => (
            <section key={cat} id={cat}>
              <div className="flex items-center gap-3 mb-4">
                <h2 className="font-heading text-lg font-semibold text-zinc-900">
                  {CATEGORY_LABELS[cat as ProductCategory] || cat}
                </h2>
                <span className="rounded border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-bold text-zinc-500">
                  {items.length}
                </span>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {items.map(c => {
                  const a = productMap.get(c.productA);
                  const b = productMap.get(c.productB);
                  if (!a || !b) return null;
                  return (
                    <Link
                      key={c.id}
                      href={`/karsilastirma/${c.slug}`}
                      className="group rounded-lg border border-zinc-200 bg-zinc-50 p-5 transition hover:border-zinc-300 hover:bg-zinc-100"
                    >
                      <div className="flex items-center gap-3 text-sm font-medium text-zinc-800">
                        <span>{a.brand} {a.model}</span>
                        <span className="text-orange-600 font-bold">vs</span>
                        <span>{b.brand} {b.model}</span>
                      </div>
                      {c.verdict && (
                        <p className="mt-2 text-xs text-zinc-500 line-clamp-2">{c.verdict}</p>
                      )}
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600/80 group-hover:text-orange-500 transition">
                          Detaylı karşılaştırma →
                        </span>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                          {a.priceRange && <span>{a.priceRange}</span>}
                          {a.priceRange && b.priceRange && <span>vs</span>}
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

      {/* Category quick nav */}
      {sortedCategories.length > 3 && (
        <nav className="mt-16 pt-8 border-t border-zinc-200">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3">Kategoriler</h3>
          <div className="flex flex-wrap gap-2">
            {sortedCategories.map(([cat, items]) => (
              <a key={cat} href={`#${cat}`}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-orange-300 hover:text-orange-600">
                {CATEGORY_LABELS[cat as ProductCategory] || cat} ({items.length})
              </a>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
