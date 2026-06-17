"use client";

import { useState } from "react";
import { TRADES, CITIES } from "@/lib/craftsman/store";

export function UstaBasvuruClient() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", city: "", phone: "", email: "", about: "" });
  const [trades, setTrades] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const toggleTrade = (key: string) => {
    setTrades((prev) => (prev.includes(key) ? prev.filter((t) => t !== key) : [...prev, key]));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.city || !form.phone) {
      setError("Ad, şehir ve telefon zorunludur.");
      return;
    }
    if (trades.length === 0) {
      setError("En az bir meslek seçin.");
      return;
    }
    setLoading(true);
    try {
      const r = await fetch("/api/craftsman/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, trades }),
      });
      const data = await r.json();
      if (!r.ok) setError(data.error || "Başvuru gönderilemedi.");
      else {
        setDone(data.message);
        setForm({ name: "", city: "", phone: "", email: "", about: "" });
        setTrades([]);
      }
    } catch {
      setError("Sunucuya ulaşılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-r from-[rgba(164,55,0,0.06)] to-transparent border border-primary/10 rounded-2xl p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-1">Usta mısınız?</h2>
          <p className="text-secondary font-body-md max-w-xl">
            Doğrulanmış usta ağımıza katılın, yeni müşterilere ulaşın. Başvurunuz incelenip onaylandıktan
            sonra profiliniz yayına alınır.
          </p>
          {/* Komisyon modeli TODO notu (owner): doğrulanmış ustalardan iş başına / aylık
              komisyon alınması planlanıyor. Şimdilik başvuru ücretsizdir. */}
        </div>
        {!open && !done && (
          <button onClick={() => setOpen(true)} className="shrink-0 bg-primary text-white py-3 px-6 rounded font-label-caps text-label-caps font-bold hover:bg-primary/90 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">how_to_reg</span>USTA OL
          </button>
        )}
      </div>

      {done && (
        <div className="mt-6 bg-success-vibrant/10 border border-success-vibrant/30 rounded-xl p-5 flex items-start gap-3">
          <span className="material-symbols-outlined text-success-vibrant">check_circle</span>
          <p className="text-on-surface font-body-md">{done}</p>
        </div>
      )}

      {open && !done && (
        <form onSubmit={submit} className="mt-6 bg-white border border-border-subtle rounded-xl p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-[11px] text-secondary font-bold uppercase mb-1.5">Ad Soyad *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-surface-container-low border border-border-subtle rounded px-3 py-2.5 text-body-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block font-label-caps text-[11px] text-secondary font-bold uppercase mb-1.5">Şehir *</label>
              <select value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full bg-surface-container-low border border-border-subtle rounded px-3 py-2.5 text-body-sm focus:outline-none focus:border-primary">
                <option value="">Seçin…</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-label-caps text-[11px] text-secondary font-bold uppercase mb-1.5">Telefon *</label>
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0555 555 55 55" className="w-full bg-surface-container-low border border-border-subtle rounded px-3 py-2.5 text-body-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block font-label-caps text-[11px] text-secondary font-bold uppercase mb-1.5">E-posta</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" className="w-full bg-surface-container-low border border-border-subtle rounded px-3 py-2.5 text-body-sm focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-[11px] text-secondary font-bold uppercase mb-2">Meslekler * (birden fazla seçebilirsiniz)</label>
            <div className="flex flex-wrap gap-2">
              {TRADES.map((t) => (
                <button type="button" key={t.key} onClick={() => toggleTrade(t.key)} className={`px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors ${trades.includes(t.key) ? "bg-primary text-white" : "bg-surface-container text-secondary hover:text-primary"}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-[11px] text-secondary font-bold uppercase mb-1.5">Kısa açıklama</label>
            <textarea value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} rows={3} maxLength={600} placeholder="Deneyiminiz, uzmanlık alanlarınız…" className="w-full bg-surface-container-low border border-border-subtle rounded px-3 py-2.5 text-body-sm focus:outline-none focus:border-primary resize-none" />
          </div>

          {error && (
            <p className="text-error font-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>{error}
            </p>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-primary text-white py-3 px-8 rounded font-label-caps text-label-caps font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center gap-2">
              {loading ? <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>GÖNDERİLİYOR…</> : <>BAŞVURUYU GÖNDER</>}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="py-3 px-6 rounded font-label-caps text-label-caps font-bold text-secondary hover:text-primary border border-border-subtle transition-colors">VAZGEÇ</button>
          </div>
        </form>
      )}
    </section>
  );
}
