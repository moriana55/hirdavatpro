"use client";

import { useState } from "react";
import Link from "next/link";

interface LineProduct {
  id: string;
  brand: string;
  model: string;
  priceRange?: string;
}

interface KitLine {
  category: string;
  categoryLabel: string;
  rol: "alet" | "sarf" | "guvenlik";
  neden: string;
  products: LineProduct[];
}

interface KitResp {
  mode: "ai" | "kural";
  baslik: string;
  ozet: string;
  lines: KitLine[];
  error?: string;
}

const ROL_LABEL: Record<string, { label: string; icon: string; cls: string }> = {
  alet: { label: "Ana Alet", icon: "build", cls: "bg-primary/10 text-primary" },
  sarf: { label: "Sarf Malzeme", icon: "category", cls: "bg-tertiary/10 text-tertiary" },
  guvenlik: { label: "İş Güvenliği", icon: "health_and_safety", cls: "bg-warning-amber/10 text-warning-amber" },
};

const EXAMPLES = [
  "Banyo fayansı değiştireceğim",
  "Salonu boyayacağım",
  "Mutfağa priz ekleyeceğim",
  "Bahçe çitini budayacağım",
  "Demir korkuluk kaynaklayacağım",
];

const productSlug = (p: { brand: string; model: string }) =>
  `${p.brand}-${p.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

function addToBasket(ids: string[]): { added: number; full: boolean } {
  try {
    let basket: string[] = JSON.parse(localStorage.getItem("hirdavatpro_basket") || "[]");
    let added = 0;
    let full = false;
    for (const id of ids) {
      if (basket.includes(id)) continue;
      if (basket.length >= 3) { full = true; break; }
      basket = [...basket, id];
      added++;
    }
    localStorage.setItem("hirdavatpro_basket", JSON.stringify(basket));
    window.dispatchEvent(new Event("hirdavatpro_basket_change"));
    return { added, full };
  } catch {
    return { added: 0, full: false };
  }
}

export function ProjeSihirbaziClient() {
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [kit, setKit] = useState<KitResp | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const run = async (text: string) => {
    const value = text.trim();
    if (!value) {
      setError("Lütfen yapacağınız işi yazın.");
      return;
    }
    setLoading(true);
    setError(null);
    setKit(null);
    try {
      const r = await fetch("/api/project-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: value }),
      });
      const data: KitResp = await r.json();
      if (!r.ok) setError(data.error || "Bir hata oluştu.");
      else setKit(data);
    } catch {
      setError("Sunucuya ulaşılamadı.");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Tüm satırlardaki ilk eşleşen ürünleri sepete ekle.
  const addAll = () => {
    if (!kit) return;
    const firstIds = kit.lines.map((l) => l.products[0]?.id).filter((x): x is string => !!x);
    const { added, full } = addToBasket(firstIds);
    showToast(
      full
        ? `Karşılaştırma sepeti en fazla 3 ürün alır. ${added} ürün eklendi.`
        : added > 0
        ? `${added} ürün karşılaştırma sepetine eklendi.`
        : "Eklenecek yeni ürün bulunamadı."
    );
  };

  const addOne = (id: string) => {
    const { added, full } = addToBasket([id]);
    showToast(full ? "Sepet dolu (maks 3 ürün)." : added ? "Sepete eklendi." : "Zaten sepette.");
  };

  return (
    <div className="space-y-8">
      {/* Input */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 shadow-sm">
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
          maxLength={500}
          placeholder="Örn: Banyo fayansı değiştireceğim, eski fayansları söküp yenilerini döşeyeceğim."
          className="w-full bg-white border border-border-subtle rounded-xl p-4 text-body-md focus:outline-none focus:border-primary resize-none"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => { setDesc(ex); run(ex); }}
              className="bg-surface-container px-3 py-1.5 rounded-full text-[12px] font-medium text-secondary hover:text-primary hover:bg-primary/10 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>
        {error && (
          <p className="mt-3 text-error font-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>{error}
          </p>
        )}
        <button
          onClick={() => run(desc)}
          disabled={loading}
          className="mt-4 w-full md:w-auto bg-primary text-white py-3.5 px-10 rounded font-label-caps text-label-caps font-bold hover:bg-primary/95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>HAZIRLANIYOR…</>
          ) : (
            <><span className="material-symbols-outlined text-[18px]">auto_awesome</span>SEPETİ ÇIKAR</>
          )}
        </button>
      </div>

      {/* Result */}
      {kit && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label-caps text-[11px] text-secondary font-bold uppercase">
                {kit.mode === "ai" ? "Yapay zekâ önerisi" : "Uzman kural önerisi"}
              </span>
              <h2 className="font-headline-md text-headline-md font-bold">{kit.baslik}</h2>
              <p className="text-secondary font-body-md max-w-2xl mt-1">{kit.ozet}</p>
            </div>
            <button
              onClick={addAll}
              className="shrink-0 bg-compare-action text-white py-3 px-6 rounded font-label-caps text-label-caps font-bold hover:opacity-95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add_shopping_cart</span>
              HEPSİNİ SEPETE EKLE
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {kit.lines.map((line, i) => {
              const meta = ROL_LABEL[line.rol] || ROL_LABEL.alet;
              return (
                <div key={`${line.category}-${i}`} className="bg-white border border-border-subtle rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-title-sm text-title-sm font-bold">{line.categoryLabel}</h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${meta.cls}`}>
                      <span className="material-symbols-outlined text-[14px]">{meta.icon}</span>
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-secondary text-body-sm mb-3">{line.neden}</p>
                  {line.products.length > 0 ? (
                    <div className="space-y-2">
                      {line.products.map((p) => (
                        <div key={p.id} className="flex items-center justify-between gap-2 bg-surface-container-low rounded-lg p-2.5">
                          <Link href={`/urun/${productSlug(p)}`} className="decoration-none min-w-0">
                            <span className="text-[10px] font-bold text-secondary uppercase block">{p.brand}</span>
                            <span className="text-[13px] font-bold text-on-surface line-clamp-1">{p.model}</span>
                          </Link>
                          <button
                            onClick={() => addOne(p.id)}
                            className="shrink-0 bg-primary text-white px-2.5 py-1.5 rounded text-[11px] font-bold hover:bg-primary/90 flex items-center gap-1"
                          >
                            <span className="material-symbols-outlined text-[14px]">add</span>EKLE
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary/60 text-[12px] italic">
                      Bu kategoride şu an katalogda ürün yok.
                      <Link href={`/kategori/${line.category}`} className="text-primary ml-1 hover:underline not-italic">Kategoriye git →</Link>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center pt-2">
            <Link href="/karsilastirma/sepet" className="text-primary font-bold hover:underline font-label-caps text-label-caps flex items-center gap-1">
              <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
              KARŞILAŞTIRMA SEPETİNE GİT →
            </Link>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-white px-5 py-3 rounded-lg shadow-lg font-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-compare-action">check_circle</span>
          {toast}
        </div>
      )}
    </div>
  );
}
