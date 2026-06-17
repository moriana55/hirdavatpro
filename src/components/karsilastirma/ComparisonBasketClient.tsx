"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products/types";

interface ComparisonBasketClientProps {
  allProducts: Product[];
}

const productSlug = (p: Pick<Product, "brand" | "model">): string => {
  return `${p.brand}-${p.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
};

// Fallback high quality image finder
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

export function ComparisonBasketClient({ allProducts }: ComparisonBasketClientProps) {
  const [basketIds, setBasketIds] = useState<string[]>([]);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [showOnlyDiffs, setShowOnlyDiffs] = useState(false);

  // localstorage'dan sepet verilerini çekme
  useEffect(() => {
    const getBasket = () => {
      try {
        const basket = JSON.parse(localStorage.getItem("hirdavatpro_basket") || "[]");
        setBasketIds(basket);
      } catch {
        setBasketIds([]);
      }
    };

    getBasket();

    const handleBasketChange = () => {
      getBasket();
    };

    window.addEventListener("hirdavatpro_basket_change", handleBasketChange);
    return () => {
      window.removeEventListener("hirdavatpro_basket_change", handleBasketChange);
    };
  }, []);

  // Sepetteki ürünlerin detaylı nesnelerini filtreleyelim
  const selectedProducts = useMemo(() => {
    return basketIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter((p): p is Product => !!p);
  }, [basketIds, allProducts]);

  // Ürünü sepetten kaldırma işlevi
  const handleRemove = (productId: string) => {
    try {
      const newBasket = basketIds.filter((id) => id !== productId);
      localStorage.setItem("hirdavatpro_basket", JSON.stringify(newBasket));
      setBasketIds(newBasket);
      window.dispatchEvent(new Event("hirdavatpro_basket_change"));
    } catch {
      console.error("Sepet güncellenemedi.");
    }
  };

  // Tüm ürünlerin teknik özellik anahtarlarını toplayalım
  const allKeys = useMemo(() => {
    if (selectedProducts.length === 0) return [];
    const keys = new Set<string>();
    selectedProducts.forEach((p) => {
      Object.keys(p.specs).forEach((k) => keys.add(k));
    });
    return Array.from(keys);
  }, [selectedProducts]);

  // Farklı olan özellikleri bulalım (en az bir ürünün değeri diğerinden farklıysa)
  const keysWithDiffs = useMemo(() => {
    return allKeys.filter((key) => {
      if (selectedProducts.length < 2) return false;
      const firstVal = selectedProducts[0].specs[key];
      return selectedProducts.some((p) => p.specs[key] !== firstVal);
    });
  }, [allKeys, selectedProducts]);

  // Ekranda gösterilecek özellik listesi
  const displayedKeys = showOnlyDiffs ? keysWithDiffs : allKeys;

  // Aynı kategorideki tavsiye ürünleri (kullanıcıya sepeti tamamlaması için gösterilecek)
  const quickSuggestions = useMemo(() => {
    if (selectedProducts.length === 0) return allProducts.slice(0, 3);
    const category = selectedProducts[0].category;
    return allProducts
      .filter((p) => p.category === category && !basketIds.includes(p.id))
      .slice(0, 3);
  }, [selectedProducts, allProducts, basketIds]);

  const handleAddSuggestion = (productId: string) => {
    if (basketIds.length >= 3) {
      alert("Aynı anda en fazla 3 ürünü karşılaştırabilirsiniz!");
      return;
    }
    const newBasket = [...basketIds, productId];
    localStorage.setItem("hirdavatpro_basket", JSON.stringify(newBasket));
    setBasketIds(newBasket);
    window.dispatchEvent(new Event("hirdavatpro_basket_change"));
  };

  return (
    <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-[13px] text-secondary font-body-sm">
        <Link href="/" className="hover:text-primary transition-colors decoration-none font-bold">Ana Sayfa</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Karşılaştırma Sepetim</span>
      </nav>

      {/* Header Section */}
      <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-headline-lg text-headline-lg md:text-display-lg font-bold mb-2">Karşılaştırma Sepetim</h1>
          <p className="text-secondary font-body-lg max-w-2xl">
            Seçtiğiniz endüstriyel aletleri yan yana, teknik hassasiyetle kıyaslayın. Farklılıkları anında saptayın.
          </p>
        </div>
        {selectedProducts.length >= 2 && (
          <div className="flex items-center gap-3 bg-surface-container-low px-4 py-2 border border-border-subtle rounded">
            <input
              type="checkbox"
              id="show-basket-diffs-toggle"
              checked={showOnlyDiffs}
              onChange={(e) => setShowOnlyDiffs(e.target.checked)}
              className="w-5 h-5 rounded-sm border-2 border-border-subtle text-primary focus:ring-primary accent-primary cursor-pointer"
            />
            <label htmlFor="show-basket-diffs-toggle" className="font-label-caps text-label-caps text-on-surface font-bold cursor-pointer select-none">
              SADECE FARKLARI GÖSTER ({keysWithDiffs.length})
            </label>
          </div>
        )}
      </header>

      {/* Empty State */}
      {selectedProducts.length === 0 && (
        <section className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-12 md:p-20 text-center shadow-sm max-w-3xl mx-auto">
          <span className="material-symbols-outlined text-[64px] text-secondary mb-6">shopping_basket</span>
          <h2 className="font-headline-md text-headline-md font-bold mb-4">Karşılaştırma Sepetiniz Boş</h2>
          <p className="text-secondary font-body-md max-w-lg mx-auto mb-8">
            Katalogdan veya ana sayfadan ilgilendiğiniz aletlerin üzerindeki kıyaslama ikonuna tıklayarak sepetinize ekleyin ve teknik analizlerini yan yana inceleyin.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/"
              className="bg-primary text-white px-8 py-3.5 font-label-caps text-label-caps font-bold hover:bg-primary/95 transition-all rounded decoration-none shadow"
            >
              ÜRÜNLERİ KEŞFET
            </Link>
            <Link
              href="/araclar"
              className="border-2 border-slate-gray text-slate-gray px-8 py-3.5 font-label-caps text-label-caps font-bold hover:bg-surface-container transition-all rounded decoration-none"
            >
              YARDIMCI ARAÇLAR
            </Link>
          </div>
        </section>
      )}

      {/* 1 Product State: Ask to add more */}
      {selectedProducts.length === 1 && (
        <div className="space-y-12">
          <div className="bg-primary-container/20 border border-primary/20 p-6 rounded-xl flex items-start gap-4 max-w-3xl mx-auto">
            <span className="material-symbols-outlined text-primary text-[28px]">info</span>
            <div>
              <h3 className="font-title-md text-title-md font-bold text-on-primary-container mb-1">Bir Ürün Daha Ekleyin</h3>
              <p className="text-secondary font-body-sm leading-relaxed">
                Teknik karşılaştırma yapabilmek için en az 2 ürün seçmelisiniz. Sepetinizde şu anda 1 ürün bulunuyor: <strong>{selectedProducts[0].brand} {selectedProducts[0].model}</strong>.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-gutter max-w-4xl mx-auto items-stretch">
            {/* The Selected Product */}
            <div className="bg-surface-container-lowest border-2 border-primary p-6 rounded-xl relative flex flex-col justify-between shadow-sm">
              <div>
                <button
                  onClick={() => handleRemove(selectedProducts[0].id)}
                  className="absolute top-4 right-4 text-secondary hover:text-danger-vibrant transition-colors cursor-pointer"
                  title="Sepetten Çıkar"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
                <div className="aspect-square bg-white rounded border border-border-subtle/50 p-4 mb-4 flex items-center justify-center">
                  <img
                    src={getProductImage(selectedProducts[0].category, selectedProducts[0].imageUrl)}
                    alt={`${selectedProducts[0].brand} ${selectedProducts[0].model}`}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <span className="font-label-caps text-[10px] text-secondary font-bold uppercase tracking-wider block mb-1">{selectedProducts[0].brand}</span>
                <h4 className="font-title-md text-title-md font-bold mb-4">{selectedProducts[0].model}</h4>
              </div>
              <Link
                href={`/urun/${productSlug(selectedProducts[0])}`}
                className="text-center w-full py-2.5 border border-primary text-primary font-label-caps text-[11px] font-bold rounded hover:bg-primary hover:text-white transition-all decoration-none"
              >
                DETAYLI İNCELE
              </Link>
            </div>

            {/* Suggestions/Placeholders for Product 2 & 3 */}
            <div className="md:col-span-2 bg-surface-container-low border border-border-dashed border-2 rounded-xl p-8 flex flex-col justify-center">
              <h4 className="font-title-md text-title-md font-bold mb-4 text-center">Önerilen Benzer Aletler</h4>
              {quickSuggestions.length > 0 ? (
                <div className="space-y-4">
                  {quickSuggestions.map((p) => (
                    <div key={p.id} className="bg-white border border-border-subtle p-4 rounded-lg flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-surface-container-low flex-shrink-0 flex items-center justify-center p-1 rounded">
                          <img src={getProductImage(p.category, p.imageUrl)} alt={p.model} className="object-contain max-h-full max-w-full" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-secondary uppercase block">{p.brand}</span>
                          <span className="text-[13px] font-bold text-on-surface line-clamp-1">{p.model}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddSuggestion(p.id)}
                        className="bg-primary text-white px-3 py-1.5 rounded font-label-caps text-[11px] font-bold hover:bg-primary/90 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        EKLE
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-secondary font-body-sm mb-4">Aynı kategoride başka alet bulunamadı.</p>
                  <Link href="/" className="text-primary font-bold hover:underline font-label-caps text-label-caps">Tüm Kataloğu Gör →</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2 or 3 Products Comparison Table */}
      {selectedProducts.length >= 2 && (
        <section className="space-y-8">
          {/* Tool Cards Header Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter items-end">
            <div className="hidden md:block">
              <p className="font-label-caps text-label-caps text-slate-gray mb-2 font-bold">SEPETTEKİ EKİPMANLAR</p>
              <div className="h-1 w-12 bg-primary"></div>
            </div>
            
            {/* Products map */}
            {selectedProducts.map((p, idx) => (
              <div
                key={p.id}
                className={`bg-surface-container-lowest border p-4 rounded-xl relative group transition-all duration-200 ${
                  hoveredCol === idx + 1 ? "border-primary shadow-md" : "border-border-subtle"
                }`}
                onMouseEnter={() => setHoveredCol(idx + 1)}
                onMouseLeave={() => setHoveredCol(null)}
              >
                {/* Delete Button */}
                <button
                  onClick={() => handleRemove(p.id)}
                  className="absolute top-3 right-3 text-secondary hover:text-danger-vibrant transition-colors cursor-pointer bg-surface-container/60 hover:bg-surface-container p-1 rounded-full flex items-center justify-center"
                  title="Sepetten Çıkar"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>

                <div className="aspect-square mb-4 overflow-hidden rounded bg-white flex items-center justify-center p-4 border border-border-subtle/50">
                  <img
                    className="object-contain max-h-full max-w-full transition-transform duration-300 group-hover:scale-105"
                    alt={`${p.brand} ${p.model}`}
                    src={getProductImage(p.category, p.imageUrl)}
                  />
                </div>
                <span className="font-label-caps text-[9px] text-slate-gray font-bold uppercase">{p.brand}</span>
                <h3 className="font-title-md text-title-md font-bold mb-1 line-clamp-1">{p.model}</h3>
                
                <Link href={`/urun/${productSlug(p)}`} className="block text-center mt-3 text-xs text-primary font-bold hover:underline">
                  Ürün detayları →
                </Link>
              </div>
            ))}

            {/* If only 2 products are selected, show a placeholder to add a 3rd one */}
            {selectedProducts.length === 2 && (
              <div className="bg-surface-container-low border-2 border-dashed border-border-subtle/60 p-6 rounded-xl flex flex-col justify-center items-center text-center h-[280px]">
                <span className="material-symbols-outlined text-[32px] text-secondary mb-3">add_circle_outline</span>
                <h5 className="font-title-sm text-title-sm font-bold mb-1">3. Aleti Ekleyin</h5>
                <p className="text-secondary text-[11px] leading-relaxed max-w-[160px] mb-4">
                  Karşılaştırmaya 3. bir alet ekleyerek kıyaslamayı tamamlayın.
                </p>
                <Link
                  href="/"
                  className="text-xs bg-slate-gray text-white px-4 py-2 font-bold rounded font-label-caps text-label-caps hover:bg-primary transition-colors decoration-none"
                >
                  ALET EKLE
                </Link>
              </div>
            )}
          </div>

          {/* Technical Data Comparison Table */}
          <div className="overflow-x-auto border border-border-subtle rounded-2xl bg-surface-container-lowest shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-high border-b border-border-subtle">
                  <th className="p-6 font-label-caps text-label-caps text-slate-gray sticky-column border-r border-border-subtle w-64 font-bold bg-surface-container-high">
                    TEKNİK DETAYLAR
                  </th>
                  {selectedProducts.map((p, idx) => (
                    <th
                      key={p.id}
                      className={`p-6 font-title-md text-title-md text-center transition-colors duration-150 ${
                        hoveredCol === idx + 1 ? "bg-surface-container-low" : ""
                      }`}
                      onMouseEnter={() => setHoveredCol(idx + 1)}
                      onMouseLeave={() => setHoveredCol(null)}
                    >
                      {p.brand} {p.model}
                    </th>
                  ))}
                  {/* Empty header for the 3rd column if only 2 selected */}
                  {selectedProducts.length === 2 && (
                    <th className="p-6 text-center text-secondary/40 font-spec-data text-spec-data italic">
                      (Boş)
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="font-spec-data text-spec-data text-on-surface">
                {displayedKeys.length > 0 ? (
                  displayedKeys.map((key) => {
                    const differs = keysWithDiffs.includes(key);
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
                        {selectedProducts.map((p, idx) => {
                          const val = p.specs[key];
                          return (
                            <td
                              key={p.id}
                              className={`p-4 text-center transition-colors font-medium ${
                                hoveredCol === idx + 1 ? "bg-surface-container-low/40" : ""
                              } ${differs && hoveredCol !== idx + 1 ? "font-bold text-primary" : ""}`}
                              onMouseEnter={() => setHoveredCol(idx + 1)}
                              onMouseLeave={() => setHoveredCol(null)}
                            >
                              {val !== undefined ? String(val) : <span className="text-secondary/40">—</span>}
                            </td>
                          );
                        })}
                        {/* Empty cell if only 2 selected */}
                        {selectedProducts.length === 2 && (
                          <td className="p-4 text-center text-secondary/20">—</td>
                        )}
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={selectedProducts.length + 1} className="p-8 text-center text-secondary font-body-lg">
                      Karşılaştırılacak ortak özellik bulunamadı veya tüm özellikler birebir aynı.
                    </td>
                  </tr>
                )}


              </tbody>
            </table>
          </div>

          {/* Pro Technical Advice Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-[rgba(164,55,0,0.06)] to-transparent border border-primary/10 p-6 flex flex-col md:flex-row gap-6 items-start">
            <div className="bg-primary text-white p-3 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-[24px]">engineering</span>
            </div>
            <div>
              <h4 className="font-title-md text-title-md font-bold mb-2">Mühendis Tavsiyesi</h4>
              <p className="text-secondary font-body-sm leading-relaxed max-w-4xl">
                Alet seçiminde sadece tork (Nm) veya güç (Watt) değil; şantiye ergonomisi ve dayanıklılık için ağırlık (kg) ve motor teknolojisi (Kömürsüz/Brushless) de kritik faktörlerdir. Kömürsüz motorlar, sürtünmeyi ortadan kaldırarak aletin ısınmasını engeller ve enerji verimliliğini %30 artırarak batarya kullanım süresini doğrudan uzatır.
              </p>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
