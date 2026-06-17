"use client";

import { useState, useRef, useCallback } from "react";
import { Loader2, Pause, RotateCcw, CheckCircle, XCircle, Package, ArrowRightLeft, Zap, Plus } from "lucide-react";
import { SEED_CATALOG, generatePairs } from "@/lib/products/seed-catalog";
import { CATEGORY_LABELS, CATEGORY_GROUPS } from "@/lib/products/types";
import type { ProductCategory } from "@/lib/products/types";

type Phase = "idle" | "products" | "comparisons" | "done";
type LogEntry = { time: string; type: "success" | "skip" | "error"; message: string };

export default function BulkGeneratePage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [productProgress, setProductProgress] = useState({ done: 0, total: 0, skipped: 0 });
  const [compareProgress, setCompareProgress] = useState({ done: 0, total: 0, skipped: 0 });
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(
    [...new Set(SEED_CATALOG.map(p => p.category))]
  ));
  const abortRef = useRef(false);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const addLog = useCallback((type: LogEntry["type"], message: string) => {
    const time = new Date().toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs(prev => [...prev, { time, type, message }]);
    setTimeout(() => logsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  const filteredCatalog = SEED_CATALOG.filter(p => selectedCategories.has(p.category));
  const pairs = generatePairs(filteredCatalog);
  const categories = [...new Set(SEED_CATALOG.map(p => p.category))];

  async function startGeneration() {
    abortRef.current = false;
    setRunning(true);
    setLogs([]);

    // Phase 1: Add products
    setPhase("products");
    const productIds = new Map<string, string>();
    setProductProgress({ done: 0, total: filteredCatalog.length, skipped: 0 });

    addLog("success", `Başlıyor: ${filteredCatalog.length} ürün, ${pairs.length} karşılaştırma`);

    for (let i = 0; i < filteredCatalog.length; i++) {
      if (abortRef.current) { addLog("error", "Durduruldu"); setRunning(false); return; }

      const p = filteredCatalog[i];
      try {
        const res = await fetch("/api/bulk-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "add-product", brand: p.brand, model: p.model, category: p.category }),
        });
        const data = await res.json();
        if (data.success) {
          productIds.set(`${p.brand}|${p.model}`, data.product.id);
          if (data.skipped) {
            addLog("skip", `${p.brand} ${p.model} — zaten var`);
            setProductProgress(prev => ({ ...prev, done: prev.done + 1, skipped: prev.skipped + 1 }));
          } else {
            addLog("success", `${p.brand} ${p.model} — eklendi (${data.product.priceRange || "fiyat yok"})`);
            setProductProgress(prev => ({ ...prev, done: prev.done + 1 }));
          }
        }
      } catch (err: any) {
        addLog("error", `${p.brand} ${p.model} — HATA: ${err.message}`);
        setProductProgress(prev => ({ ...prev, done: prev.done + 1 }));
      }
    }

    // Phase 2: Generate comparisons
    setPhase("comparisons");
    setCompareProgress({ done: 0, total: pairs.length, skipped: 0 });

    for (let i = 0; i < pairs.length; i++) {
      if (abortRef.current) { addLog("error", "Durduruldu"); setRunning(false); return; }

      const [a, b] = pairs[i];
      const aId = productIds.get(`${a.brand}|${a.model}`);
      const bId = productIds.get(`${b.brand}|${b.model}`);

      if (!aId || !bId) {
        addLog("error", `${a.brand} ${a.model} vs ${b.brand} ${b.model} — ürün ID bulunamadı`);
        setCompareProgress(prev => ({ ...prev, done: prev.done + 1 }));
        continue;
      }

      try {
        const res = await fetch("/api/bulk-generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "compare", productAId: aId, productBId: bId }),
        });
        const data = await res.json();
        if (data.success) {
          if (data.skipped) {
            addLog("skip", `${a.brand} ${a.model} vs ${b.brand} ${b.model} — zaten var`);
            setCompareProgress(prev => ({ ...prev, done: prev.done + 1, skipped: prev.skipped + 1 }));
          } else {
            addLog("success", `${a.brand} ${a.model} vs ${b.brand} ${b.model} — oluşturuldu`);
            setCompareProgress(prev => ({ ...prev, done: prev.done + 1 }));
          }
        }
      } catch (err: any) {
        addLog("error", `${a.brand} ${a.model} vs ${b.brand} ${b.model} — HATA: ${err.message}`);
        setCompareProgress(prev => ({ ...prev, done: prev.done + 1 }));
      }
    }

    setPhase("done");
    setRunning(false);
    addLog("success", "Tamamlandı!");
  }

  function toggleCategory(cat: string) {
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }

  const [manualBrand, setManualBrand] = useState("");
  const [manualModel, setManualModel] = useState("");
  const [manualCategory, setManualCategory] = useState<ProductCategory>("darbeli-matkap");
  const [manualLoading, setManualLoading] = useState(false);
  const [manualResult, setManualResult] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  async function addManualProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!manualBrand.trim() || !manualModel.trim()) return;
    setManualLoading(true);
    setManualResult(null);
    try {
      const res = await fetch("/api/bulk-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add-product", brand: manualBrand.trim(), model: manualModel.trim(), category: manualCategory }),
      });
      const data = await res.json();
      if (data.success) {
        setManualResult({ type: "success", msg: data.skipped ? "Zaten mevcut" : `Eklendi: ${data.product.priceRange || "fiyat yok"}` });
        setManualBrand("");
        setManualModel("");
      } else {
        setManualResult({ type: "error", msg: data.error || "Hata" });
      }
    } catch (err: any) {
      setManualResult({ type: "error", msg: err.message });
    } finally {
      setManualLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-zinc-900">Toplu İçerik Üretici</h1>
          <p className="mt-1 text-sm text-zinc-500">Hazır katalogdan yüzlerce ürün + karşılaştırma üret</p>
        </div>
        <div className="flex items-center gap-3">
          {running ? (
            <button
              onClick={() => abortRef.current = true}
              className="flex items-center gap-2 rounded-lg border border-red-300 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 transition"
            >
              <Pause className="size-4" /> Durdur
            </button>
          ) : (
            <button
              onClick={startGeneration}
              disabled={filteredCatalog.length === 0}
              className="flex items-center gap-2 rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-bold text-zinc-950 hover:bg-orange-500 transition disabled:opacity-50"
            >
              <Zap className="size-4" /> Üretimi Başlat
            </button>
          )}
        </div>
      </div>

      {/* Manuel Ürün Ekle */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 mb-6">
        <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">Manuel Ürün Ekle</h2>
        <form onSubmit={addManualProduct} className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Marka</label>
            <input value={manualBrand} onChange={e => setManualBrand(e.target.value)} placeholder="örn. Bosch"
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-orange-500 w-36" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Model</label>
            <input value={manualModel} onChange={e => setManualModel(e.target.value)} placeholder="örn. GSB 13 RE"
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-orange-500 w-40" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Kategori</label>
            <select value={manualCategory} onChange={e => setManualCategory(e.target.value as ProductCategory)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-orange-500 w-52">
              {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={manualLoading || !manualBrand || !manualModel}
            className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-bold text-white hover:bg-orange-500 transition disabled:opacity-50">
            {manualLoading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Ekle & Üret
          </button>
          {manualResult && (
            <span className={`text-xs font-semibold ${manualResult.type === "success" ? "text-green-600" : "text-red-500"}`}>
              {manualResult.type === "success" ? "✓" : "✗"} {manualResult.msg}
            </span>
          )}
        </form>
      </div>

      {/* Category Selection */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Kategoriler</h2>
          <div className="flex gap-2">
            <button onClick={() => setSelectedCategories(new Set(categories))}
              className="text-[10px] font-bold text-orange-600 hover:text-orange-500">Hepsini Seç</button>
            <span className="text-zinc-300">|</span>
            <button onClick={() => setSelectedCategories(new Set())}
              className="text-[10px] font-bold text-zinc-400 hover:text-zinc-600">Temizle</button>
          </div>
        </div>
        <div className="space-y-4">
          {CATEGORY_GROUPS.map(group => {
            const groupCats = group.categories.filter(c => categories.includes(c));
            if (groupCats.length === 0) return null;
            return (
              <div key={group.label}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">{group.label}</p>
                <div className="flex flex-wrap gap-2">
                  {groupCats.map(cat => {
                    const count = SEED_CATALOG.filter(p => p.category === cat).length;
                    const active = selectedCategories.has(cat);
                    return (
                      <button key={cat} onClick={() => toggleCategory(cat)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border"
                        style={{
                          background: active ? "rgba(234,88,12,0.08)" : "transparent",
                          color: active ? "rgb(234,88,12)" : "rgb(161,161,170)",
                          borderColor: active ? "rgba(234,88,12,0.2)" : "rgb(228,228,231)",
                        }}>
                        {CATEGORY_LABELS[cat as ProductCategory]} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Preview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { icon: Package, label: "Ürünler", value: filteredCatalog.length, color: "rgb(234,88,12)" },
          { icon: ArrowRightLeft, label: "Karşılaştırmalar", value: pairs.length, color: "rgb(34,197,94)" },
          { icon: Package, label: "Kategoriler", value: selectedCategories.size, color: "rgb(99,102,241)" },
          { icon: Zap, label: "Tahmini Süre", value: `~${Math.ceil((filteredCatalog.length * 3 + pairs.length * 8) / 60)} dk`, color: "rgb(161,161,170)" },
        ].map(s => (
          <div key={s.label} className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
            <s.icon className="size-5 mb-2" style={{ color: s.color }} />
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{s.label}</p>
            <p className="text-xl font-bold" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      {phase !== "idle" && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-5 mb-6 space-y-4">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">İlerleme</h2>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-zinc-600">
                Ürün Ekleme {phase === "products" && running && <Loader2 className="inline size-3 animate-spin ml-1" />}
              </span>
              <span className="text-xs text-zinc-500">
                {productProgress.done}/{productProgress.total}
                {productProgress.skipped > 0 && ` (${productProgress.skipped} mevcut)`}
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden bg-zinc-200">
              <div className="h-full rounded-full transition-all bg-orange-500"
                style={{ width: `${productProgress.total > 0 ? (productProgress.done / productProgress.total) * 100 : 0}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-zinc-600">
                Karşılaştırma Üretimi {phase === "comparisons" && running && <Loader2 className="inline size-3 animate-spin ml-1" />}
              </span>
              <span className="text-xs text-zinc-500">
                {compareProgress.done}/{compareProgress.total}
                {compareProgress.skipped > 0 && ` (${compareProgress.skipped} mevcut)`}
              </span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden bg-zinc-200">
              <div className="h-full rounded-full transition-all bg-green-500"
                style={{ width: `${compareProgress.total > 0 ? (compareProgress.done / compareProgress.total) * 100 : 0}%` }} />
            </div>
          </div>

          {phase === "done" && (
            <div className="flex items-center gap-2 pt-2 text-sm font-semibold text-green-600">
              <CheckCircle className="size-5" /> Tamamlandı!
            </div>
          )}
        </div>
      )}

      {/* Logs */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-950 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Log</h2>
          {logs.length > 0 && (
            <button onClick={() => setLogs([])} className="text-[10px] text-zinc-600 hover:text-zinc-400 flex items-center gap-1">
              <RotateCcw className="size-3" /> Temizle
            </button>
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto space-y-0.5 font-mono text-[11px]">
          {logs.length === 0 ? (
            <p className="text-zinc-600 py-4 text-center">Üretimi başlat, loglar burada görünecek...</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="flex gap-2 py-0.5">
                <span className="text-zinc-600 shrink-0">{log.time}</span>
                {log.type === "success" && <CheckCircle className="size-3 shrink-0 mt-0.5 text-green-500" />}
                {log.type === "skip" && <span className="text-yellow-500 shrink-0">⟳</span>}
                {log.type === "error" && <XCircle className="size-3 shrink-0 mt-0.5 text-red-500" />}
                <span className={
                  log.type === "success" ? "text-green-400" :
                  log.type === "skip" ? "text-yellow-400" :
                  "text-red-400"
                }>{log.message}</span>
              </div>
            ))
          )}
          <div ref={logsEndRef} />
        </div>
      </div>

      {/* Pairs preview */}
      {phase === "idle" && pairs.length > 0 && (
        <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-5">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3">
            Üretilecek Karşılaştırmalar ({pairs.length})
          </h2>
          <div className="max-h-[300px] overflow-y-auto space-y-1">
            {pairs.map(([a, b], i) => (
              <div key={i} className="flex items-center gap-2 text-xs py-1 border-b border-zinc-100 last:border-0">
                <span className="text-zinc-700 font-medium">{a.brand} {a.model}</span>
                <span className="text-orange-600 font-bold text-[10px]">vs</span>
                <span className="text-zinc-700 font-medium">{b.brand} {b.model}</span>
                <span className="ml-auto text-[10px] text-zinc-400">{CATEGORY_LABELS[a.category as ProductCategory]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
