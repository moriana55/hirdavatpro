"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products/types";
import { CATEGORY_LABELS } from "@/lib/products/types";

interface AkilliSecimWizardClientProps {
  allProducts: Product[];
}

const productSlug = (p: Pick<Product, "brand" | "model">): string => {
  return `${p.brand}-${p.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
};

// Fallback high quality image finder
const getProductImage = (category: string, dbImage?: string) => {
  if (dbImage) return dbImage;
  if (category === "avuc-taslama" || category === "taslama-diski") {
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuBaHhDkdz63JHem6HFLTyMkWlfIbCZj_4pxHYTObKbezg6kz-MACkNJ-Ovex0HJhaasWvk-trq9lO5zO96TYCFmpJ8QNgDirh-apNAGCtwTKllLP0CoGjhLAGUN3RvNv02OXAbBSg_puxHsNZBNbtrU6iAHowzPgEHxm62Jw1DM8qfMweUMtAIsPrP2MWA1_UJxDOjFpeVQw6a4ZFODVYArLHRtNd8rW3_aM3e1_tbpC9cMjrPwyMVXyb8bsbx92siWyElChzSlUfE";
  }
  if (category === "daire-testere" || category === "gonyeli-kesme" || category === "mermer-kesme") {
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ1TZ4jcwGZkPcAIjgNoHhfWx4LG2-QHDJp3iQnUrZfJFUCxoDz2h_v_fe4sO1Rp5SgLUdqQ502roLIU0NtcJEHLiDDUz_kA775s-zbz9MZ4TTatiCNAL9CMKNXwOg5MxxADpjp2zVCck5i3ggYgmCdCvWjRphoP-JTcSQJ2v2erNxrjTlS_ajvfXBEzFKDPFzEcVeaznN36pRoUljG2VaOeuXXCzBgbZrrDHP6HKdErCXN2ODWjhKECBHwFxBXfXKj3C69zsEX3M";
  }
  if (category === "darbe-somun-sikma" || category === "vidalama") {
    return "https://lh3.googleusercontent.com/aida-public/AB6AXuDEvsmCd9CctmJIdmPbf-SkHus9ZCLdUe157db2cCeGsy7pOQCUu8rWnIz2MKUsBfVIqVf01o7vjauwvWRon8WC_lUGEM1IbHQ2nDgjcFv2Yv7qwZ6SUX-hDF85wWbtiFtIp5dZJ8UDdSUDrVQzgEzn6_9C6my9olIHo3qckFTqJvUGEoNNvZbrVqsbDhPd8dl9o9f-RXmVvCQ_lCSoxvstFmf2Go-YUkyXtqPq8-FamisH6XxxggspkM7eZ_PzocwBJSl70FP25EQ";
  }
  return "https://lh3.googleusercontent.com/aida-public/AB6AXuDdF-Y_OafZMtw3-IhzGm0A5fA1g9_Tiaq_C4SN2JAEkscVmyDXJMQ6O3jTu2nmsCH4eB7mGD3Um8h0Wk8CLDGcbsemX7CHxETAJFEjV_kNhIi7Yt317inq2GQT37qCXQ2_oTRrUtZpH7ekN2Wk7rzy15i0-hwGtvec8v95bk9ClKFSKYxdJtMIy7HJWLgWSjbiLsqMJYYNrhOb7TbClDSsiY-y96Wd4XNnGOMIU5usDJcOfu0OfB61l7TpVlWL0eSqEuD7Biz3Pcw";
};

export function AkilliSecimWizardClient({ allProducts }: AkilliSecimWizardClientProps) {
  const [step, setStep] = useState(1);
  const [usage, setUsage] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [budget, setBudget] = useState<string | null>(null);
  const [basketIds, setBasketIds] = useState<string[]>([]);

  // Local sepet durumunu yükleme
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

    window.addEventListener("hirdavatpro_basket_change", getBasket);
    return () => {
      window.removeEventListener("hirdavatpro_basket_change", getBasket);
    };
  }, []);

  const handleAddToBasket = (productId: string) => {
    try {
      const basket: string[] = JSON.parse(localStorage.getItem("hirdavatpro_basket") || "[]");
      if (basket.includes(productId)) {
        // Zaten ekli, çıkaralım
        const newBasket = basket.filter((id) => id !== productId);
        localStorage.setItem("hirdavatpro_basket", JSON.stringify(newBasket));
        setBasketIds(newBasket);
      } else {
        if (basket.length >= 3) {
          alert("Aynı anda en fazla 3 ürünü sepetinizde karşılaştırabilirsiniz!");
          return;
        }
        const newBasket = [...basket, productId];
        localStorage.setItem("hirdavatpro_basket", JSON.stringify(newBasket));
        setBasketIds(newBasket);
      }
      window.dispatchEvent(new Event("hirdavatpro_basket_change"));
    } catch {
      console.error("Sepet güncellenemedi.");
    }
  };

  // Dinamik olarak seed veritabanımızdaki ürünleri eşleme
  const matchedRecommendations = useMemo(() => {
    if (step !== 4 || !usage || !category || !budget) return [];

    const filtered = allProducts.filter((p) => {
      // Kategori Filtresi
      if (category === "matkap") {
        return ["darbeli-matkap", "kirici-delici", "vidalama"].includes(p.category);
      } else if (category === "testere") {
        return ["daire-testere", "gonyeli-kesme", "mermer-kesme"].includes(p.category);
      } else if (category === "taslama") {
        return ["avuc-taslama"].includes(p.category);
      }
      return true;
    });

    // Her ürün için puanlama yapalım
    const scoredProducts = filtered.map((p) => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Motor Tipi Puanlaması (Brushless - Kömürsüz)
      const isBrushless = Object.entries(p.specs).some(([k, v]) => {
        return k.toLowerCase().includes("motor") && 
          (String(v).toLowerCase().includes("kömürsüz") || String(v).toLowerCase().includes("brushless"));
      });

      if (usage === "endustriyel") {
        if (isBrushless) {
          score += 40;
          reasons.push("Ağır şantiye şartlarında kömürsüz motor ısınmayı ve enerji kaybını sıfırlayarak sürekli tork üretir.");
        } else {
          score += 10;
          reasons.push("Güçlü yapısı işinizi görür ancak yoğun günlerde motor dinlendirilmelidir.");
        }
      } else if (usage === "atolye") {
        if (isBrushless) {
          score += 30;
          reasons.push("Uzun servis ömrüyle atölye verimliliğinizi maksimuma çıkarır.");
        } else {
          score += 25;
          reasons.push("Atölye sıklığındaki işler için ideal ve dayanıklıdır.");
        }
      } else {
        // Hobi
        if (!isBrushless) {
          score += 35;
          reasons.push("Ekonomik bakım maliyetiyle hobi kullanımı için son derece bütçe dostudur.");
        } else {
          score += 20;
          reasons.push("Hobi için üstün performans sunar ancak bütçeniz için lüks kaçabilir.");
        }
      }

      // 2. Bütçe puanlaması
      // priceRange tespiti yapalım. Fiyat segmentini saptayalım
      const price = p.priceRange || "";
      const isHighEnd = price.includes("8.") || price.includes("9.") || price.includes("10.") || price.includes("12.") || price.includes("15.");
      const isMidEnd = price.includes("4.") || price.includes("5.") || price.includes("6.") || price.includes("7.");
      
      if (budget === "ekonomik") {
        if (!isHighEnd && !isMidEnd) {
          score += 50;
          reasons.push("Sınıfının en erişilebilir fiyatlı/yüksek F/P oranlı modelidir.");
        } else if (isMidEnd) {
          score += 25;
          reasons.push("Orta seviye bütçe dengesiyle yatırım maliyetini kısa sürede amorti eder.");
        } else {
          score -= 10;
          reasons.push("Yüksek başlangıç maliyeti bütçe önceliğinizle çelişebilir.");
        }
      } else if (budget === "performans") {
        if (isMidEnd) {
          score += 50;
          reasons.push("Performans/Fiyat dengesi şantiyeniz için en optimize yatırım noktasıdır.");
        } else if (isHighEnd) {
          score += 35;
          reasons.push("Üstün güç çıktıları sayesinde en zorlu işlerde dahi duraksamaz.");
        } else {
          score += 10;
          reasons.push("Bütçe dostu ancak yüksek torklu işlerde zorlanabilir.");
        }
      } else {
        // En iyisi / Sınırsız
        if (isHighEnd) {
          score += 60;
          reasons.push("Ödün vermez endüstriyel kalitesi ve üst seviye malzeme mühendisliğiyle ömürlük bir alettir.");
        } else if (isMidEnd) {
          score += 30;
          reasons.push("Profesyonel ihtiyaçları karşılayabilen sağlam bir modeldir.");
        } else {
          score += 5;
          reasons.push("Temel seviye olup, ekstrem endüstriyel yüklere uygun değildir.");
        }
      }

      // Maksimum 100 puan üzerinden normalize etme
      const finalPercentage = Math.min(Math.max(score, 10), 100);

      return {
        product: p,
        percentage: finalPercentage,
        reasons: reasons.slice(0, 2),
      };
    });

    // Puana göre azalan sırada sıralayıp ilk 3'ünü alalım
    return scoredProducts
      .sort((x, y) => y.percentage - x.percentage)
      .slice(0, 3);
  }, [step, usage, category, budget, allProducts]);

  const handleReset = () => {
    setUsage(null);
    setCategory(null);
    setBudget(null);
    setStep(1);
  };

  return (
    <main className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
      {/* Wizard Card Wrapper */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-3xl shadow-lg max-w-4xl mx-auto overflow-hidden">
        
        {/* Banner header */}
        <div className="bg-gradient-to-r from-primary to-[rgba(164,55,0,0.85)] p-8 text-white relative">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-[28px] text-white">sparkles</span>
            <span className="font-label-caps text-[11px] font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded">MÜHENDİSLİK DANIŞMANI</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-bold">Akıllı Alet Seçim Sihirbazı</h1>
          <p className="text-white/80 font-body-sm max-w-xl mt-1 leading-relaxed">
            Veritabanımızdaki onlarca endüstriyel aleti kullanım seviyenize, kategorinize ve bütçenize göre analiz edip size en uygun aleti eşsiz gerekçeleriyle önerelim.
          </p>

          {/* Steps Progress dots */}
          {step <= 3 && (
            <div className="absolute right-8 bottom-8 flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full transition-colors ${step >= 1 ? "bg-white" : "bg-white/30"}`}></span>
              <span className={`w-3 h-3 rounded-full transition-colors ${step >= 2 ? "bg-white" : "bg-white/30"}`}></span>
              <span className={`w-3 h-3 rounded-full transition-colors ${step >= 3 ? "bg-white" : "bg-white/30"}`}></span>
            </div>
          )}
        </div>

        {/* Wizard Steps Content */}
        <div className="p-8 md:p-12 min-h-[380px] flex flex-col justify-between">
          
          {/* STEP 1: Usage Level */}
          {step === 1 && (
            <section className="space-y-6">
              <div className="text-center md:text-left">
                <span className="text-[11px] font-bold text-primary tracking-widest uppercase font-label-caps block mb-1">ADIM 1 / 3</span>
                <h2 className="font-headline-md text-headline-md font-bold">Aleti hangi yoğunlukta kullanacaksınız?</h2>
                <p className="text-secondary text-body-md mt-1">İhtiyacınız olan dayanıklılık ve şantiye yükü sınıfını saptamamıza yardımcı olur.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter pt-4">
                {/* Option 1: Hobi */}
                <button
                  onClick={() => { setUsage("hobi"); setStep(2); }}
                  className="bg-white border-2 border-border-subtle rounded-2xl p-6 text-center hover:border-primary transition-all group cursor-pointer hover:shadow-sm"
                >
                  <span className="material-symbols-outlined text-[44px] text-secondary group-hover:text-primary mb-4 transition-colors">home</span>
                  <h4 className="font-title-md text-title-md font-bold mb-2">Hobi & Hafif İşler</h4>
                  <p className="text-secondary text-[12px] leading-relaxed">
                    Ev içi ufak tadilatlar, ahşap hobi projeleri ve ayda bir kaç kez kullanım.
                  </p>
                </button>
                
                {/* Option 2: Atolye */}
                <button
                  onClick={() => { setUsage("atolye"); setStep(2); }}
                  className="bg-white border-2 border-border-subtle rounded-2xl p-6 text-center hover:border-primary transition-all group cursor-pointer hover:shadow-sm"
                >
                  <span className="material-symbols-outlined text-[44px] text-secondary group-hover:text-primary mb-4 transition-colors">precision_manufacturing</span>
                  <h4 className="font-title-md text-title-md font-bold mb-2">Atölye & Profesyonel</h4>
                  <p className="text-secondary text-[12px] leading-relaxed">
                    Mobilya imalatı, küçük ölçekli atölyeler ve haftalık sürekli kullanım.
                  </p>
                </button>

                {/* Option 3: Endustriyel */}
                <button
                  onClick={() => { setUsage("endustriyel"); setStep(2); }}
                  className="bg-white border-2 border-border-subtle rounded-2xl p-6 text-center hover:border-primary transition-all group cursor-pointer hover:shadow-sm"
                >
                  <span className="material-symbols-outlined text-[44px] text-secondary group-hover:text-primary mb-4 transition-colors">construction</span>
                  <h4 className="font-title-md text-title-md font-bold mb-2">Ağır Şantiye / Endüstriyel</h4>
                  <p className="text-secondary text-[12px] leading-relaxed">
                    Şantiye ortamında beton kırma, kalın metal delme ve günlük 8 saat aralıksız yük.
                  </p>
                </button>
              </div>
            </section>
          )}

          {/* STEP 2: Category Choice */}
          {step === 2 && (
            <section className="space-y-6">
              <div className="text-center md:text-left">
                <span className="text-[11px] font-bold text-primary tracking-widest uppercase font-label-caps block mb-1">ADIM 2 / 3</span>
                <h2 className="font-headline-md text-headline-md font-bold">Hangi alet grubuna ihtiyacınız var?</h2>
                <p className="text-secondary text-body-md mt-1">İlgi alanınıza giren ekipman kategorisini seçin.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter pt-4">
                {/* Option 1: Matkap */}
                <button
                  onClick={() => { setCategory("matkap"); setStep(3); }}
                  className="bg-white border-2 border-border-subtle rounded-2xl p-6 text-center hover:border-primary transition-all group cursor-pointer hover:shadow-sm"
                >
                  <span className="material-symbols-outlined text-[44px] text-secondary group-hover:text-primary mb-4 transition-colors">hardware</span>
                  <h4 className="font-title-md text-title-md font-bold mb-2">Matkap / Delme & Kırma</h4>
                  <p className="text-secondary text-[12px] leading-relaxed">
                    Darbeli matkaplar, kırıcı deliciler ve akülü vidalama modelleri.
                  </p>
                </button>
                
                {/* Option 2: Testere */}
                <button
                  onClick={() => { setCategory("testere"); setStep(3); }}
                  className="bg-white border-2 border-border-subtle rounded-2xl p-6 text-center hover:border-primary transition-all group cursor-pointer hover:shadow-sm"
                >
                  <span className="material-symbols-outlined text-[44px] text-secondary group-hover:text-primary mb-4 transition-colors">grid_on</span>
                  <h4 className="font-title-md text-title-md font-bold mb-2">Testere / Kesme</h4>
                  <p className="text-secondary text-[12px] leading-relaxed">
                    Daire testereler, gönyeli kesmeler ve mermer/fayans kesiciler.
                  </p>
                </button>

                {/* Option 3: Taslama */}
                <button
                  onClick={() => { setCategory("taslama"); setStep(3); }}
                  className="bg-white border-2 border-border-subtle rounded-2xl p-6 text-center hover:border-primary transition-all group cursor-pointer hover:shadow-sm"
                >
                  <span className="material-symbols-outlined text-[44px] text-secondary group-hover:text-primary mb-4 transition-colors">cyclone</span>
                  <h4 className="font-title-md text-title-md font-bold mb-2">Taşlama / Zımparalama</h4>
                  <p className="text-secondary text-[12px] leading-relaxed">
                    Avuç taşlamalar, metal ve taş kesme / zımparalama aletleri.
                  </p>
                </button>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-secondary hover:text-primary font-bold flex items-center gap-1 font-label-caps text-label-caps cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  GERİ DÖN
                </button>
              </div>
            </section>
          )}

          {/* STEP 3: Budget priorities */}
          {step === 3 && (
            <section className="space-y-6">
              <div className="text-center md:text-left">
                <span className="text-[11px] font-bold text-primary tracking-widest uppercase font-label-caps block mb-1">ADIM 3 / 3</span>
                <h2 className="font-headline-md text-headline-md font-bold">Bütçe ve yatırım önceliğiniz nedir?</h2>
                <p className="text-secondary text-body-md mt-1">Seçtiğiniz segment, tork/fiyat verimliliğini belirler.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter pt-4">
                {/* Option 1: Ekonomik */}
                <button
                  onClick={() => { setBudget("ekonomik"); setStep(4); }}
                  className="bg-white border-2 border-border-subtle rounded-2xl p-6 text-center hover:border-primary transition-all group cursor-pointer hover:shadow-sm"
                >
                  <span className="material-symbols-outlined text-[44px] text-secondary group-hover:text-primary mb-4 transition-colors">payments</span>
                  <h4 className="font-title-md text-title-md font-bold mb-2">Fiyat / F/P Odaklı</h4>
                  <p className="text-secondary text-[12px] leading-relaxed">
                    Mümkün olan en uygun maliyetle maksimum teknik verim.
                  </p>
                </button>
                
                {/* Option 2: Performans */}
                <button
                  onClick={() => { setBudget("performans"); setStep(4); }}
                  className="bg-white border-2 border-border-subtle rounded-2xl p-6 text-center hover:border-primary transition-all group cursor-pointer hover:shadow-sm"
                >
                  <span className="material-symbols-outlined text-[44px] text-secondary group-hover:text-primary mb-4 transition-colors">offline_bolt</span>
                  <h4 className="font-title-md text-title-md font-bold mb-2">Performans & Dayanıklılık</h4>
                  <p className="text-secondary text-[12px] leading-relaxed">
                    Brushless (Kömürsüz) motor ömrü ve yüksek tork kapasitesi önceliği.
                  </p>
                </button>

                {/* Option 3: En iyisi */}
                <button
                  onClick={() => { setBudget("en_iyisi"); setStep(4); }}
                  className="bg-white border-2 border-border-subtle rounded-2xl p-6 text-center hover:border-primary transition-all group cursor-pointer hover:shadow-sm"
                >
                  <span className="material-symbols-outlined text-[44px] text-secondary group-hover:text-primary mb-4 transition-colors">verified</span>
                  <h4 className="font-title-md text-title-md font-bold mb-2">Ödün Vermez En İyisi</h4>
                  <p className="text-secondary text-[12px] leading-relaxed">
                    En zorlu endüstriyel standartlara sahip üst seviye amiral gemileri.
                  </p>
                </button>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-secondary hover:text-primary font-bold flex items-center gap-1 font-label-caps text-label-caps cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  GERİ DÖN
                </button>
              </div>
            </section>
          )}

          {/* STEP 4: RECOMMENDATIONS RESULTS */}
          {step === 4 && (
            <section className="space-y-8 animate-fadeIn">
              <div className="text-center pb-4 border-b border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <span className="text-[11px] font-bold text-success-vibrant tracking-widest uppercase font-label-caps flex items-center justify-center md:justify-start gap-1">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    ANALİZ TAMAMLANDI
                  </span>
                  <h2 className="font-headline-md text-headline-md font-bold">Sizin İçin En Uygun 3 Alet</h2>
                </div>
                <button
                  onClick={handleReset}
                  className="bg-surface-container border border-border-subtle text-slate-gray px-4 py-2 text-xs font-bold rounded flex items-center gap-1 hover:border-primary hover:text-primary transition-colors font-label-caps text-label-caps cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  SİHİRBAZI YENİDEN BAŞLAT
                </button>
              </div>

              {matchedRecommendations.length > 0 ? (
                <div className="space-y-6">
                  {matchedRecommendations.map((rec, idx) => {
                    const p = rec.product;
                    const inBasket = basketIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        className="bg-white border border-border-subtle rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-stretch gap-6 transition-all hover:border-primary hover:shadow-md relative overflow-hidden"
                      >
                        {/* Match score ribbon */}
                        <div className="absolute top-0 left-0 bg-primary text-white text-[10px] font-bold px-3 py-1 font-label-caps rounded-br-lg shadow-sm">
                          {idx === 0 ? "🏆 EN İYİ EŞLEŞME" : `${idx + 1}. ALTERNATİF`}
                        </div>

                        {/* Product Image */}
                        <div className="w-40 h-40 bg-white border border-border-subtle/50 rounded-xl p-4 flex items-center justify-center flex-shrink-0">
                          <img
                            src={getProductImage(p.category, p.imageUrl)}
                            alt={p.model}
                            className="max-h-full max-w-full object-contain"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 flex flex-col justify-between text-center md:text-left">
                          <div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 mb-1.5 mt-2 md:mt-0">
                              <span className="text-[10px] font-bold text-secondary uppercase font-label-caps tracking-widest">{p.brand}</span>
                              <span className="text-[10px] font-bold text-primary font-label-caps bg-primary/10 px-2 py-0.5 rounded">
                                %{rec.percentage} UYUM
                              </span>
                            </div>
                            <h3 className="font-title-lg text-title-lg font-bold mb-3">{p.model}</h3>
                            
                            {/* Engineering Justification */}
                            <div className="bg-surface-container/40 p-3 rounded-lg border border-border-subtle/40 text-left mb-4">
                              <p className="text-[11px] font-bold text-primary font-label-caps uppercase tracking-wider mb-1">MÜHENDİSLİK ANALİZİ</p>
                              <ul className="list-disc pl-4 space-y-1">
                                {rec.reasons.map((reason, rIdx) => (
                                  <li key={rIdx} className="text-[12px] text-secondary leading-relaxed font-medium">
                                    {reason}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <Link
                              href={`/urun/${productSlug(p)}`}
                              className="bg-slate-gray text-white px-5 py-2.5 rounded font-label-caps text-[11px] font-bold hover:bg-primary transition-all decoration-none"
                            >
                              DETAYLARI İNCELE →
                            </Link>
                            <button
                              onClick={() => handleAddToBasket(p.id)}
                              className={`px-5 py-2.5 rounded font-label-caps text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                                inBasket
                                  ? "bg-primary text-white border-primary"
                                  : "bg-white text-secondary border-border-subtle hover:border-primary hover:text-primary"
                              }`}
                            >
                              <span className="material-symbols-outlined text-[16px]">compare_arrows</span>
                              {inBasket ? "SEPETTEN ÇIKAR" : "SEPETE / KIYASLAMAYA EKLE"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-10 bg-white border border-border-subtle rounded-2xl">
                  <span className="material-symbols-outlined text-secondary text-5xl mb-3">error_outline</span>
                  <p className="text-secondary font-body-lg">
                    Kriterlerinize uygun bir alet bulunamadı. Lütfen daha esnek kriterlerle sihirbazı tekrar başlatın.
                  </p>
                </div>
              )}
            </section>
          )}

        </div>
      </div>
    </main>
  );
}
