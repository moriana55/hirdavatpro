import { getProducts, getComparisons } from "@/lib/products/store";
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
    <>
      {/* Schema.org Structured Data */}
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
