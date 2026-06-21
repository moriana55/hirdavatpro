"use client";

import { useState, useMemo } from "react";

interface CatProduct {
  id: string;
  brand: string;
  model: string;
  category: string;
  categoryLabel: string;
}

interface Line {
  key: string;
  query: string;
  productId?: string;
  brand?: string;
  model?: string;
  qty: number;
  matched?: boolean;
}

interface Props {
  products: CatProduct[];
}

let counter = 0;
const nextKey = () => `l${++counter}-${Date.now()}`;

export function B2BHizliSiparisClient({ products }: Props) {
  const [lines, setLines] = useState<Line[]>([{ key: nextKey(), query: "", qty: 1 }]);
  const [bulkText, setBulkText] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ companyName: "", contactName: "", email: "", phone: "", taxNumber: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  // Fuzzy: girilen query'i katalogla eşleştir (bilgi amaçlı işaret).
  const matchProduct = (q: string): CatProduct | undefined => {
    const n = q.trim().toLocaleLowerCase("tr");
    if (!n) return undefined;
    return products.find((p) => `${p.brand} ${p.model}`.toLocaleLowerCase("tr").includes(n));
  };

  const searchResults = useMemo(() => {
    const n = search.trim().toLocaleLowerCase("tr");
    if (!n) return [];
    return products
      .filter((p) => `${p.brand} ${p.model} ${p.categoryLabel}`.toLocaleLowerCase("tr").includes(n))
      .slice(0, 8);
  }, [search, products]);

  const updateLine = (key: string, patch: Partial<Line>) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, ...patch } : l)));
  };

  const removeLine = (key: string) => {
    setLines((prev) => (prev.length > 1 ? prev.filter((l) => l.key !== key) : prev));
  };

  const addEmpty = () => setLines((prev) => [...prev, { key: nextKey(), query: "", qty: 1 }]);

  const addFromCatalog = (p: CatProduct) => {
    setLines((prev) => {
      const empties = prev.filter((l) => !l.query.trim());
      const newLine: Line = { key: nextKey(), query: `${p.brand} ${p.model}`, productId: p.id, brand: p.brand, model: p.model, qty: 1, matched: true };
      // İlk boş satırı doldur, yoksa ekle.
      if (empties.length > 0) {
        return prev.map((l) => (l.key === empties[0].key ? newLine : l));
      }
      return [...prev, newLine];
    });
    setSearch("");
  };

  // Yapıştırılan metni satırlara çevir: "SKU/isim x adet" veya "SKU/isim, adet".
  const importBulk = () => {
    const rows = bulkText.split("\n").map((r) => r.trim()).filter(Boolean);
    const parsed: Line[] = rows.map((row) => {
      const m = row.match(/^(.*?)[\sx,;]+(\d+)\s*$/i);
      let query = row;
      let qty = 1;
      if (m) {
        query = m[1].trim();
        qty = Math.max(1, parseInt(m[2], 10) || 1);
      }
      const matched = matchProduct(query);
      return {
        key: nextKey(),
        query,
        qty,
        productId: matched?.id,
        brand: matched?.brand,
        model: matched?.model,
        matched: !!matched,
      };
    });
    if (parsed.length > 0) {
      setLines(parsed);
      setBulkText("");
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const items = lines.filter((l) => l.query.trim()).map((l) => ({
      query: l.query.trim(),
      qty: l.qty,
      productId: l.productId,
      brand: l.brand,
      model: l.model,
    }));
    if (items.length === 0) { setError("En az bir ürün satırı girin."); return; }
    if (!form.companyName || !form.contactName || !form.email || !form.phone) {
      setError("Firma, yetkili, e-posta ve telefon zorunludur.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/b2b/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });
      const data = await r.json();
      if (!r.ok) setError(data.error || "Teklif gönderilemedi.");
      else {
        setDone(data.message);
        setLines([{ key: nextKey(), query: "", qty: 1 }]);
        setForm({ companyName: "", contactName: "", email: "", phone: "", taxNumber: "", note: "" });
      }
    } catch {
      setError("Sunucuya ulaşılamadı.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="bg-success-vibrant/10 border border-success-vibrant/30 rounded-2xl p-8 text-center">
        <span className="material-symbols-outlined text-success-vibrant text-[48px] mb-3">check_circle</span>
        <h2 className="font-headline-sm text-headline-sm font-bold mb-2">Teklif Talebiniz Alındı</h2>
        <p className="text-secondary font-body-md max-w-lg mx-auto">{done}</p>
        <button onClick={() => setDone(null)} className="mt-5 text-primary font-bold hover:underline font-label-caps text-label-caps">YENİ TALEP OLUŞTUR</button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-gutter items-start">
      {/* Order lines */}
      <div className="lg:col-span-2 space-y-6">
        {/* Bulk paste */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-5 shadow-sm">
          <h3 className="font-title-sm text-title-sm font-bold mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">content_paste</span>
            Toplu Yapıştır
          </h3>
          <p className="text-secondary text-body-sm mb-3">Her satıra bir ürün: <code className="bg-surface-container px-1 rounded">Bosch GSB 13 RE x 10</code></p>
          <textarea aria-label="Toplu ürün listesi yapıştır" value={bulkText} onChange={(e) => setBulkText(e.target.value)} rows={3} placeholder={"Makita HP1630 x 5\nBosch GBH 2-28 F, 3"} className="w-full bg-white border border-border-subtle rounded-lg p-3 text-body-sm focus:outline-none focus:border-primary resize-none font-mono" />
          <button onClick={importBulk} disabled={!bulkText.trim()} className="mt-3 bg-slate-gray text-white px-5 py-2.5 rounded font-label-caps text-[11px] font-bold hover:bg-primary transition-colors disabled:opacity-50">SATIRLARA AKTAR</button>
        </div>

        {/* Catalog search */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-5 shadow-sm">
          <h3 className="font-title-sm text-title-sm font-bold mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">search</span>
            Katalogdan Ekle
          </h3>
          <input aria-label="Katalogda marka veya model ara" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Marka veya model ara…" className="w-full bg-white border border-border-subtle rounded-lg px-3 py-2.5 text-body-sm focus:outline-none focus:border-primary" />
          {searchResults.length > 0 && (
            <div className="mt-3 space-y-1.5 max-h-60 overflow-y-auto">
              {searchResults.map((p) => (
                <button key={p.id} onClick={() => addFromCatalog(p)} className="w-full text-left bg-surface-container-low hover:bg-primary/10 rounded-lg p-2.5 flex items-center justify-between transition-colors">
                  <span><span className="text-[10px] font-bold text-secondary uppercase block">{p.brand} · {p.categoryLabel}</span><span className="text-[13px] font-bold">{p.model}</span></span>
                  <span className="material-symbols-outlined text-primary text-[20px]">add_circle</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lines table */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-5 shadow-sm">
          <h3 className="font-title-sm text-title-sm font-bold mb-3">Sipariş Kalemleri ({lines.filter((l) => l.query.trim()).length})</h3>
          <div className="space-y-2">
            {lines.map((l) => {
              const matched = l.matched ?? !!matchProduct(l.query);
              return (
                <div key={l.key} className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input
                      value={l.query}
                      onChange={(e) => updateLine(l.key, { query: e.target.value, productId: undefined, matched: false })}
                      placeholder="SKU veya ürün adı"
                      className="w-full bg-white border border-border-subtle rounded px-3 py-2.5 text-body-sm focus:outline-none focus:border-primary"
                    />
                    {l.query.trim() && (
                      <span className={`absolute right-2.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] ${matched ? "text-success-vibrant" : "text-secondary/40"}`} title={matched ? "Katalogda bulundu" : "Katalog dışı / manuel"}>
                        {matched ? "check_circle" : "help"}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min={1}
                    aria-label="Adet"
                    value={l.qty}
                    onChange={(e) => updateLine(l.key, { qty: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                    className="w-20 bg-white border border-border-subtle rounded px-3 py-2.5 text-body-sm focus:outline-none focus:border-primary text-center"
                  />
                  <button onClick={() => removeLine(l.key)} className="text-secondary hover:text-error p-2" aria-label="Sipariş satırını sil" title="Satırı sil">
                    <span className="material-symbols-outlined text-[20px]">delete</span>
                  </button>
                </div>
              );
            })}
          </div>
          <button onClick={addEmpty} className="mt-3 text-primary font-bold hover:underline font-label-caps text-[11px] flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">add</span>SATIR EKLE
          </button>
        </div>
      </div>

      {/* RFQ form */}
      <form onSubmit={submit} className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4 lg:sticky lg:top-28">
        <h3 className="font-title-md text-title-md font-bold">Teklif Talebi</h3>
        <div>
          <label className="block font-label-caps text-[11px] text-secondary font-bold uppercase mb-1.5">Firma Adı *</label>
          <input value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} className="w-full bg-white border border-border-subtle rounded px-3 py-2.5 text-body-sm focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block font-label-caps text-[11px] text-secondary font-bold uppercase mb-1.5">Yetkili *</label>
          <input value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} className="w-full bg-white border border-border-subtle rounded px-3 py-2.5 text-body-sm focus:outline-none focus:border-primary" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-label-caps text-[11px] text-secondary font-bold uppercase mb-1.5">E-posta *</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-white border border-border-subtle rounded px-3 py-2.5 text-body-sm focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block font-label-caps text-[11px] text-secondary font-bold uppercase mb-1.5">Telefon *</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-white border border-border-subtle rounded px-3 py-2.5 text-body-sm focus:outline-none focus:border-primary" />
          </div>
        </div>
        <div>
          <label className="block font-label-caps text-[11px] text-secondary font-bold uppercase mb-1.5">Vergi No <span className="text-secondary/50 normal-case">(cari hesap için)</span></label>
          <input value={form.taxNumber} onChange={(e) => setForm({ ...form, taxNumber: e.target.value })} className="w-full bg-white border border-border-subtle rounded px-3 py-2.5 text-body-sm focus:outline-none focus:border-primary" />
        </div>
        <div>
          <label className="block font-label-caps text-[11px] text-secondary font-bold uppercase mb-1.5">Not</label>
          <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={2} maxLength={600} className="w-full bg-white border border-border-subtle rounded px-3 py-2.5 text-body-sm focus:outline-none focus:border-primary resize-none" />
        </div>

        {error && <p className="text-error font-body-sm flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">error</span>{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-primary text-white py-3.5 rounded font-label-caps text-label-caps font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>GÖNDERİLİYOR…</> : <><span className="material-symbols-outlined text-[18px]">send</span>TEKLİF İSTE</>}
        </button>
        <p className="text-secondary/70 text-[11px] text-center">
          {/* Ödeme/kredi entegrasyonu TODO (owner): teklif onayı sonrası vadeli ödeme ve
              cari hesap bakiyesi şu an stub. */}
          Fiyatlar talep sonrası satış ekibi tarafından iletilir.
        </p>
      </form>
    </div>
  );
}
