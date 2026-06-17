"use client";

import { useEffect, useState, useMemo } from "react";
import { Sparkles, Trash2, ArrowRightLeft, Loader2, Search, ChevronDown, Image as ImageIcon } from "lucide-react";
import type { Product, ProductCategory } from "@/lib/products/types";
import { CATEGORY_LABELS } from "@/lib/products/types";

type Tab = "ekle" | "liste" | "karsilastir";

export default function AdminProductsPage() {
  const [tab, setTab] = useState<Tab>("ekle");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Tek ekleme
  const [form, setForm] = useState({ brand: "", model: "", category: "darbeli-matkap" as ProductCategory });
  const [aiLoading, setAiLoading] = useState(false);

  // Toplu metin ekleme
  const [bulkInput, setBulkInput] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null);

  // Liste filtre
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  // Karşılaştırma
  const [selA, setSelA] = useState("");
  const [selB, setSelB] = useState("");
  const [cmpLoading, setCmpLoading] = useState(false);
  const [cmpResult, setCmpResult] = useState<string | null>(null);

  // Silme onay
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Görsel üretme
  const [imgLoading, setImgLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  const msg = (type: "ok" | "err", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  async function handleAIAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!form.brand || !form.model) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, useAI: true }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => [...prev, data.product]);
        setForm({ brand: "", model: "", category: "darbeli-matkap" });
        msg("ok", `✓ ${data.product.brand} ${data.product.model} eklendi`);
      } else {
        msg("err", data.error || "Hata");
      }
    } catch (err: any) {
      msg("err", err.message);
    } finally {
      setAiLoading(false);
    }
  }

  async function handleBulkAdd() {
    const lines = bulkInput.trim().split("\n").filter(Boolean);
    if (!lines.length) return;
    setBulkLoading(true);
    setBulkProgress({ done: 0, total: lines.length });
    let added = 0;
    for (let i = 0; i < lines.length; i++) {
      const parts = lines[i].split("|").map(s => s.trim());
      if (parts.length < 3) { setBulkProgress({ done: i + 1, total: lines.length }); continue; }
      const [brand, model, category] = parts;
      try {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ brand, model, category, useAI: true }),
        });
        const data = await res.json();
        if (data.success) { setProducts(prev => [...prev, data.product]); added++; }
      } catch {}
      setBulkProgress({ done: i + 1, total: lines.length });
    }
    msg("ok", `✓ ${added}/${lines.length} ürün eklendi`);
    setBulkInput("");
    setBulkLoading(false);
    setBulkProgress(null);
  }

  async function handleDelete(id: string) {
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteId(null);
    msg("ok", "Ürün silindi");
  }

  async function handleGenerateImage(product: Product) {
    setImgLoading(product.id);
    try {
      const res = await fetch("/api/products/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, brand: product.brand, model: product.model, category: product.category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, imageUrl: data.imageUrl } : p));
      msg("ok", "Görsel üretildi!");
    } catch (e: any) {
      msg("err", e.message || "Görsel üretilemedi");
    } finally {
      setImgLoading(null);
    }
  }

  async function handleCompare(e: React.FormEvent) {
    e.preventDefault();
    if (!selA || !selB || selA === selB) return;
    setCmpLoading(true);
    setCmpResult(null);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productAId: selA, productBId: selB }),
      });
      const data = await res.json();
      if (data.success) {
        setCmpResult(`/karsilastirma/${data.comparison.slug}`);
        msg("ok", data.existing ? "Zaten mevcut" : "Karşılaştırma oluşturuldu");
      } else {
        msg("err", data.error || "Hata");
      }
    } catch (err: any) {
      msg("err", err.message);
    } finally {
      setCmpLoading(false);
    }
  }

  const filtered = useMemo(() => products.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q || p.brand.toLowerCase().includes(q) || p.model.toLowerCase().includes(q);
    const matchCat = catFilter === "all" || p.category === catFilter;
    return matchSearch && matchCat;
  }), [products, search, catFilter]);

  const categories = useMemo(() => [...new Set(products.map(p => p.category))].sort(), [products]);

  const TABS: { id: Tab; label: string }[] = [
    { id: "ekle", label: "Ürün Ekle" },
    { id: "liste", label: `Liste (${products.length})` },
    { id: "karsilastir", label: "Karşılaştırma Üret" },
  ];

  if (loading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="size-6 animate-spin text-orange-600" />
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold text-zinc-900">Ürün Yönetimi</h1>
        <p className="text-sm text-zinc-500 mt-1">AI ile ürün ekle, listele ve karşılaştırma üret</p>
      </div>

      {/* Toast */}
      {message && (
        <div className={`mb-6 rounded-lg border px-4 py-3 text-sm font-medium ${
          message.type === "ok"
            ? "border-green-500/20 bg-green-500/5 text-green-600"
            : "border-red-500/20 bg-red-500/5 text-red-500"
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-zinc-200">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              tab === t.id
                ? "border-orange-600 text-orange-600"
                : "border-transparent text-zinc-500 hover:text-zinc-700"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB: EKLE */}
      {tab === "ekle" && (
        <div className="space-y-6">
          {/* Tekli ekleme */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
            <h2 className="text-sm font-bold text-zinc-700 mb-1">Tekli Ürün Ekle</h2>
            <p className="text-xs text-zinc-400 mb-4">Marka + model gir, AI teknik spec'leri otomatik çeker.</p>
            <form onSubmit={handleAIAdd} className="flex flex-wrap gap-3 items-end">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Marka</label>
                <input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })}
                  placeholder="örn. Bosch"
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-orange-500 w-36" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Model</label>
                <input value={form.model} onChange={e => setForm({ ...form, model: e.target.value })}
                  placeholder="örn. GSB 13 RE"
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-orange-500 w-40" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Kategori</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as ProductCategory })}
                  className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-orange-500 w-52">
                  {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <button type="submit" disabled={aiLoading || !form.brand || !form.model}
                className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-500 transition disabled:opacity-50">
                {aiLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
                {aiLoading ? "AI çekiyor..." : "Ekle & Üret"}
              </button>
            </form>
          </div>

          {/* Toplu metin */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6">
            <h2 className="text-sm font-bold text-zinc-700 mb-1">Toplu Metin ile Ekle</h2>
            <p className="text-xs text-zinc-400 mb-1">Her satıra: <code className="bg-zinc-200 px-1 rounded text-[11px]">Marka | Model | kategori-slug</code></p>
            <p className="text-xs text-zinc-400 mb-4">Örnek: <code className="bg-zinc-200 px-1 rounded text-[11px]">Bosch | GSB 13 RE | darbeli-matkap</code></p>
            <textarea value={bulkInput} onChange={e => setBulkInput(e.target.value)}
              rows={6}
              placeholder={"Bosch | GSB 13 RE | darbeli-matkap\nMakita | HP1630 | darbeli-matkap\nDeWalt | DWE560 | daire-testere"}
              className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-orange-500 font-mono mb-3" />
            {bulkProgress && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                  <span>İşleniyor...</span>
                  <span>{bulkProgress.done}/{bulkProgress.total}</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-200 overflow-hidden">
                  <div className="h-full bg-orange-500 transition-all rounded-full"
                    style={{ width: `${(bulkProgress.done / bulkProgress.total) * 100}%` }} />
                </div>
              </div>
            )}
            <button onClick={handleBulkAdd} disabled={bulkLoading || !bulkInput.trim()}
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-500 transition disabled:opacity-50">
              {bulkLoading ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {bulkLoading ? `İşleniyor (${bulkProgress?.done}/${bulkProgress?.total})...` : "Toplu Ekle & Üret"}
            </button>
          </div>
        </div>
      )}

      {/* TAB: LİSTE */}
      {tab === "liste" && (
        <div>
          {/* Filtreler */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Marka veya model ara..."
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-900 outline-none focus:border-orange-500" />
            </div>
            <div className="relative">
              <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                className="appearance-none rounded-lg border border-zinc-200 bg-white pl-3 pr-8 py-2 text-sm text-zinc-700 outline-none focus:border-orange-500">
                <option value="all">Tüm Kategoriler</option>
                {categories.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c as ProductCategory]}</option>)}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400 pointer-events-none" />
            </div>
            <span className="self-center text-xs text-zinc-400">{filtered.length} ürün</span>
          </div>

          {/* Liste */}
          <div className="space-y-1.5">
            {filtered.length === 0 && (
              <p className="text-center text-sm text-zinc-400 py-12">Sonuç bulunamadı</p>
            )}
            {filtered.map(p => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 hover:border-zinc-300 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  {p.imageUrl ? (
                    <img src={p.imageUrl} alt="" className="w-10 h-10 rounded object-cover border border-zinc-100 flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-zinc-100 flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="size-4 text-zinc-300" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-zinc-800">{p.brand} {p.model}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{CATEGORY_LABELS[p.category as ProductCategory] || p.category}</span>
                      {p.priceRange && <span className="text-[10px] text-orange-600 font-medium">{p.priceRange}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleGenerateImage(p)}
                    disabled={imgLoading === p.id}
                    title="DALL-E ile görsel üret"
                    className="p-1.5 rounded-lg hover:bg-orange-50 text-zinc-300 hover:text-orange-500 transition disabled:opacity-40"
                  >
                    {imgLoading === p.id ? <Loader2 className="size-4 animate-spin text-orange-500" /> : <ImageIcon className="size-4" />}
                  </button>
                  {deleteId === p.id ? (
                    <>
                      <span className="text-xs text-zinc-500">Emin misin?</span>
                      <button onClick={() => handleDelete(p.id)}
                        className="text-xs font-bold text-red-500 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50 transition">
                        Sil
                      </button>
                      <button onClick={() => setDeleteId(null)}
                        className="text-xs text-zinc-400 hover:text-zinc-600 px-2 py-1 rounded hover:bg-zinc-100 transition">
                        İptal
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setDeleteId(p.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-zinc-300 hover:text-red-400 transition">
                      <Trash2 className="size-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: KARŞILAŞTIRMA */}
      {tab === "karsilastir" && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-6 max-w-lg">
          <h2 className="text-sm font-bold text-zinc-700 mb-1 flex items-center gap-2">
            <ArrowRightLeft className="size-4 text-orange-600" /> Karşılaştırma Üret
          </h2>
          <p className="text-xs text-zinc-400 mb-5">İki ürün seç, AI detaylı karşılaştırma içeriği yazar.</p>
          <form onSubmit={handleCompare} className="space-y-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ürün A</label>
              <select value={selA} onChange={e => setSelA(e.target.value)}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-orange-500">
                <option value="">Seç...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.brand} {p.model}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Ürün B</label>
              <select value={selB} onChange={e => setSelB(e.target.value)}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none focus:border-orange-500">
                <option value="">Seç...</option>
                {products.filter(p => p.id !== selA).map(p => <option key={p.id} value={p.id}>{p.brand} {p.model}</option>)}
              </select>
            </div>
            <button type="submit" disabled={cmpLoading || !selA || !selB}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-500 transition disabled:opacity-50">
              {cmpLoading ? <Loader2 className="size-4 animate-spin" /> : <ArrowRightLeft className="size-4" />}
              {cmpLoading ? "AI yazıyor..." : "Karşılaştırma Üret"}
            </button>
          </form>
          {cmpResult && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
              <p className="text-xs text-green-700 font-medium mb-1">Oluşturuldu:</p>
              <a href={cmpResult} target="_blank" rel="noreferrer"
                className="text-xs text-green-600 underline break-all">{cmpResult}</a>
            </div>
          )}
        </div>
      )}

      {/* Silme onay modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-xl max-w-sm w-full mx-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Ürünü sil?</h3>
            <p className="text-sm text-zinc-500 mb-5">Bu işlem geri alınamaz.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-lg border border-zinc-200 text-sm text-zinc-600 hover:bg-zinc-50 transition font-medium">
                İptal
              </button>
              <button onClick={() => handleDelete(deleteId)}
                className="flex-1 py-2 rounded-lg bg-red-500 text-sm text-white font-bold hover:bg-red-600 transition">
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
