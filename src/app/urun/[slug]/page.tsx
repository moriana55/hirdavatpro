import { getProducts, getProductBySlug, productSlug, getComparisons, getProductById } from "@/lib/products/store";
import { CATEGORY_LABELS, CATEGORY_GROUPS } from "@/lib/products/types";
import type { ProductCategory } from "@/lib/products/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const title = `${product.brand} ${product.model} — Teknik Özellikler & Karşılaştırma`;
  const desc = `${product.brand} ${product.model} teknik özellikleri, fiyat aralığı ve rakipleriyle karşılaştırması. ${CATEGORY_LABELS[product.category] || product.category} kategorisinde detaylı inceleme.`;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc },
    alternates: { canonical: `https://hirdavatpro.com/urun/${slug}` },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const catLabel = CATEGORY_LABELS[product.category] || product.category;
  const groupLabel = CATEGORY_GROUPS.find(g => g.categories.includes(product.category))?.label || "";

  const allComparisons = await getComparisons();
  const comparisons = allComparisons.filter(
    c => c.productA === product.id || c.productB === product.id
  );
  const rivals: { comparison: { id: string; slug: string; verdict: string }; rival: { id: string; brand: string; model: string; priceRange?: string } }[] = [];
  for (const c of comparisons) {
    const otherId = c.productA === product.id ? c.productB : c.productA;
    const other = await getProductById(otherId);
    if (other) rivals.push({ comparison: c, rival: other });
  }

  const sameCategory = (await getProducts())
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 8);

  const specEntries = Object.entries(product.specs);

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-orange-600 transition">Ana Sayfa</Link>
        <span>/</span>
        <Link href={`/kategori/${product.category}`} className="hover:text-orange-600 transition">{catLabel}</Link>
        <span>/</span>
        <span className="text-zinc-600">{product.brand} {product.model}</span>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://hirdavatpro.com" },
              { "@type": "ListItem", position: 2, name: catLabel, item: `https://hirdavatpro.com/kategori/${product.category}` },
              { "@type": "ListItem", position: 3, name: `${product.brand} ${product.model}`, item: `https://hirdavatpro.com/urun/${slug}` },
            ],
          }),
        }}
      />

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="rounded border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600">
              {catLabel}
            </span>
            {groupLabel && (
              <span className="rounded border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {groupLabel}
              </span>
            )}
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
            {product.brand} <span className="text-orange-600">{product.model}</span>
          </h1>
          {product.priceRange && (
            <p className="mt-3 text-lg font-semibold text-orange-600">{product.priceRange}</p>
          )}
        </div>
      </div>

      {/* Specs */}
      {specEntries.length > 0 && (
        <div className="mt-10">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-4">Teknik Özellikler</h2>
          <div className="rounded-lg border border-zinc-200 overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {specEntries.map(([key, val], i) => (
                  <tr key={key} className={i % 2 === 0 ? "bg-zinc-50" : "bg-white"}>
                    <td className="py-3 px-4 text-xs font-medium text-zinc-500 w-1/3">{key}</td>
                    <td className="py-3 px-4 text-sm font-medium text-zinc-800">{String(val)}</td>
                  </tr>
                ))}
                {product.priceRange && (
                  <tr className={specEntries.length % 2 === 0 ? "bg-zinc-50" : "bg-white"}>
                    <td className="py-3 px-4 text-xs font-medium text-zinc-500 w-1/3">Fiyat Aralığı</td>
                    <td className="py-3 px-4 text-sm font-bold text-orange-600">{product.priceRange}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comparisons this product is in */}
      {rivals.length > 0 && (
        <div className="mt-12">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-4">
            Karşılaştırmalar ({rivals.length})
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {rivals.map(({ comparison, rival }) => (
              <Link
                key={comparison.id}
                href={`/karsilastirma/${comparison.slug}`}
                className="group rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition hover:border-zinc-300 hover:bg-zinc-100"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-800">
                  <span>{product.brand} {product.model}</span>
                  <span className="text-orange-600 font-bold">vs</span>
                  <span>{rival.brand} {rival.model}</span>
                </div>
                {comparison.verdict && (
                  <p className="mt-1.5 text-xs text-zinc-500 line-clamp-2">{comparison.verdict}</p>
                )}
                <span className="mt-2 block text-[11px] font-bold uppercase tracking-wider text-orange-600/80 group-hover:text-orange-500 transition">
                  Detaylı karşılaştırma →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Same category products */}
      {sameCategory.length > 0 && (
        <div className="mt-12 pt-10 border-t border-zinc-200">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-4">
            Aynı Kategoride — {catLabel}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {sameCategory.map(p => (
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
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Schema.org */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${product.brand} ${product.model}`,
            brand: { "@type": "Brand", name: product.brand },
            category: catLabel,
            ...(product.priceRange && {
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "TRY",
                availability: "https://schema.org/InStock",
              },
            }),
          }),
        }}
      />
    </article>
  );
}
