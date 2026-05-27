"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Package, BarChart3 } from "lucide-react";
import { SEED_CATALOG } from "@/lib/products/seed-catalog";
import { CATEGORY_LABELS } from "@/lib/products/types";
import type { ProductCategory } from "@/lib/products/types";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (q.length < 2) return { products: [], pairs: [] };

    const words = q.split(/\s+/);

    const products = SEED_CATALOG.filter(p => {
      const text = `${p.brand} ${p.model} ${CATEGORY_LABELS[p.category as ProductCategory] || p.category}`.toLowerCase();
      return words.every(w => text.includes(w));
    }).slice(0, 20);

    const pairs: { a: typeof SEED_CATALOG[0]; b: typeof SEED_CATALOG[0] }[] = [];
    if (q.includes("vs") || q.includes(" - ")) {
      const parts = q.split(/\s+vs\s+|\s+-\s+/);
      if (parts.length === 2) {
        const left = parts[0].trim();
        const right = parts[1].trim();
        const leftMatches = SEED_CATALOG.filter(p => `${p.brand} ${p.model}`.toLowerCase().includes(left));
        const rightMatches = SEED_CATALOG.filter(p => `${p.brand} ${p.model}`.toLowerCase().includes(right));
        for (const a of leftMatches.slice(0, 3)) {
          for (const b of rightMatches.slice(0, 3)) {
            if (a.category === b.category) pairs.push({ a, b });
          }
        }
      }
    }

    return { products, pairs: pairs.slice(0, 6) };
  }, [query]);

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

  return (
    <div className="mx-auto max-w-4xl px-4 py-14 md:px-6 md:py-20">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
        Ara<span className="text-orange-600">ma</span>
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Ürün, marka veya &quot;bosch vs makita&quot; şeklinde karşılaştırma arayın
      </p>

      <div className="mt-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Marka, model veya kategori ara..."
          autoFocus
          className="w-full rounded-lg border border-zinc-300 bg-zinc-50 py-3.5 pl-12 pr-4 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 transition"
        />
      </div>

      {query.length < 2 && (
        <div className="mt-12 text-center text-sm text-zinc-400">
          En az 2 karakter yazın...
        </div>
      )}

      {query.length >= 2 && results.products.length === 0 && results.pairs.length === 0 && (
        <div className="mt-12 text-center text-sm text-zinc-400">
          &quot;{query}&quot; için sonuç bulunamadı.
        </div>
      )}

      {results.pairs.length > 0 && (
        <div className="mt-8">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
            <BarChart3 className="size-3.5" /> Karşılaştırmalar
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {results.pairs.map(({ a, b }, i) => {
              const compSlug = `${slugify(a.brand + "-" + a.model)}-vs-${slugify(b.brand + "-" + b.model)}`;
              return (
                <Link
                  key={i}
                  href={`/karsilastirma/${compSlug}`}
                  className="group rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition hover:border-zinc-300 hover:bg-zinc-100"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-zinc-800">
                    <span>{a.brand} {a.model}</span>
                    <span className="text-orange-600 font-bold">vs</span>
                    <span>{b.brand} {b.model}</span>
                  </div>
                  <span className="mt-2 block text-[10px] text-zinc-400">
                    {CATEGORY_LABELS[a.category as ProductCategory]}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {results.products.length > 0 && (
        <div className="mt-8">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-3 flex items-center gap-2">
            <Package className="size-3.5" /> Ürünler ({results.products.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {results.products.map(p => (
              <Link
                key={`${p.brand}-${p.model}`}
                href={`/urun/${slugify(p.brand + "-" + p.model)}`}
                className="group rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition hover:border-zinc-300 hover:bg-zinc-100"
              >
                <p className="text-sm font-medium text-zinc-800 group-hover:text-orange-600 transition">
                  {p.brand} {p.model}
                </p>
                <p className="mt-1 text-[11px] text-zinc-400">
                  {CATEGORY_LABELS[p.category as ProductCategory]}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
