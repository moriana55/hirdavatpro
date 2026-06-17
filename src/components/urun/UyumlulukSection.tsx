import Link from "next/link";
import { getCompatibility, findEquivalents } from "@/lib/compatibility";
import type { Product, ProductCategory } from "@/lib/products/types";
import { CATEGORY_LABELS } from "@/lib/products/types";

const productSlug = (p: Pick<Product, "brand" | "model">) =>
  `${p.brand}-${p.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

interface Props {
  product: Product;
  allProducts: Product[];
}

/**
 * Muadil / uyumluluk motoru (Feature 4) — ürün detayında gösterilen bölüm.
 * Saf heuristic motoru kullanır; veri yoksa zarifçe gizlenir.
 */
export function UyumlulukSection({ product, allProducts }: Props) {
  const compat = getCompatibility(product.category, product.specs, product.brand);
  const equivalents = findEquivalents(product, allProducts, 4);

  const hasAnything =
    compat.aksesuarlar.length > 0 || compat.bataryaNotu || equivalents.length > 0;
  if (!hasAnything) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border-subtle">
      <div className="mb-6">
        <h2 className="font-headline-md text-headline-md font-bold mb-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[28px]">hub</span>
          Bu Ürünle Uyumlu & Muadili
        </h2>
        <p className="text-secondary text-body-sm">
          {product.brand} {product.model} ile birlikte kullanabileceğiniz aksesuarlar ve alternatif modeller.
        </p>
      </div>

      {/* Belirleyici teknik anahtarlar */}
      {compat.belirleyiciler.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {compat.belirleyiciler.map((b) => (
            <span key={b.etiket} className="inline-flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full text-[12px] font-medium text-secondary">
              <span className="font-bold text-on-surface">{b.etiket}:</span> {b.deger}
            </span>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-gutter items-start">
        {/* Uyumlu aksesuar/sarf */}
        {compat.aksesuarlar.length > 0 && (
          <div>
            <h3 className="font-title-sm text-title-sm font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-tertiary">extension</span>
              Uyumlu Aksesuar & Sarf
            </h3>
            <div className="space-y-3">
              {compat.aksesuarlar.map((a, i) => {
                const inner = (
                  <div className="bg-white border border-border-subtle rounded-xl p-4 shadow-sm hover:border-primary transition-colors h-full">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-title-sm text-[15px] font-bold">{a.baslik}</h4>
                      {a.kategori && (
                        <span className="material-symbols-outlined text-primary text-[18px]">chevron_right</span>
                      )}
                    </div>
                    <p className="text-secondary text-body-sm leading-relaxed mt-1">{a.aciklama}</p>
                    {a.kategori && (
                      <span className="inline-block mt-2 text-[11px] font-bold text-primary uppercase tracking-wider">
                        {CATEGORY_LABELS[a.kategori] || a.kategori} →
                      </span>
                    )}
                  </div>
                );
                return a.kategori ? (
                  <Link key={i} href={`/kategori/${a.kategori}`} className="block decoration-none">{inner}</Link>
                ) : (
                  <div key={i}>{inner}</div>
                );
              })}
            </div>

            {compat.bataryaNotu && (
              <div className="mt-4 bg-tertiary/5 border border-tertiary/20 rounded-xl p-4 flex items-start gap-3">
                <span className="material-symbols-outlined text-tertiary text-[22px]">battery_charging_full</span>
                <div>
                  <p className="font-label-caps text-[11px] text-tertiary font-bold uppercase mb-1">Batarya / Platform Uyumu</p>
                  <p className="text-secondary text-body-sm leading-relaxed">{compat.bataryaNotu}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Muadil ürünler */}
        {equivalents.length > 0 && (
          <div>
            <h3 className="font-title-sm text-title-sm font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-tertiary">swap_horiz</span>
              Muadil / Alternatif Modeller
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {equivalents.map((e) => (
                <Link
                  key={e.id}
                  href={`/urun/${productSlug(e)}`}
                  className="bg-white border border-border-subtle rounded-xl p-4 shadow-sm hover:border-primary transition-colors decoration-none flex flex-col"
                >
                  <span className="text-[10px] font-bold text-secondary uppercase block">{e.brand}</span>
                  <span className="font-title-sm text-[15px] font-bold text-on-surface line-clamp-1">{e.model}</span>
                  {e.priceRange && <span className="text-primary font-bold text-body-sm mt-1">{e.priceRange}</span>}
                  <span className="mt-2 text-[11px] font-bold text-primary uppercase">Karşılaştır →</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-secondary/60 text-[11px] italic">
        Uyumluluk önerileri ürün teknik özelliklerinden türetilmiş genel kılavuzdur; kesin uyum için
        üretici kataloğunu kontrol edin.
      </p>
    </section>
  );
}
