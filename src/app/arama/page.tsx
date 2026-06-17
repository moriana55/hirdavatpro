"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Package, BarChart3, Loader2 } from "lucide-react";
import { CATEGORY_LABELS } from "@/lib/products/types";
import type { ProductCategory } from "@/lib/products/types";

interface Product { id: string; brand: string; model: string; category: string; }

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return { products: [], pairs: [] };
    const words = q.split(/\s+/);

    const matched = products.filter(p => {
      const text = `${p.brand} ${p.model} ${CATEGORY_LABELS[p.category as ProductCategory] || p.category}`.toLowerCase();
      return words.every(w => text.includes(w));
    }).slice(0, 20);

    const pairs: { a: Product; b: Product }[] = [];
    if (q.includes("vs") || q.includes(" - ")) {
      const parts = q.split(/\s+vs\s+|\s+-\s+/);
      if (parts.length === 2) {
        const left = parts[0].trim();
        const right = parts[1].trim();
        const leftM = products.filter(p => `${p.brand} ${p.model}`.toLowerCase().includes(left));
        const rightM = products.filter(p => `${p.brand} ${p.model}`.toLowerCase().includes(right));
        for (const a of leftM.slice(0, 3)) {
          for (const b of rightM.slice(0, 3)) {
            if (a.category === b.category) pairs.push({ a, b });
          }
        }
      }
    }

    return { products: matched, pairs: pairs.slice(0, 6) };
  }, [query, products]);

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
      <p className="text-[12px] font-semibold uppercase tracking-wider text-secondary mb-1">Ürün & Karşılaştırma</p>
      <h1 className="font-display-lg text-display-lg text-on-surface">Arama</h1>
      <p className="mt-3 text-secondary font-body-lg">
        Ürün, marka veya &quot;bosch vs makita&quot; şeklinde karşılaştırma arayın
      </p>

      <div className="mt-10 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-secondary" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Marka, model veya kategori ara..."
          autoFocus
          className="w-full pl-12 pr-4 py-4 rounded-lg border border-border-subtle bg-white text-on-surface text-[15px] focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {loading && (
        <div className="mt-16 flex justify-center">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      )}

      {!loading && query.length < 2 && (
        <div className="mt-16 text-center">
          <p className="text-secondary font-body-lg mb-6">{products.length} ürün içinde ara</p>
          <div className="flex flex-wrap justify-center gap-2">
            {["Bosch", "Makita", "DeWalt", "Milwaukee", "Metabo", "Stihl"].map(b => (
              <button key={b} onClick={() => setQuery(b)}
                className="rounded-lg border border-border-subtle bg-white px-4 py-2 text-sm font-medium text-secondary hover:border-primary hover:text-primary transition-all">
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {!loading && query.length >= 2 && results.products.length === 0 && results.pairs.length === 0 && (
        <div className="mt-16 text-center text-secondary font-body-lg">
          &quot;{query}&quot; için sonuç bulunamadı.
        </div>
      )}

      {results.pairs.length > 0 && (
        <div className="mt-10">
          <p className="text-[12px] font-bold uppercase tracking-wider text-secondary mb-4 flex items-center gap-2">
            <BarChart3 className="size-3.5" /> Karşılaştırmalar
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {results.pairs.map(({ a, b }, i) => {
              const slug = `${slugify(a.brand + "-" + a.model)}-vs-${slugify(b.brand + "-" + b.model)}`;
              return (
                <Link key={i} href={`/karsilastirma/${slug}`}
                  className="bg-white border border-border-subtle rounded p-5 hover:border-primary transition-colors flex items-center gap-2.5">
                  <span className="text-sm font-semibold text-on-surface">{a.brand} {a.model}</span>
                  <span className="bg-primary/10 text-primary px-2 py-0.5 text-[10px] rounded font-bold">VS</span>
                  <span className="text-sm font-semibold text-on-surface">{b.brand} {b.model}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {results.products.length > 0 && (
        <div className="mt-10">
          <p className="text-[12px] font-bold uppercase tracking-wider text-secondary mb-4 flex items-center gap-2">
            <Package className="size-3.5" /> Ürünler ({results.products.length})
          </p>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {results.products.map(p => (
              <Link key={p.id} href={`/urun/${slugify(p.brand + "-" + p.model)}`}
                className="bg-white border border-border-subtle rounded p-4 hover:border-primary transition-colors group">
                <p className="text-sm font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {p.brand} {p.model}
                </p>
                <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
                  {CATEGORY_LABELS[p.category as ProductCategory] || p.category}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
