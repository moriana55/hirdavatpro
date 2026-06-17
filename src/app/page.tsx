import Link from "next/link";
import { getProducts, getComparisons, productSlug } from "@/lib/products/store";
import { CATEGORY_LABELS } from "@/lib/products/types";
import { CompareButton } from "@/components/karsilastirma/CompareButton";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  const comparisons = await getComparisons();

  // Öne çıkarılan popüler ürünü dinamik olarak belirleyelim
  const featuredProduct = products.find(p => p.brand === "Bosch" && p.category === "darbeli-matkap") || products[0];

  // Son eklenen 8 ürünü alalım
  const latestProducts = products.slice(0, 8);

  // Son 3 karşılaştırmayı alalım
  const recentComparisons = [...comparisons]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Marka eşleştirmesi için map oluşturalım
  const productMap = new Map(products.map(p => [p.id, p]));

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <section className="industrial-grid pt-32 pb-20 px-margin-desktop">
        <div className="max-w-max-width mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 font-label-caps text-label-caps rounded">
              ENDÜSTRİYEL STANDARTLAR
            </span>
            <h1 className="font-display-lg text-display-lg text-on-surface">
              Endüstriyel Donanım İçin Teknik Analiz & Karşılaştırma
            </h1>
            <p className="text-secondary font-body-lg max-w-xl">
              Fiyat gürültüsünden uzaklaşın. Projeleriniz için en doğru ekipmanı teknik veriler, dayanıklılık testleri ve mühendislik spesifikasyonları ile seçin. Kararınızı rakamlar değil, performans belirlesin.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/karsilastirma"
                className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps flex items-center gap-2 hover:bg-primary-container active:scale-95 transition-all rounded decoration-none"
              >
                KARŞILAŞTIRMAYA BAŞLA
                <span className="material-symbols-outlined text-[20px]">analytics</span>
              </Link>
              <Link
                href="/blog"
                className="border-2 border-slate-gray text-slate-gray px-8 py-4 font-label-caps text-label-caps hover:bg-surface-container-low active:scale-95 transition-all rounded decoration-none"
              >
                TEKNİK REHBERLER
              </Link>
            </div>
          </div>

          {/* Hero Image & Feature Card */}
          <div className="relative">
            <div className="bg-white p-2 border border-border-subtle rounded-lg shadow-sm overflow-hidden">
              <img
                alt="Endüstriyel Analiz"
                className="w-full h-[400px] object-cover rounded"
                src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=1200&q=80"
              />
            </div>
            {featuredProduct && (
              <div className="absolute -bottom-6 -left-6 bg-white p-6 border border-border-subtle shadow-md max-w-xs rounded">
                <div className="flex items-center gap-2 text-warning-amber mb-2">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="font-label-caps text-label-caps font-bold">EN POPÜLER MODEL</span>
                </div>
                <p className="font-title-md text-title-md font-bold text-on-surface">
                  {featuredProduct.brand} {featuredProduct.model}
                </p>
                <p className="text-body-sm text-secondary leading-relaxed">
                  Teknik dayanıklılığı ve operasyonel verimliliği onaylanmış endüstri standardı.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>



      {/* Dynamic Product Grid */}
      <section className="py-20 px-margin-desktop">
        <div className="max-w-max-width mx-auto">
          <div className="flex flex-wrap items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg">Son İncelenen Modeller</h2>
              <p className="text-secondary font-body-lg">Teknik ekibimiz tarafından analiz edilmiş en güncel profesyonel ekipmanlar.</p>
            </div>
            <Link
              href="/karsilastirma"
              className="text-primary font-label-caps text-label-caps flex items-center gap-1 group decoration-none font-bold"
            >
              TÜMÜNÜ GÖR
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {latestProducts.map((p) => {
              const specList = Object.entries(p.specs).slice(0, 2);
              return (
                <div key={p.id} className="bg-white border border-border-subtle group hover:shadow-md transition-shadow flex flex-col justify-between rounded overflow-hidden">
                  <div>
                    <div className="aspect-square overflow-hidden relative bg-white p-6 flex items-center justify-center border-b border-border-subtle/50">
                      <img
                        alt={`${p.brand} ${p.model}`}
                        className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                        src={p.imageUrl || "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=400&q=80"}
                      />
                      <CompareButton productId={p.id} />
                    </div>
                    <div className="p-6">
                      <span className="font-label-caps text-[10px] text-secondary tracking-widest block mb-1 uppercase font-bold">
                        {p.brand}
                      </span>
                      <h3 className="font-title-md text-title-md font-bold mb-4 h-14 overflow-hidden line-clamp-2">
                        {p.model}
                      </h3>
                      {specList.length > 0 && (
                        <div className="flex flex-col gap-2 mb-6">
                          {specList.map(([key, val]) => (
                            <div key={key} className="flex justify-between text-body-sm">
                              <span className="text-secondary">{key}</span>
                              <span className="font-spec-data text-spec-data font-bold text-on-background">{String(val)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="px-6 pb-6">
                    <Link
                      href={`/urun/${productSlug(p)}`}
                      className="block w-full py-3 text-center border border-primary text-primary font-label-caps text-label-caps hover:bg-primary hover:text-on-primary transition-all rounded decoration-none font-bold"
                    >
                      İNCELE
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dynamic Comparisons Section */}
      {recentComparisons.length > 0 && (
        <section className="py-16 px-margin-desktop bg-surface-container-low border-t border-b border-border-subtle">
          <div className="max-w-max-width mx-auto">
            <div className="flex flex-wrap items-end justify-between mb-12 gap-4">
              <div>
                <p className="font-label-caps text-label-caps text-primary mb-2 font-bold">SON TEKNİK KARŞILAŞTIRMALAR</p>
                <h2 className="font-headline-lg text-headline-lg">Son Teknik Karşılaştırmalar</h2>
              </div>
              <Link
                href="/karsilastirma"
                className="text-primary font-label-caps text-label-caps flex items-center gap-1 group decoration-none font-bold"
              >
                TÜMÜNÜ GÖR
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              {recentComparisons.map((c) => {
                const a = productMap.get(c.productA);
                const b = productMap.get(c.productB);
                if (!a || !b) return null;
                return (
                  <div key={c.id} className="bg-white border border-border-subtle p-6 hover:border-primary transition-colors flex flex-col justify-between h-full rounded">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="bg-surface-container text-slate-gray px-2 py-0.5 font-label-caps text-[10px] rounded uppercase font-bold">
                          {CATEGORY_LABELS[a.category] || a.category}
                        </span>
                        <span className="text-[11px] font-spec-data text-secondary">
                          {new Date(c.createdAt).toLocaleDateString("tr-TR")}
                        </span>
                      </div>
                      <h3 className="font-title-md text-title-md font-bold text-on-surface mb-3 flex items-center gap-2 flex-wrap">
                        <span>{a.brand} {a.model}</span>
                        <span className="bg-compare-action/10 text-compare-action px-2 py-0.5 text-[10px] rounded font-bold font-label-caps">VS</span>
                        <span>{b.brand} {b.model}</span>
                      </h3>
                      {c.verdict && (
                        <p className="text-body-sm text-secondary line-clamp-3 mb-6 leading-relaxed">
                          {c.verdict}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/karsilastirma/${c.slug}`}
                      className="block text-center bg-slate-gray hover:bg-primary text-white py-3 font-label-caps text-label-caps rounded transition-colors decoration-none font-bold"
                    >
                      ANALİZİ OKU
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Dynamic Tools Section */}
      <section className="py-20 px-margin-desktop">
        <div className="max-w-max-width mx-auto">
          <div className="flex flex-wrap items-end justify-between mb-12 gap-4">
            <div>
              <p className="font-label-caps text-label-caps text-primary mb-2 font-bold">AKILLI SEÇİM ARAÇLARI</p>
              <h2 className="font-headline-lg text-headline-lg">Akıllı Seçim Yardımcıları</h2>
            </div>
            <Link
              href="/araclar"
              className="text-primary font-label-caps text-label-caps flex items-center gap-1 group decoration-none font-bold"
            >
              TÜMÜNÜ GÖR
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div className="bg-white border border-border-subtle p-8 rounded hover:border-primary transition-colors flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-primary text-4xl mb-4 inline-block">construction</span>
                <h3 className="font-title-md text-title-md font-bold mb-2">Matkap Ucu Seçimi</h3>
                <p className="text-body-sm text-secondary leading-relaxed mb-6">
                  Delmek istediğiniz malzeme tipine, kullanım sıklığına ve matkap tipinize göre en uygun matkap ucu ailesini sanayi standartlarında belirleyin.
                </p>
              </div>
              <Link
                href="/araclar/matkap-ucu"
                className="text-primary font-label-caps text-label-caps hover:text-accent-hover font-bold decoration-none flex items-center gap-1"
              >
                ARACI AÇ
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>

            <div className="bg-white border border-border-subtle p-8 rounded hover:border-primary transition-colors flex flex-col justify-between">
              <div>
                <span className="material-symbols-outlined text-primary text-4xl mb-4 inline-block">filter_frames</span>
                <h3 className="font-title-md text-title-md font-bold mb-2">Testere & Bıçak Seçimi</h3>
                <p className="text-body-sm text-secondary leading-relaxed mb-6">
                  Ahşap, metal veya plastik kesimlerinizde, keseceğiniz malzemenin kalınlığına ve pürüzsüzlük ihtiyacınıza göre mükemmel testere-bıçak eşleşmesini bulun.
                </p>
              </div>
              <Link
                href="/araclar/testere-secimi"
                className="text-primary font-label-caps text-label-caps hover:text-accent-hover font-bold decoration-none flex items-center gap-1"
              >
                ARACI AÇ
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-inverse-surface text-inverse-on-surface py-16 px-margin-desktop">
        <div className="max-w-max-width mx-auto flex flex-col md:flex-row items-center justify-between gap-gutter">
          <div className="space-y-4">
            <h2 className="font-headline-lg text-headline-lg text-white">Teknik Dokümantasyon Gerekiyor mu?</h2>
            <p className="text-secondary-fixed-dim max-w-lg leading-relaxed text-[15px]">
              Tüm endüstriyel aletler için orijinal kullanım kılavuzları, detaylı montaj şemaları ve yedek parça listelerine tek tıkla erişin.
            </p>
          </div>
          <Link
            href="/blog"
            className="bg-primary text-on-primary px-8 py-4 font-label-caps text-label-caps hover:bg-primary-container active:scale-95 transition-all whitespace-nowrap rounded decoration-none font-bold"
          >
            ARŞİVE GİT
          </Link>
        </div>
      </section>
    </div>
  );
}
