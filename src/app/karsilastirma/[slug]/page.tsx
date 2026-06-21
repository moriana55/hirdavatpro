import { getComparisonBySlug, getProductById, getComparisons } from "@/lib/products/store";
import { CATEGORY_LABELS } from "@/lib/products/types";
import type { ProductCategory } from "@/lib/products/types";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ComparisonClient } from "@/components/karsilastirma/ComparisonClient";
import { VideoEmbed } from "@/components/urun/VideoEmbed";
import type { Product } from "@/lib/products/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) return {};
  const a = await getProductById(comparison.productA);
  const b = await getProductById(comparison.productB);
  if (!a || !b) return {};
  const title = `${a.brand} ${a.model} vs ${b.brand} ${b.model} — Teknik Karşılaştırma`;
  const desc = comparison.verdict || `${a.brand} ${a.model} ve ${b.brand} ${b.model} teknik karşılaştırması. Hangisi daha iyi?`;
  const canonical = `https://hirdavatpro.com/karsilastirma/${slug}`;
  return {
    title,
    description: desc,
    alternates: { canonical },
    openGraph: { title, description: desc, type: "article", url: canonical },
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

  const relatedProducts = new Map<string, Product>();
  for (const c of relatedComps) {
    for (const id of [c.productA, c.productB]) {
      if (!relatedProducts.has(id)) {
        const p = await getProductById(id);
        if (p) relatedProducts.set(id, p);
      }
    }
  }

  const catLabel = CATEGORY_LABELS[a.category as ProductCategory] || a.category;
  
  // Markdown'ı HTML'e çevirme işlemi (sunucu tarafında yapılıyor)
  const markdownContentHtml = markdownToHtml(comparison.content);

  return (
    <>
      {/* Schema.org Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${a.brand} ${a.model} vs ${b.brand} ${b.model} Karşılaştırması`,
            description: comparison.verdict,
            datePublished: comparison.createdAt,
            dateModified: comparison.createdAt,
            mainEntityOfPage: `https://hirdavatpro.com/karsilastirma/${slug}`,
            author: { "@type": "Organization", name: "Hırdavat Pro" },
            publisher: { "@type": "Organization", name: "Hırdavat Pro", url: "https://hirdavatpro.com" },
          }),
        }}
      />

      <ComparisonClient
        comparison={comparison}
        a={a}
        b={b}
        relatedComps={relatedComps}
        relatedProducts={relatedProducts}
        categoryLabel={catLabel}
        markdownContentHtml={markdownContentHtml}
      />

      {/* İnceleme Videoları — her iki ürün için (video varsa gösterilir) */}
      {(a.youtubeUrl || a.instagramUrl || b.youtubeUrl || b.instagramUrl) && (
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop pb-16">
          <VideoEmbed youtubeUrl={a.youtubeUrl} instagramUrl={a.instagramUrl} title={`${a.brand} ${a.model}`} />
          <VideoEmbed youtubeUrl={b.youtubeUrl} instagramUrl={b.instagramUrl} title={`${b.brand} ${b.model}`} />
        </div>
      )}
    </>
  );
}

function markdownToHtml(md: string): string {
  let html = md;
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
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
  html = html.split('\n\n').map(block => {
    block = block.trim();
    if (!block) return '';
    if (block.startsWith('<h') || block.startsWith('<table') || block.startsWith('<ul') || block.startsWith('<ol')) return block;
    return `<p>${block}</p>`;
  }).join('\n');
  html = html.replace(/<p>\s*<\/p>/g, '');
  return html;
}
