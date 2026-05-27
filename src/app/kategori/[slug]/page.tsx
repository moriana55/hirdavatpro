import { getProducts, getComparisons, productSlug } from "@/lib/products/store";
import { CATEGORY_LABELS, CATEGORY_GROUPS } from "@/lib/products/types";
import type { ProductCategory } from "@/lib/products/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function isValidCategory(slug: string): slug is ProductCategory {
  return slug in CATEGORY_LABELS;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isValidCategory(slug)) return {};
  const label = CATEGORY_LABELS[slug];
  const title = `${label} Karşılaştırma & İnceleme — En İyi ${label} 2026`;
  const desc = `${label} kategorisindeki tüm ürünler ve karşılaştırmalar. Teknik spec bazlı, tarafsız karşılaştırmalarla doğru ${label.toLowerCase()} seçimi yapın.`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc },
    alternates: { canonical: `https://hirdavatpro.com/kategori/${slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  if (!isValidCategory(slug)) notFound();

  const label = CATEGORY_LABELS[slug];
  const groupLabel = CATEGORY_GROUPS.find(g => g.categories.includes(slug))?.label || "";

  const allProducts = await getProducts();
  const products = allProducts.filter(p => p.category === slug);
  const productMap = new Map(allProducts.map(p => [p.id, p]));
  const allComparisons = await getComparisons();
  const comparisons = allComparisons.filter(c => {
    const a = productMap.get(c.productA);
    return a?.category === slug;
  });

  const siblingCats = CATEGORY_GROUPS
    .find(g => g.categories.includes(slug))
    ?.categories.filter(c => c !== slug && allProducts.some(p => p.category === c)) || [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-20">
      {/* Breadcrumb + Schema */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-orange-600 transition">Ana Sayfa</Link>
        <span>/</span>
        {groupLabel && (
          <>
            <span className="text-zinc-500">{groupLabel}</span>
            <span>/</span>
          </>
        )}
        <span className="text-zinc-600">{label}</span>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://hirdavatpro.com" },
              ...(groupLabel ? [{ "@type": "ListItem", position: 2, name: groupLabel }] : []),
              { "@type": "ListItem", position: groupLabel ? 3 : 2, name: label, item: `https://hirdavatpro.com/kategori/${slug}` },
            ],
          }),
        }}
      />

      <div className="flex items-center gap-3 mb-2">
        <span className="rounded border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600">
          {groupLabel || "Kategori"}
        </span>
      </div>
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
        {label}
      </h1>
      <p className="mt-3 text-sm text-zinc-500">
        {products.length} ürün, {comparisons.length} karşılaştırma
      </p>

      {/* Products */}
      {products.length > 0 && (
        <div className="mt-10">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-4">
            Ürünler ({products.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {products.map(p => (
              <Link
                key={p.id}
                href={`/urun/${productSlug(p)}`}
                className="group rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition hover:border-zinc-300 hover:bg-zinc-100"
              >
                <p className="text-sm font-medium text-zinc-800 group-hover:text-orange-600 transition">
                  {p.brand} {p.model}
                </p>
                {p.priceRange && (
                  <p className="mt-1 text-xs font-semibold text-orange-600">{p.priceRange}</p>
                )}
                {Object.entries(p.specs).length > 0 && (
                  <p className="mt-1.5 text-[11px] text-zinc-400 line-clamp-1">
                    {Object.entries(p.specs).slice(0, 3).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                  </p>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Comparisons */}
      {comparisons.length > 0 && (
        <div className="mt-12">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-4">
            Karşılaştırmalar ({comparisons.length})
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {comparisons.map(c => {
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
                  <span className="mt-3 block text-[11px] font-bold uppercase tracking-wider text-orange-600/80 group-hover:text-orange-500 transition">
                    Detaylı karşılaştırma →
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {products.length === 0 && comparisons.length === 0 && (
        <div className="mt-12 rounded-lg border border-zinc-200 bg-zinc-50 p-8 text-center">
          <p className="text-sm text-zinc-500">Bu kategoride henüz ürün eklenmemiş.</p>
        </div>
      )}

      {/* Sibling categories */}
      {siblingCats.length > 0 && (
        <div className="mt-16 pt-10 border-t border-zinc-200">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-4">
            {groupLabel} — Diğer Kategoriler
          </h2>
          <div className="flex flex-wrap gap-2">
            {siblingCats.map(cat => (
              <Link
                key={cat}
                href={`/kategori/${cat}`}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-orange-300 hover:text-orange-600"
              >
                {CATEGORY_LABELS[cat as ProductCategory]}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* SEO text */}
      <div className="mt-16 pt-10 border-t border-zinc-200">
        <h2 className="font-heading text-lg font-semibold text-zinc-900 mb-3">
          {label} Nasıl Seçilir?
        </h2>
        <p className="text-sm leading-relaxed text-zinc-500 max-w-3xl">
          {label} kategorisinde doğru ürün seçimi yapmak için güç, devir, kapasite ve marka güvenilirliği gibi
          teknik özellikleri karşılaştırmalı olarak incelemeniz önemlidir. Hırdavat Pro olarak tüm ürünlerin spec
          verilerini yan yana sunuyor, tarafsız karşılaştırmalarla karar sürecinizi kolaylaştırıyoruz.
        </p>
      </div>
    </div>
  );
}
