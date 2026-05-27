"use client";

import { useEffect, useState } from "react";
import { Plus, Sparkles, Trash2, ArrowRightLeft, Loader2 } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/products/types";
import { CATEGORY_LABELS } from "@/lib/products/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [bulkInput, setBulkInput] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [selectedA, setSelectedA] = useState("");
  const [selectedB, setSelectedB] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    brand: "",
    model: "",
    category: "darbeli-matkap" as ProductCategory,
  });

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  async function handleAIAdd() {
    if (!form.brand || !form.model) return;
    setAiLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, useAI: true }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => [...prev, data.product]);
        setForm({ brand: "", model: "", category: "darbeli-matkap" });
        setAdding(false);
        setMessage(`✓ ${data.product.brand} ${data.product.model} eklendi`);
      }
    } catch (err: any) {
      setMessage(`Hata: ${err.message}`);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleBulkAdd() {
    const lines = bulkInput.trim().split("\n").filter(Boolean);
    if (lines.length === 0) return;
    setBulkLoading(true);
    setMessage("");

    let added = 0;
    for (const line of lines) {
      const parts = line.split("|").map((s) => s.trim());
      if (parts.length < 3) continue;
      const [brand, model, category] = parts;
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brand, model, category, useAI: true }),
        });
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => [...prev, data.product]);
          added++;
        }
      } catch {}
    }
    setMessage(`✓ ${added}/${lines.length} ürün eklendi`);
    setBulkInput("");
    setBulkLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Sil?")) return;
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleCompare() {
    if (!selectedA || !selectedB || selectedA === selectedB) return;
    setCompareLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productAId: selectedA, productBId: selectedB }),
      });
      const data = await res.json();
      if (data.success) {
        const label = data.existing ? "Zaten mevcut" : "Oluşturuldu";
        setMessage(`✓ Karşılaştırma ${label}: /karsilastirma/${data.comparison.slug}`);
      } else {
        setMessage(`Hata: ${data.error}`);
      }
    } catch (err: any) {
      setMessage(`Hata: ${err.message}`);
    } finally {
      setCompareLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="size-6 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-heading text-2xl font-semibold text-zinc-900">Ürün Yönetimi</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setAdding(!adding)}
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-orange-500 transition"
          >
            <Plus className="size-4" /> Ürün Ekle (AI)
          </button>
        </div>
      </div>

      {message && (
        <div className="mb-6 rounded-lg border border-orange-500/20 bg-orange-500/5 px-4 py-3 text-sm text-orange-500">
          {message}
        </div>
      )}

      {/* Add single product */}
      {adding && (
        <div className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50 p-6 space-y-4">
          <h2 className="text-sm font-bold text-zinc-400">AI ile Ürün Ekle</h2>
          <p className="text-xs text-zinc-500">Marka ve model gir, AI teknik spec&apos;leri otomatik çeksin.</p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <input
              placeholder="Marka (ör. Bosch)"
              className="rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-orange-500/50"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
            />
            <input
              placeholder="Model (ör. GSB 13 RE)"
              className="rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-orange-500/50"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
            />
            <select
              className="rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-orange-500/50"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
            >
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleAIAdd}
            disabled={aiLoading || !form.brand || !form.model}
            className="flex items-center gap-2 rounded-lg bg-orange-500/10 border border-orange-600/30 px-4 py-2 text-xs font-bold text-orange-500 hover:bg-orange-500/20 transition disabled:opacity-50"
          >
            <Sparkles className="size-4" />
            {aiLoading ? "AI çekiyor..." : "AI ile Spec Çek & Kaydet"}
          </button>
        </div>
      )}

      {/* Bulk add */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50 p-6 space-y-4">
        <h2 className="text-sm font-bold text-zinc-400">Toplu Ürün Ekle</h2>
        <p className="text-xs text-zinc-500">Her satıra: Marka | Model | Kategori (ör: Bosch | GSB 13 RE | darbeli-matkap)</p>
        <textarea
          className="w-full h-32 rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-sm text-zinc-800 outline-none focus:border-orange-500/50 font-mono"
          placeholder={"Bosch | GSB 13 RE | darbeli-matkap\nMakita | HP1630 | darbeli-matkap\nDeWalt | DWE560 | daire-testere"}
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
        />
        <button
          onClick={handleBulkAdd}
          disabled={bulkLoading || !bulkInput.trim()}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-orange-500 transition disabled:opacity-50"
        >
          {bulkLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
          {bulkLoading ? "İşleniyor..." : "Toplu AI Ekle"}
        </button>
      </div>

      {/* Compare tool */}
      <div className="mb-8 rounded-lg border border-zinc-200 bg-zinc-50 p-6 space-y-4">
        <h2 className="text-sm font-bold text-zinc-400 flex items-center gap-2">
          <ArrowRightLeft className="size-4 text-orange-600" /> Karşılaştırma Oluştur
        </h2>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <select
            className="rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-sm text-zinc-800 outline-none"
            value={selectedA}
            onChange={(e) => setSelectedA(e.target.value)}
          >
            <option value="">Ürün A seç...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.brand} {p.model}</option>
            ))}
          </select>
          <select
            className="rounded-lg border border-zinc-300 bg-zinc-100 px-3 py-2.5 text-sm text-zinc-800 outline-none"
            value={selectedB}
            onChange={(e) => setSelectedB(e.target.value)}
          >
            <option value="">Ürün B seç...</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.brand} {p.model}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleCompare}
          disabled={compareLoading || !selectedA || !selectedB || selectedA === selectedB}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-zinc-950 hover:bg-orange-500 transition disabled:opacity-50"
        >
          {compareLoading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRightLeft className="size-4" />}
          {compareLoading ? "AI yazıyor..." : "Karşılaştırma Üret"}
        </button>
      </div>

      {/* Product list */}
      <div className="space-y-2">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">
          Ürünler ({products.length})
        </h2>
        {products.map((p) => (
          <div key={p.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
            <div>
              <span className="text-sm font-medium text-zinc-800">{p.brand} {p.model}</span>
              <span className="ml-3 text-[10px] font-bold uppercase text-zinc-500">{CATEGORY_LABELS[p.category]}</span>
              {p.priceRange && <span className="ml-3 text-xs text-orange-600/80">{p.priceRange}</span>}
            </div>
            <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-zinc-800 transition">
              <Trash2 className="size-4 text-red-400/70" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
