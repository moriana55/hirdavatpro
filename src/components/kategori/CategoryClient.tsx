"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import type { Product, Comparison } from "@/lib/products/types";
import { CATEGORY_LABELS } from "@/lib/products/types";
import { CompareButton } from "@/components/karsilastirma/CompareButton";

const productSlug = (p: Pick<Product, "brand" | "model">): string => {
  return `${p.brand}-${p.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
};

interface CategoryClientProps {
  slug: string;
  categoryLabel: string;
  groupLabel: string;
  products: Product[];
  comparisons: Comparison[];
  siblingCats: string[];
}

export function CategoryClient({
  slug,
  categoryLabel,
  groupLabel,
  products,
  comparisons,
  siblingCats,
}: CategoryClientProps) {
  // Filtre durumları
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedVoltage, setSelectedVoltage] = useState<string | null>(null);
  const [selectedMotorType, setSelectedMotorType] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("En Çok İncelenenler");

  // Dinamik olarak bu kategorideki ürünlerden markaları çıkaralım
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brands.add(p.brand);
    });
    return Array.from(brands).sort();
  }, [products]);

  // Dinamik olarak voltaj değerlerini çıkaralım (spec'lerde voltaj içeren alanları bulalım)
  const availableVoltages = useMemo(() => {
    const voltages = new Set<string>();
    products.forEach((p) => {
      // Specs içinde voltaj, akü voltajı gibi anahtarları ara
      Object.entries(p.specs).forEach(([k, v]) => {
        const keyLower = k.toLowerCase();
        if (keyLower.includes("volt") || keyLower.includes("gerilim")) {
          const valStr = String(v).toUpperCase();
          if (valStr.includes("12")) voltages.add("12V");
          else if (valStr.includes("18")) voltages.add("18V");
          else if (valStr.includes("36")) voltages.add("36V");
          else if (valStr.includes("54")) voltages.add("54V");
        }
      });
    });
    return Array.from(voltages).sort();
  }, [products]);

  // Dinamik olarak motor tiplerini çıkaralım
  const availableMotorTypes = useMemo(() => {
    const types = new Set<string>();
    products.forEach((p) => {
      Object.entries(p.specs).forEach(([k, v]) => {
        const keyLower = k.toLowerCase();
        if (keyLower.includes("motor")) {
          const valStr = String(v).toLowerCase();
          if (valStr.includes("kömürsüz") || valStr.includes("brushless") || valStr.includes("biturbo")) {
            types.add("Kömürsüz (Brushless)");
          } else if (valStr.includes("kömürlü") || valStr.includes("fırçalı")) {
            types.add("Kömürlü");
          }
        }
      });
    });
    return Array.from(types);
  }, [products]);

  // Filtreleme mantığı
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Marka Filtresi
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Voltaj Filtresi
    if (selectedVoltage) {
      const volNum = selectedVoltage.replace("V", "");
      result = result.filter((p) => {
        return Object.entries(p.specs).some(([k, v]) => {
          const keyLower = k.toLowerCase();
          if (keyLower.includes("volt") || keyLower.includes("gerilim")) {
            return String(v).includes(volNum);
          }
          return false;
        });
      });
    }

    // Motor Tipi Filtresi
    if (selectedMotorType) {
      const isBrushless = selectedMotorType.includes("Kömürsüz");
      result = result.filter((p) => {
        return Object.entries(p.specs).some(([k, v]) => {
          const keyLower = k.toLowerCase();
          if (keyLower.includes("motor")) {
            const valStr = String(v).toLowerCase();
            const hasBrushlessKeyword = valStr.includes("kömürsüz") || valStr.includes("brushless") || valStr.includes("biturbo");
            return isBrushless ? hasBrushlessKeyword : !hasBrushlessKeyword;
          }
          return false;
        });
      });
    }

    // Sıralama mantığı
    if (sortBy === "Performans (Yüksekten Düşüğe)") {
      result.sort((x, y) => {
        // Tork veya Güç gibi performans verilerini sayısal olarak bulmaya çalışalım
        const getPerfScore = (p: Product) => {
          let score = 0;
          Object.entries(p.specs).forEach(([k, v]) => {
            const keyLower = k.toLowerCase();
            if (keyLower.includes("tork") || keyLower.includes("güç") || keyLower.includes("watt") || keyLower.includes("darbe enerjisi")) {
              const num = parseFloat(String(v).replace(/[^0-9.]/g, ""));
              if (!isNaN(num)) score = Math.max(score, num);
            }
          });
          return score;
        };
        return getPerfScore(y) - getPerfScore(x);
      });
    } else if (sortBy === "Ağırlık (Düşükten Yükseğe)") {
      result.sort((x, y) => {
        const getWeight = (p: Product) => {
          let w = 999;
          Object.entries(p.specs).forEach(([k, v]) => {
            if (k.toLowerCase().includes("ağırlık")) {
              const num = parseFloat(String(v).replace(/[^0-9.]/g, ""));
              if (!isNaN(num)) w = num;
            }
          });
          return w;
        };
        return getWeight(x) - getWeight(y);
      });
    }

    return result;
  }, [products, selectedBrands, selectedVoltage, selectedMotorType, sortBy]);

  // Marka seçme/kaldırma
  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  // Tüm filtreleri temizle
  const handleResetFilters = () => {
    setSelectedBrands([]);
    setSelectedVoltage(null);
    setSelectedMotorType(null);
  };

  return (
    <main className="max-w-max-width mx-auto px-margin-desktop py-12 flex flex-col md:flex-row gap-gutter pt-32">
      {/* Technical Filters Sidebar (Left) */}
      <aside className="w-full md:w-64 flex-shrink-0 space-y-8">
        <div className="flex items-center justify-between border-b border-border-subtle pb-4">
          <h2 className="font-title-md text-title-md text-on-surface font-bold">Teknik Filtreler</h2>
          {(selectedBrands.length > 0 || selectedVoltage || selectedMotorType) && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-primary hover:underline font-bold"
            >
              Temizle
            </button>
          )}
          <span className="material-symbols-outlined text-secondary">tune</span>
        </div>

        {/* Filter Group: Brand */}
        {availableBrands.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-label-caps text-label-caps text-slate-gray font-bold">MARKA</h3>
            <div className="space-y-2">
              {availableBrands.map((brand) => (
                <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="w-5 h-5 rounded-sm border-2 border-border-subtle text-primary focus:ring-primary accent-primary"
                  />
                  <span className="font-body-sm text-body-sm group-hover:text-primary transition-colors text-on-background">
                    {brand}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Filter Group: Voltage */}
        {availableVoltages.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-label-caps text-label-caps text-slate-gray font-bold">VOLTAJ (V)</h3>
            <div className="grid grid-cols-2 gap-2">
              {availableVoltages.map((vol) => {
                const isSelected = selectedVoltage === vol;
                return (
                  <button
                    key={vol}
                    onClick={() => setSelectedVoltage(isSelected ? null : vol)}
                    className={`py-2 rounded font-spec-data text-spec-data transition-all border-2 ${
                      isSelected
                        ? "border-primary bg-primary-fixed text-primary font-bold"
                        : "border-border-subtle hover:border-primary hover:text-primary bg-white text-secondary"
                    }`}
                  >
                    {vol}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter Group: Motor Type */}
        {availableMotorTypes.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-label-caps text-label-caps text-slate-gray font-bold">MOTOR TİPİ</h3>
            <div className="space-y-2">
              {availableMotorTypes.map((type) => {
                const isSelected = selectedMotorType === type;
                return (
                  <label
                    key={type}
                    onClick={() => setSelectedMotorType(isSelected ? null : type)}
                    className="flex items-center space-x-3 cursor-pointer group"
                  >
                    <input
                      type="radio"
                      checked={isSelected}
                      readOnly
                      className="w-5 h-5 border-2 border-border-subtle text-primary focus:ring-primary accent-primary"
                    />
                    <span className="font-body-sm text-body-sm group-hover:text-primary transition-colors text-on-background">
                      {type}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </aside>

      {/* Product Listing Grid */}
      <section className="flex-1">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-border-subtle pb-4">
          <div>
            <span className="badge badge-accent mb-2">{groupLabel || "Kategori"}</span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold">{categoryLabel}</h1>
            <p className="font-body-sm text-body-sm text-secondary">
              {filteredProducts.length} ürün listeleniyor
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-label-caps text-label-caps text-slate-gray font-bold">SIRALA:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none font-body-sm text-body-sm text-primary focus:ring-0 cursor-pointer font-bold"
            >
              <option value="En Çok İncelenenler">En Çok İncelenenler</option>
              <option value="Performans (Yüksekten Düşüğe)">Performans (Yüksekten Düşüğe)</option>
              <option value="Ağırlık (Düşükten Yükseğe)">Ağırlık (Düşükten Yükseğe)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Bento-style Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {filteredProducts.map((p) => {
              const specList = Object.entries(p.specs).slice(0, 3);
              return (
                <article
                  key={p.id}
                  className="bg-surface-container-lowest border border-border-subtle group hover:border-primary hover:shadow-lg transition-all duration-300 flex flex-col h-full rounded overflow-hidden"
                >
                  <div className="relative overflow-hidden aspect-square bg-white p-6 flex items-center justify-center border-b border-border-subtle/50">
                    <img
                      alt={`${p.brand} ${p.model}`}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                      src={p.imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuA5m42AzDr3y1U___uU6NdqHcVSsRGFiQcP_CEu-8Ck7TorGju3xxAo-nxgKVCuTsnwYTIugRWy2FncNbBqfVliAgETsT2XayQNILCVbCCaQyiquhufpPGDIrLUdbUxqq7qsjy53G4ET677CEdQ5X9eq7TkMtUGb5gShKY8z7aRKzaxuVI-ltuDXhdW9CLaPO5ir9w-GQEDD8sA8Rgzx67lEhiR7YrbFI_S1p81T3oZ_W5AFIOmi3elRIRSjVKzB1g5pRidXLenx8E"}
                    />
                    <CompareButton productId={p.id} />
                  </div>
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex items-center mb-2">
                        <span className="bg-surface-container text-slate-gray px-2 py-0.5 font-label-caps text-[10px] rounded uppercase font-bold">
                          {p.brand}
                        </span>
                      </div>
                      <h3 className="font-title-md text-title-md text-on-surface mb-4 line-clamp-2 font-bold h-14 overflow-hidden">
                        {p.model}
                      </h3>
                      {/* Specs */}
                      {specList.length > 0 && (
                        <div className="space-y-2 mb-6">
                          {specList.map(([k, v]) => (
                            <div key={k} className="flex justify-between border-b border-surface-container-low pb-1">
                              <span className="font-body-sm text-body-sm text-secondary">{k}</span>
                              <span className="font-spec-data text-spec-data text-on-surface font-bold">
                                {String(v)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <Link
                      href={`/urun/${productSlug(p)}`}
                      className="w-full bg-slate-gray text-white py-3 font-label-caps text-label-caps group-hover:bg-primary transition-colors flex items-center justify-center space-x-2 rounded decoration-none font-bold"
                    >
                      <span>İncele</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-border-subtle rounded">
            <span className="material-symbols-outlined text-secondary text-5xl mb-4">info</span>
            <p className="font-body-lg text-secondary">
              Seçilen filtrelere uygun alet bulunamadı.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 text-primary font-bold font-label-caps text-label-caps hover:underline"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        )}

        {/* Dynamic Comparisons Section in Category */}
        {comparisons.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border-subtle">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--muted-faint)] mb-5 font-bold">
              Bu Kategorideki Analizler ({comparisons.length})
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {comparisons.map((c) => {
                const a = products.find((p) => p.id === c.productA);
                const b = products.find((p) => p.id === c.productB);
                if (!a || !b) return null;
                return (
                  <Link
                    key={c.id}
                    href={`/karsilastirma/${c.slug}`}
                    className="bg-white border border-border-subtle p-5 hover:border-primary transition-colors duration-200 flex flex-col justify-between h-full rounded decoration-none group"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 text-[15px] font-semibold text-[var(--foreground)] group-hover:text-primary transition-colors">
                        <span>{a.brand} {a.model}</span>
                        <span className="bg-compare-action/10 text-compare-action px-2 py-0.5 text-[9px] rounded font-bold">VS</span>
                        <span>{b.brand} {b.model}</span>
                      </div>
                      {c.verdict && (
                        <p className="mt-2.5 text-[13px] text-secondary leading-relaxed line-clamp-2">
                          {c.verdict}
                        </p>
                      )}
                    </div>
                    <span className="mt-4 block text-[12px] font-semibold text-primary group-hover:text-accent-hover transition-colors font-bold">
                      Detaylı karşılaştırma →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Sibling Categories */}
        {siblingCats.length > 0 && (
          <div className="mt-16 pt-10 border-t border-border-subtle">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--muted-faint)] mb-5 font-bold">
              İlişkili Diğer Kategoriler
            </p>
            <div className="flex flex-wrap gap-2">
              {siblingCats.map((cat) => (
                <Link
                  key={cat}
                  href={`/kategori/${cat}`}
                  className="rounded border border-border-subtle bg-white px-3.5 py-2 text-[12px] font-medium text-secondary transition-all hover:border-primary hover:text-primary decoration-none font-bold"
                >
                  {CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
