import Link from "next/link";
import { ArrowRight, Wrench, BarChart3, Package, Zap } from "lucide-react";
import { getProducts, getComparisons } from "@/lib/products/store";
import { CATEGORY_LABELS, CATEGORY_GROUPS } from "@/lib/products/types";
import type { ProductCategory } from "@/lib/products/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  const comparisons = await getComparisons();

  const catCounts = new Map<string, number>();
  for (const p of products) catCounts.set(p.category, (catCounts.get(p.category) || 0) + 1);

  const productMap = new Map(products.map(p => [p.id, p]));
  const compCatCounts = new Map<string, number>();
  for (const c of comparisons) {
    const a = productMap.get(c.productA);
    if (a) compCatCounts.set(a.category, (compCatCounts.get(a.category) || 0) + 1);
  }

  const recentComparisons = [...comparisons].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, 8);

  const popularBrands = new Map<string, number>();
  for (const p of products) popularBrands.set(p.brand, (popularBrands.get(p.brand) || 0) + 1);
  const topBrands = [...popularBrands.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12);

  const activeGroups = CATEGORY_GROUPS
    .map(g => ({
      ...g,
      cats: g.categories.filter(c => catCounts.has(c)),
      total: g.categories.reduce((sum, c) => sum + (catCounts.get(c) || 0), 0),
      compTotal: g.categories.reduce((sum, c) => sum + (compCatCounts.get(c) || 0), 0),
    }))
    .filter(g => g.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600/90">
          Türkiye&apos;nin hırdavat karşılaştırma platformu
        </p>
        <h1 className="mt-4 max-w-3xl font-heading text-4xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
          Doğru alet, doğru{" "}
          <span className="text-orange-600/95">karar</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-zinc-500 md:text-base">
          Bosch mu Makita mı? DeWalt mı Milwaukee mı? Matkap, taşlama, testere, kaynak makinesi ve yüzlerce endüstriyel alet —
          teknik spec bazlı, tarafsız karşılaştırmalar.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/karsilastirma"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-orange-500"
          >
            <BarChart3 className="size-4" />
            Tüm Karşılaştırmalar
          </Link>
          <Link
            href="/araclar"
            className="inline-flex items-center rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-400 transition hover:border-zinc-500 hover:bg-zinc-100/50"
          >
            Seçim Araçları
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { icon: Package, label: "Ürün", value: products.length, color: "rgb(234,88,12)" },
            { icon: BarChart3, label: "Karşılaştırma", value: comparisons.length, color: "rgb(34,197,94)" },
            { icon: Wrench, label: "Marka", value: popularBrands.size, color: "rgb(99,102,241)" },
            { icon: Zap, label: "Kategori", value: catCounts.size, color: "rgb(161,161,170)" },
          ].map(s => (
            <div key={s.label} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
              <s.icon className="size-5 mb-1" style={{ color: s.color }} />
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Comparisons */}
      {recentComparisons.length > 0 && (
        <section className="border-t border-zinc-200 bg-white/40">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="font-heading text-xl font-semibold text-zinc-900 md:text-2xl">Son Karşılaştırmalar</h2>
                <p className="mt-1 text-sm text-zinc-500">En son eklenen karşılaştırmalar</p>
              </div>
              <Link href="/karsilastirma" className="text-sm font-medium text-orange-600/90 hover:text-orange-500">
                Tümünü gör →
              </Link>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {recentComparisons.map(c => {
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
                      <span className="text-[10px] text-zinc-400">
                        {CATEGORY_LABELS[a.category] || a.category}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="border-t border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <h2 className="font-heading text-xl font-semibold text-zinc-900 md:text-2xl">Kategoriler</h2>
          <p className="mt-1 text-sm text-zinc-500 mb-8">
            {activeGroups.length} ana grup, {catCounts.size} alt kategori
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeGroups.map(g => (
              <div key={g.label} className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-zinc-800">{g.label}</h3>
                  <span className="text-[10px] font-bold text-zinc-400">{g.total} ürün</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {g.cats.map(cat => {
                    const count = catCounts.get(cat) || 0;
                    return (
                      <Link
                        key={cat}
                        href={`/kategori/${cat}`}
                        className="rounded border border-zinc-200 bg-white px-2 py-1 text-[11px] font-medium text-zinc-500 hover:border-orange-300 hover:text-orange-600 transition"
                      >
                        {CATEGORY_LABELS[cat as ProductCategory]} ({count})
                      </Link>
                    );
                  })}
                </div>
                {g.compTotal > 0 && (
                  <p className="mt-3 text-[10px] font-bold text-orange-600/70">{g.compTotal} karşılaştırma</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Brands */}
      {topBrands.length > 0 && (
        <section className="border-t border-zinc-200 bg-white/40">
          <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
            <h2 className="font-heading text-xl font-semibold text-zinc-900 md:text-2xl">Popüler Markalar</h2>
            <p className="mt-1 text-sm text-zinc-500 mb-8">{popularBrands.size} markadan en çok ürünü olanlar</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {topBrands.map(([brand, count]) => (
                <div key={brand} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-center">
                  <p className="text-sm font-bold text-zinc-800">{brand}</p>
                  <p className="text-[10px] font-bold text-zinc-400 mt-1">{count} ürün</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tools */}
      <section className="border-t border-zinc-200">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-heading text-xl font-semibold text-zinc-900 md:text-2xl">Seçim Araçları</h2>
              <p className="mt-1 text-sm text-zinc-500">Malzeme ve işleme göre net öneriler</p>
            </div>
            <Link href="/araclar" className="text-sm font-medium text-orange-600/90 hover:text-orange-500">
              Tüm araçlar →
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              { href: "/araclar/matkap-ucu", title: "Matkap Ucu Seçimi", desc: "Malzeme, kullanım ve darbeli matkap durumuna göre uç ailesi önerisi." },
              { href: "/araclar/testere-secimi", title: "Testere & Bıçak Seçimi", desc: "Kesim malzemesi, amaç ve ortama göre doğru testere + bıçak kombinasyonu." },
            ].map(t => (
              <Link key={t.href} href={t.href}
                className="group rounded-lg border border-zinc-200 bg-zinc-50 p-5 transition hover:border-zinc-300 hover:bg-zinc-100">
                <h3 className="text-sm font-semibold text-zinc-800 group-hover:text-orange-600 transition">{t.title}</h3>
                <p className="mt-1 text-xs text-zinc-500">{t.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-orange-600/80 group-hover:text-orange-500 transition">
                  Aç <ArrowRight className="size-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO text */}
      <section className="border-t border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
          <h2 className="font-heading text-lg font-semibold text-zinc-900 mb-4">Hırdavat Pro Nedir?</h2>
          <div className="space-y-3 text-sm leading-relaxed text-zinc-500 max-w-3xl">
            <p>
              Hırdavat Pro, Türkiye&apos;nin en kapsamlı endüstriyel alet karşılaştırma platformudur. Matkap, avuç taşlama,
              daire testere, dekupaj, kaynak makinesi, kompresör, jeneratör, pompa ve daha yüzlerce kategoride teknik
              spec bazlı tarafsız karşılaştırmalar sunuyoruz.
            </p>
            <p>
              Bosch, Makita, DeWalt, Milwaukee, Metabo, Stihl, Husqvarna, Festool, Kärcher ve {popularBrands.size}+ markayı
              kapsayan veritabanımızda her ürünün teknik özelliklerini yan yana koyarak atölye ve şantiye kararlarınızı
              kolaylaştırıyoruz.
            </p>
            <p>
              Satış vaadi değil; hangi alet hangi işe uygun, hangisi fiyat/performans açısından mantıklı — bunu söylüyoruz.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
