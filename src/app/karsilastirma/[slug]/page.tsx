import { getComparisonBySlug, getProductById, getComparisons, productSlug } from "@/lib/products/store";
import { CATEGORY_LABELS } from "@/lib/products/types";
import type { ProductCategory } from "@/lib/products/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) return {};
  const a = await getProductById(comparison.productA);
  const b = await getProductById(comparison.productB);
  if (!a || !b) return {};
  const title = `${a.brand} ${a.model} vs ${b.brand} ${b.model} — Karşılaştırma | Hırdavat Pro`;
  return {
    title,
    description: comparison.verdict || `${a.brand} ${a.model} ve ${b.brand} ${b.model} teknik karşılaştırması. Hangisi daha iyi?`,
    openGraph: { title, description: comparison.verdict },
  };
}

export default async function ComparisonDetailPage({ params }: Props) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) notFound();

  const a = await getProductById(comparison.productA);
  const b = await getProductById(comparison.productB);
  if (!a || !b) notFound();

  const allComparisons = (await getComparisons()).filter(c => c.id !== comparison.id);
  const relatedComps = allComparisons
    .filter(c => c.productA === a.id || c.productB === a.id || c.productA === b.id || c.productB === b.id)
    .slice(0, 4);

  const relatedIds = new Set(relatedComps.flatMap(c => [c.productA, c.productB]));
  const relatedProducts = new Map<string, NonNullable<Awaited<ReturnType<typeof getProductById>>>>();
  for (const id of relatedIds) {
    const p = await getProductById(id);
    if (p) relatedProducts.set(id, p);
  }

  return (
    <article className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
        <Link href="/" className="hover:text-orange-600 transition">Ana Sayfa</Link>
        <span>/</span>
        <Link href="/karsilastirma" className="hover:text-orange-600 transition">Karşılaştırmalar</Link>
        <span>/</span>
        <Link href={`/kategori/${a.category}`} className="hover:text-orange-600 transition">
          {CATEGORY_LABELS[a.category as ProductCategory] || a.category}
        </Link>
        <span>/</span>
        <span className="text-zinc-600">{a.brand} {a.model} vs {b.brand} {b.model}</span>
      </nav>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: "https://hirdavatpro.com" },
              { "@type": "ListItem", position: 2, name: "Karşılaştırmalar", item: "https://hirdavatpro.com/karsilastirma" },
              { "@type": "ListItem", position: 3, name: CATEGORY_LABELS[a.category as ProductCategory], item: `https://hirdavatpro.com/kategori/${a.category}` },
              { "@type": "ListItem", position: 4, name: `${a.brand} ${a.model} vs ${b.brand} ${b.model}` },
            ],
          }),
        }}
      />

      {/* Title */}
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
        {a.brand} {a.model} <span className="text-orange-600">vs</span> {b.brand} {b.model}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-zinc-500">
        <Link href={`/kategori/${a.category}`} className="rounded border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600 hover:border-orange-300 hover:text-orange-600 transition">
          {CATEGORY_LABELS[a.category as ProductCategory] || a.category}
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href={`/urun/${productSlug(a)}`} className="text-xs text-zinc-500 hover:text-orange-600 transition">
          {a.brand} {a.model} detayları →
        </Link>
        <span className="text-zinc-300">·</span>
        <Link href={`/urun/${productSlug(b)}`} className="text-xs text-zinc-500 hover:text-orange-600 transition">
          {b.brand} {b.model} detayları →
        </Link>
      </div>

      {/* Verdict box */}
      {comparison.verdict && (
        <div className="mt-8 rounded-lg border border-orange-200 bg-orange-50 px-5 py-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-orange-600/70 mb-1">Sonuç</p>
          <p className="text-sm font-medium text-zinc-800">{comparison.verdict}</p>
        </div>
      )}

      {/* Quick Specs Table */}
      <div className="mt-10 overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-zinc-200">
              <th className="text-left py-3 pr-4 text-[10px] font-bold uppercase tracking-wider text-zinc-400">Özellik</th>
              <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider text-orange-600">{a.brand} {a.model}</th>
              <th className="text-left py-3 pl-4 text-[10px] font-bold uppercase tracking-wider text-orange-600">{b.brand} {b.model}</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              const allKeys = [...new Set([...Object.keys(a.specs), ...Object.keys(b.specs)])];
              return allKeys.map(key => (
                <tr key={key} className="border-b border-zinc-100">
                  <td className="py-2.5 pr-4 text-xs font-medium text-zinc-500">{key}</td>
                  <td className="py-2.5 px-4 text-xs text-zinc-800">{a.specs[key] ?? "—"}</td>
                  <td className="py-2.5 pl-4 text-xs text-zinc-800">{b.specs[key] ?? "—"}</td>
                </tr>
              ));
            })()}
            {(a.priceRange || b.priceRange) && (
              <tr className="border-b border-zinc-100">
                <td className="py-2.5 pr-4 text-xs font-medium text-zinc-500">Fiyat Aralığı</td>
                <td className="py-2.5 px-4 text-xs font-semibold text-orange-600">{a.priceRange || "—"}</td>
                <td className="py-2.5 pl-4 text-xs font-semibold text-orange-600">{b.priceRange || "—"}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Content */}
      <div className="mt-10 prose prose-zinc prose-sm max-w-none
        prose-headings:font-heading prose-headings:tracking-tight
        prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
        prose-p:leading-relaxed prose-p:text-zinc-600
        prose-table:border-collapse prose-th:text-left prose-th:py-2 prose-th:px-3 prose-th:border-b prose-th:border-zinc-200 prose-th:text-[11px] prose-th:font-bold prose-th:uppercase prose-th:tracking-wider prose-th:text-zinc-400
        prose-td:py-2 prose-td:px-3 prose-td:border-b prose-td:border-zinc-100 prose-td:text-sm
        prose-strong:text-zinc-800
        prose-a:text-orange-600 prose-a:no-underline hover:prose-a:text-orange-500"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(comparison.content) }}
      />

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${a.brand} ${a.model} vs ${b.brand} ${b.model} Karşılaştırması`,
            description: comparison.verdict,
            datePublished: comparison.createdAt,
            publisher: {
              "@type": "Organization",
              name: "Hırdavat Pro",
              url: "https://hirdavatpro.com",
            },
          }),
        }}
      />

      {/* Related comparisons */}
      {relatedComps.length > 0 && (
        <div className="mt-16 pt-10 border-t border-zinc-200">
          <h2 className="font-heading text-lg font-semibold text-zinc-900 mb-6">İlgili Karşılaştırmalar</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {relatedComps.map(c => {
              const ra = relatedProducts.get(c.productA);
              const rb = relatedProducts.get(c.productB);
              if (!ra || !rb) return null;
              return (
                <Link key={c.id} href={`/karsilastirma/${c.slug}`}
                  className="group rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition hover:border-zinc-300 hover:bg-zinc-100">
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-800">
                    <span>{ra.brand} {ra.model}</span>
                    <span className="text-orange-600 font-bold">vs</span>
                    <span>{rb.brand} {rb.model}</span>
                  </div>
                  {c.verdict && <p className="mt-1 text-xs text-zinc-500 line-clamp-1">{c.verdict}</p>}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}

function markdownToHtml(md: string): string {
  let html = md;
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split('|').filter(Boolean).map(c => c.trim());
    if (cells.every(c => /^[-:]+$/.test(c))) return '<!--sep-->';
    return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
  });
  html = html.replace(/((?:<tr>.*<\/tr>\n?)+)/g, (tableBlock) => {
    const rows = tableBlock.replace(/<!--sep-->\n?/g, '').trim();
    const firstRow = rows.match(/<tr>(.*?)<\/tr>/);
    if (firstRow) {
      const headerRow = firstRow[1].replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>');
      const rest = rows.replace(firstRow[0], '');
      return `<table><thead><tr>${headerRow}</tr></thead><tbody>${rest}</tbody></table>`;
    }
    return `<table><tbody>${rows}</tbody></table>`;
  });

  // Paragraphs
  html = html.split('\n\n').map(block => {
    block = block.trim();
    if (!block) return '';
    if (block.startsWith('<h') || block.startsWith('<table') || block.startsWith('<ul') || block.startsWith('<ol')) return block;
    return `<p>${block}</p>`;
  }).join('\n');

  html = html.replace(/<p>\s*<\/p>/g, '');
  return html;
}
