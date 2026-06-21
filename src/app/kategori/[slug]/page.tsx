import { getProducts, getComparisons, productSlug } from "@/lib/products/store";
import { CATEGORY_LABELS, CATEGORY_GROUPS } from "@/lib/products/types";
import type { ProductCategory } from "@/lib/products/types";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CategoryClient } from "@/components/kategori/CategoryClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function isValidCategory(slug: string): slug is ProductCategory {
  return slug in CATEGORY_LABELS;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!isValidCategory(slug)) return { title: "Kategori bulunamadı", robots: { index: false, follow: false } };
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
    <>
      {/* Schema.org: BreadcrumbList */}
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

      {/* Schema.org: ItemList — kategorideki ürünler (rich result için).
          Affiliate/karşılaştırma sitesi olduğumuz için fiyat/offer işaretlemiyoruz. */}
      {products.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: `${label} — Ürün Listesi`,
              numberOfItems: products.length,
              itemListElement: products.slice(0, 50).map((p, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `https://hirdavatpro.com/urun/${productSlug(p)}`,
                name: `${p.brand} ${p.model}`,
              })),
            }),
          }}
        />
      )}

      <CategoryClient
        slug={slug}
        categoryLabel={label}
        groupLabel={groupLabel}
        products={products}
        comparisons={comparisons}
        siblingCats={siblingCats}
      />
    </>
  );
}
