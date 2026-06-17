"use client";

import Link from "next/link";
import { useState } from "react";
import { Scale, Check, ArrowRight } from "lucide-react";
import type { ShoppableProduct } from "@/lib/blog/commerce";

const productSlug = (p: { brand: string; model: string }) =>
  `${p.brand}-${p.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

export function BlogUrunSeridi({ products }: { products: ShoppableProduct[] }) {
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  if (!products || products.length === 0) return null;

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2500); };

  const addToBasket = (id: string) => {
    try {
      let basket: string[] = JSON.parse(localStorage.getItem("hirdavatpro_basket") || "[]");
      if (basket.includes(id)) { showToast("Bu alet zaten sepette."); return; }
      if (basket.length >= 3) { showToast("Karşılaştırma sepeti dolu (maks 3)."); return; }
      basket.push(id);
      localStorage.setItem("hirdavatpro_basket", JSON.stringify(basket));
      window.dispatchEvent(new Event("hirdavatpro_basket_change"));
      setAdded((a) => ({ ...a, [id]: true }));
      showToast("Karşılaştırma sepetine eklendi.");
    } catch { /* ignore */ }
  };

  return (
    <aside className="mt-14 rounded-2xl border border-orange-200 bg-orange-50/40 p-6">
      <div className="mb-5 flex items-center gap-2">
        <span className="rounded border border-orange-200 bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600">
          Bu işte geçen aletler
        </span>
        <p className="text-[11px] text-zinc-400">Katalogdan, bu rehberle ilgili öne çıkan aletler</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-3">
            <Link href={`/urun/${productSlug(p)}`} className="min-w-0 block">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400">{p.brand}</span>
              <span className="block truncate text-sm font-semibold text-zinc-800">{p.model}</span>
              {p.priceRange && <span className="block text-[11px] font-medium text-orange-600">{p.priceRange}</span>}
            </Link>
            <button
              onClick={() => addToBasket(p.id)}
              className={`shrink-0 inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[11px] font-bold transition ${
                added[p.id] ? "bg-emerald-500 text-white" : "bg-orange-600 text-white hover:bg-orange-700"
              }`}
            >
              {added[p.id] ? <Check className="size-3.5" /> : <Scale className="size-3.5" />}
              {added[p.id] ? "EKLENDİ" : "KARŞILAŞTIR"}
            </button>
          </div>
        ))}
      </div>

      <Link
        href="/karsilastirma/sepet"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-orange-600 transition hover:text-orange-700"
      >
        Karşılaştırma sepetine git <ArrowRight className="size-4" />
      </Link>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-zinc-900 px-5 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </aside>
  );
}
