/**
 * ToolSchema — araç sayfaları için yeniden kullanılabilir Schema.org JSON-LD.
 *
 * Karşılaştırma/katalog sitesi olduğumuz için fiyat/offer işaretlenmez.
 * Hesaplama ve seçim araçları tarayıcıda çalışan ücretsiz web uygulamalarıdır:
 *   - WebApplication: aracın kendisi (ücretsiz, kurulum gerektirmez)
 *   - FAQPage: aracın yanıtladığı tipik sorular (rich result + GEO/AI alıntı)
 *   - BreadcrumbList: Ana sayfa › Araçlar › <Araç>
 *
 * Sunucu bileşeni; sayfanın en üstüne yerleştirilir.
 */

type FAQ = { q: string; a: string };

interface ToolSchemaProps {
  /** Araç sayfasının kanonik yolu, ör. "/araclar/boya-hesaplayici" */
  path: string;
  /** Aracın görünen adı */
  name: string;
  /** Kısa açıklama (meta description ile uyumlu olabilir) */
  description: string;
  /** Aracın yanıtladığı tipik sorular — boşsa FAQPage üretilmez */
  faqs?: FAQ[];
  /** "Hesaplama" araçlarında UtilitiesApplication, seçim araçlarında BrowserApplication uygundur */
  applicationCategory?: string;
}

const BASE = "https://hirdavatpro.com";

export function ToolSchema({
  path,
  name,
  description,
  faqs = [],
  applicationCategory = "UtilitiesApplication",
}: ToolSchemaProps) {
  const url = `${BASE}${path}`;

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory,
    operatingSystem: "Tüm cihazlar (web tarayıcı)",
    inLanguage: "tr-TR",
    isAccessibleForFree: true,
    // Bilinçli olarak fiyat işaretlemiyoruz; araç ücretsizdir ama satış/offer yoktur.
    publisher: { "@type": "Organization", name: "HırdavatPro", url: BASE },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Ana Sayfa", item: BASE },
      { "@type": "ListItem", position: 2, name: "Araçlar", item: `${BASE}/araclar` },
      { "@type": "ListItem", position: 3, name, item: url },
    ],
  };

  const faqPage =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      {faqPage && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
      )}
    </>
  );
}
