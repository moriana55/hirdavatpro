"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Product, Comparison } from "@/lib/products/types";
import { CATEGORY_LABELS } from "@/lib/products/types";
import { ComparisonShareBar } from "@/components/karsilastirma/ComparisonShareBar";

const productSlug = (p: Pick<Product, "brand" | "model">): string => {
  return `${p.brand}-${p.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
};

interface ComparisonClientProps {
  comparison: Comparison;
  a: Product;
  b: Product;
  relatedComps: Comparison[];
  relatedProducts: Map<string, Product>;
  categoryLabel: string;
  markdownContentHtml: string;
}

export function ComparisonClient({
  comparison,
  a,
  b,
  relatedComps,
  relatedProducts,
  categoryLabel,
  markdownContentHtml,
}: ComparisonClientProps) {
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [showOnlyDiffs, setShowOnlyDiffs] = useState<boolean>(false);

  // Kategoriye göre yüksek kaliteli fall-back görsel belirleyelim
  const getProductImage = (category: string, dbImage?: string) => {
    if (dbImage) return dbImage;
    if (category === "avuc-taslama" || category === "taslama-diski") {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuBaHhDkdz63JHem6HFLTyMkWlfIbCZj_4pxHYTObKbezg6kz-MACkNJ-Ovex0HJhaasWvk-trq9lO5zO96TYCFmpJ8QNgDirh-apNAGCtwTKllLP0CoGjhLAGUN3RvNv02OXAbBSg_puxHsNZBNbtrU6iAHowzPgEHxm62Jw1DM8qfMweUMtAIsPrP2MWA1_UJxDOjFpeVQw6a4ZFODVYArLHRtNd8rW3_aM3e1_tbpC9cMjrPwyMVXyb8bsbx92siWyElChzSlUfE"; // Makita grinder
    }
    if (category === "daire-testere" || category === "gonyeli-kesme" || category === "mermer-kesme") {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ1TZ4jcwGZkPcAIjgNoHhfWx4LG2-QHDJp3iQnUrZfJFUCxoDz2h_v_fe4sO1Rp5SgLUdqQ502roLIU0NtcJEHLiDDUz_kA775s-zbz9MZ4TTatiCNAL9CMKNXwOg5MxxADpjp2zVCck5i3ggYgmCdCvWjRphoP-JTcSQJ2v2erNxrjTlS_ajvfXBEzFKDPFzEcVeaznN36pRoUljG2VaOeuXXCzBgbZrrDHP6HKdErCXN2ODWjhKECBHwFxBXfXKj3C69zsEX3M"; // Circular saw
    }
    if (category === "darbe-somun-sikma" || category === "vidalama") {
      return "https://lh3.googleusercontent.com/aida-public/AB6AXuDEvsmCd9CctmJIdmPbf-SkHus9ZCLdUe157db2cCeGsy7pOQCUu8rWnIz2MKUsBfVIqVf01o7vjauwvWRon8WC_lUGEM1IbHQ2nDgjcFv2Yv7qwZ6SUX-hDF85wWbtiFtIp5dZJ8UDdSUDrVQzgEzn6_9C6my9olIHo3qckFTqJvUGEoNNvZbrVqsbDhPd8dl9o9f-RXmVvCQ_lCSoxvstFmf2Go-YUkyXtqPq8-FamisH6XxxggspkM7eZ_PzocwBJSl70FP25EQ"; // Impact Wrench
    }
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuDdF-Y_OafZMtw3-IhzGm0A5fA1g9_Tiaq_C4SN2JAEkscVmyDXJMQ6O3jTu2nmsCH4eB7mGD3Um8h0Wk8CLDGcbsemX7CHxETAJFEjV_kNhIi7Yt317inq2GQT37qCXQ2_oTRrUtZpH7ekN2Wk7rzy15i0-hwGtvec8v95bk9ClKFSKYxdJtMIy7HJWLgWSjbiLsqMJYYNrhOb7TbClDSsiY-y96Wd4XNnGOMIU5usDJcOfu0OfB61l7TpVlWL0eSqEuD7Biz3Pcw"; // DeWalt drill
  };

  const imgA = getProductImage(a.category, a.imageUrl);
  const imgB = getProductImage(b.category, b.imageUrl);

  // Tüm teknik özellik anahtarlarını toplayalım
  const allKeys = useMemo(() => {
    return [...new Set([...Object.keys(a.specs), ...Object.keys(b.specs)])];
  }, [a.specs, b.specs]);

  // Farklı olan anahtarları belirleyelim
  const keysWithDiffs = useMemo(() => {
    return allKeys.filter((key) => {
      const valA = a.specs[key];
      const valB = b.specs[key];
      return valA !== valB && valA !== undefined && valB !== undefined;
    });
  }, [allKeys, a.specs, b.specs]);

  // Ekranda gösterilecek anahtarlar
  const displayedKeys = showOnlyDiffs ? keysWithDiffs : allKeys;

  return (
    <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
      {/* Breadcrumb */}
      <nav className="no-print mb-8 flex flex-wrap items-center gap-2 text-[13px] text-secondary font-body-sm">
        <Link href="/" className="hover:text-primary transition-colors decoration-none font-bold">Ana Sayfa</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <Link href="/karsilastirma" className="hover:text-primary transition-colors decoration-none font-bold">Karşılaştırmalar</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-semibold">{categoryLabel}</span>
      </nav>

      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline-lg text-headline-lg md:text-display-lg font-bold mb-2">Teknik Karşılaştırma</h1>
          <p className="text-secondary font-body-lg max-w-2xl">
            Profesyonel ekipmanların teknik özelliklerini yan yana inceleyin. Endüstriyel hassasiyetle hazırlanmış veri tablosu.
          </p>
        </div>
        <div className="no-print flex items-center gap-3 bg-surface-container-low px-4 py-2 border border-border-subtle rounded">
          <input
            type="checkbox"
            id="show-diffs-toggle"
            checked={showOnlyDiffs}
            onChange={(e) => setShowOnlyDiffs(e.target.checked)}
            className="w-5 h-5 rounded-sm border-2 border-border-subtle text-primary focus:ring-primary accent-primary cursor-pointer"
          />
          <label htmlFor="show-diffs-toggle" className="font-label-caps text-label-caps text-on-surface font-bold cursor-pointer select-none">
            SADECE FARKLARI GÖSTER ({keysWithDiffs.length})
          </label>
        </div>
      </header>

      {/* Dışa aktar / paylaş aksiyonları */}
      <ComparisonShareBar
        shareTitle={`${a.brand} ${a.model} vs ${b.brand} ${b.model} — Teknik Karşılaştırma`}
        shareText={`${a.brand} ${a.model} ve ${b.brand} ${b.model} teknik karşılaştırması`}
      />

      {/* Tool Selection / Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8 items-end">
        <div className="hidden md:block">
          <p className="font-label-caps text-label-caps text-slate-gray mb-2 font-bold">KARŞILAŞTIRILAN ÜRÜNLER</p>
          <div className="h-1 w-12 bg-primary"></div>
        </div>
        {/* Tool 1 Card */}
        <div
          className={`bg-surface-container-lowest border p-4 rounded-lg group transition-all duration-200 ${
            hoveredCol === 1 ? "border-primary shadow-md" : "border-border-subtle"
          }`}
          onMouseEnter={() => setHoveredCol(1)}
          onMouseLeave={() => setHoveredCol(null)}
        >
          <div className="aspect-square mb-4 overflow-hidden rounded bg-white flex items-center justify-center p-4 border border-border-subtle/50">
            <img className="object-contain max-h-full max-w-full transition-transform duration-300 group-hover:scale-105" alt={`${a.brand} ${a.model}`} src={imgA} />
          </div>
          <h3 className="font-title-md text-title-md font-bold mb-1 line-clamp-1">{a.brand} {a.model}</h3>
          <span className="font-label-caps text-label-caps text-slate-gray font-bold uppercase">{categoryLabel}</span>
          <Link href={`/urun/${productSlug(a)}`} className="block text-center mt-3 text-xs text-primary font-bold hover:underline">
            Ürün detayları →
          </Link>
        </div>
        {/* Tool 2 Card */}
        <div
          className={`bg-surface-container-lowest border p-4 rounded-lg group transition-all duration-200 ${
            hoveredCol === 2 ? "border-primary shadow-md" : "border-border-subtle"
          }`}
          onMouseEnter={() => setHoveredCol(2)}
          onMouseLeave={() => setHoveredCol(null)}
        >
          <div className="aspect-square mb-4 overflow-hidden rounded bg-white flex items-center justify-center p-4 border border-border-subtle/50">
            <img className="object-contain max-h-full max-w-full transition-transform duration-300 group-hover:scale-105" alt={`${b.brand} ${b.model}`} src={imgB} />
          </div>
          <h3 className="font-title-md text-title-md font-bold mb-1 line-clamp-1">{b.brand} {b.model}</h3>
          <span className="font-label-caps text-label-caps text-slate-gray font-bold uppercase">{categoryLabel}</span>
          <Link href={`/urun/${productSlug(b)}`} className="block text-center mt-3 text-xs text-primary font-bold hover:underline">
            Ürün detayları →
          </Link>
        </div>
      </div>

      {/* Comparison Table Container */}
      <div className="overflow-x-auto border border-border-subtle rounded-xl bg-surface-container-lowest shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-high border-b border-border-subtle">
              <th className="p-6 font-label-caps text-label-caps text-slate-gray sticky-column border-r border-border-subtle w-64 font-bold bg-surface-container-high">
                TEKNİK ÖZELLİKLER
              </th>
              <th
                className={`p-6 font-title-md text-title-md text-center transition-colors duration-150 ${
                  hoveredCol === 1 ? "bg-surface-container-low" : ""
                }`}
                onMouseEnter={() => setHoveredCol(1)}
                onMouseLeave={() => setHoveredCol(null)}
              >
                {a.brand} {a.model}
              </th>
              <th
                className={`p-6 font-title-md text-title-md text-center transition-colors duration-150 ${
                  hoveredCol === 2 ? "bg-surface-container-low" : ""
                }`}
                onMouseEnter={() => setHoveredCol(2)}
                onMouseLeave={() => setHoveredCol(null)}
              >
                {b.brand} {b.model}
              </th>
            </tr>
          </thead>
          <tbody className="font-spec-data text-spec-data text-on-surface">
            {displayedKeys.length > 0 ? (
              displayedKeys.map((key) => {
                const valA = a.specs[key];
                const valB = b.specs[key];
                const differs = valA !== valB && valA !== undefined && valB !== undefined;
                return (
                  <tr
                    key={key}
                    className={`comparison-table-row group border-b border-border-subtle/50 transition-colors ${
                      differs ? "diff-highlight" : ""
                    }`}
                  >
                    <td className="p-4 pl-6 border-r border-border-subtle sticky-column font-label-caps text-secondary font-bold">
                      {key}
                    </td>
                    <td
                      className={`p-4 text-center transition-colors font-medium ${
                        hoveredCol === 1 ? "bg-surface-container-low/40" : ""
                      } ${differs && hoveredCol !== 1 ? "font-bold text-primary" : ""}`}
                      onMouseEnter={() => setHoveredCol(1)}
                      onMouseLeave={() => setHoveredCol(null)}
                    >
                      {valA !== undefined ? String(valA) : <span className="text-secondary/40">—</span>}
                    </td>
                    <td
                      className={`p-4 text-center transition-colors font-medium ${
                        hoveredCol === 2 ? "bg-surface-container-low/40" : ""
                      } ${differs && hoveredCol !== 2 ? "font-bold text-primary" : ""}`}
                      onMouseEnter={() => setHoveredCol(2)}
                      onMouseLeave={() => setHoveredCol(null)}
                    >
                      {valB !== undefined ? String(valB) : <span className="text-secondary/40">—</span>}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="p-8 text-center text-secondary font-body-lg">
                  Karşılaştırılacak özellik bulunamadı veya tüm özellikler aynı.
                </td>
              </tr>
            )}


          </tbody>
        </table>
      </div>

      {/* Dynamic Verdict / Analysis */}
      {comparison.verdict && (
        <div className="mt-12 rounded-2xl bg-gradient-to-r from-[rgba(234,88,12,0.06)] to-[rgba(234,88,12,0.02)] border border-[rgba(234,88,12,0.12)] px-6 py-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)] mb-1.5 font-bold font-label-caps">Sonuç / Verdict</p>
          <p className="text-[15px] font-medium text-on-surface leading-relaxed">{comparison.verdict}</p>
        </div>
      )}

      {/* Editor detailed Analysis Article */}
      {markdownContentHtml && (
        <section className="mt-12">
          <div className="bg-slate-gray p-4 flex items-center gap-3 rounded-t shadow-sm border border-border-subtle border-b-0">
            <span className="material-symbols-outlined text-white">article</span>
            <h2 className="font-title-md text-title-md text-white font-bold">Mühendislik Analizi &amp; Değerlendirme</h2>
          </div>
          <div
            className="bg-white border border-border-subtle p-8 rounded-b shadow-sm prose prose-neutral max-w-none
              [&_h2]:font-heading [&_h2]:text-[22px] [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:text-on-background
              [&_h3]:font-heading [&_h3]:text-[17px] [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-3
              [&_p]:text-[14px] [&_p]:leading-[1.8] [&_p]:text-secondary [&_p]:mb-4
              [&_strong]:text-on-background [&_strong]:font-bold
              [&_table]:w-full [&_table]:border-collapse [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:border [&_table]:border-border-subtle [&_table]:my-6
              [&_th]:text-left [&_th]:py-3 [&_th]:px-4 [&_th]:border-b [&_th]:border-border-subtle [&_th]:text-[11px] [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-secondary [&_th]:bg-surface-container-high
              [&_td]:py-3 [&_td]:px-4 [&_td]:border-b [&_td]:border-border-subtle [&_td]:text-[13px] [&_td]:font-spec-data
              [&_tr:nth-child(even)]:bg-surface-container-low
              [&_a]:text-primary [&_a]:no-underline hover:[&_a]:text-accent-hover"
            dangerouslySetInnerHTML={{ __html: markdownContentHtml }}
          />
        </section>
      )}

      {/* Call to Action / Info Cards */}
      <section className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="bg-surface-container border border-border-subtle p-8 rounded-xl flex items-start gap-6 shadow-sm">
          <div className="bg-primary-container p-3 rounded-lg text-on-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">lightbulb</span>
          </div>
          <div>
            <h4 className="font-title-md text-title-md mb-2 font-bold">Hangi Veri Daha Önemli?</h4>
            <p className="text-secondary font-body-sm leading-relaxed">
              Ağır işlerde tork (Nm) değeri en kritik veridir. Sürekli kullanım için motor tipinin "Kömürsüz" olması ısınmayı azaltır ve pil ömrünü %30 artırır.
            </p>
          </div>
        </div>
        <div className="bg-surface-container border border-border-subtle p-8 rounded-xl flex items-start gap-6 shadow-sm">
          <div className="bg-success-vibrant text-white p-3 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">verified</span>
          </div>
          <div>
            <h4 className="font-title-md text-title-md mb-2 font-bold">Resmi Veri Onayı</h4>
            <p className="text-secondary font-body-sm leading-relaxed">
              Tablodaki tüm veriler üreticilerin resmi kataloglarından alınmıştır. HırdavatPro verilerin doğruluğunu endüstriyel standartlarda garanti eder.
            </p>
          </div>
        </div>
      </section>

      {/* Related Comparisons */}
      {relatedComps.length > 0 && (
        <section className="no-print mt-16 pt-10 border-t border-border-subtle">
          <p className="font-label-caps text-label-caps text-slate-gray mb-6 font-bold">İLGİLİ TEKNİK KARŞILAŞTIRMALAR</p>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedComps.map((c) => {
              const ra = relatedProducts.get(c.productA);
              const rb = relatedProducts.get(c.productB);
              if (!ra || !rb) return null;
              return (
                <Link
                  key={c.id}
                  href={`/karsilastirma/${c.slug}`}
                  className="bg-white border border-border-subtle p-5 hover:border-primary transition-all rounded decoration-none group flex flex-col justify-between h-full shadow-sm"
                >
                  <div className="flex items-center gap-2.5 text-[14px] font-semibold text-[var(--foreground)] group-hover:text-primary transition-colors">
                    <span>{ra.brand} {ra.model}</span>
                    <span className="bg-compare-action/10 text-compare-action px-2 py-0.5 text-[9px] rounded font-bold">VS</span>
                    <span>{rb.brand} {rb.model}</span>
                  </div>
                  {c.verdict && (
                    <p className="mt-2 text-secondary text-body-sm line-clamp-1">{c.verdict}</p>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
