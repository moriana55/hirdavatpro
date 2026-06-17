"use client";

import { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { getOwnerKey } from "@/lib/owner-key";
import type { ServiceCenter } from "@/lib/warranty/service-centers";

// Mapbox haritası lazy-load (ssr:false) — yalnızca tarayıcıda yüklenir.
const ServisHaritasi = dynamic(() => import("./ServisHaritasi"), {
  ssr: false,
  loading: () => <div className="w-full h-[340px] rounded-xl bg-surface-container-low animate-pulse" />,
});

interface WarrantyRecord {
  id: string;
  productLabel: string;
  brand: string;
  serial: string;
  purchaseDate: string;
  months: number;
  note: string;
  endDate: string;
  daysLeft: number;
  status: "active" | "expiring" | "expired";
}

const STATUS_META: Record<string, { label: string; cls: string; icon: string }> = {
  active: { label: "Garanti Aktif", cls: "bg-success-vibrant/10 text-success-vibrant", icon: "verified" },
  expiring: { label: "Yakında Bitiyor", cls: "bg-warning-amber/10 text-warning-amber", icon: "schedule" },
  expired: { label: "Garanti Bitti", cls: "bg-danger-vibrant/10 text-danger-vibrant", icon: "error" },
};

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("tr-TR");

export function GarantiClient() {
  const [ownerKey, setOwnerKey] = useState("");
  const [records, setRecords] = useState<WarrantyRecord[] | null>(null);
  const [centers, setCenters] = useState<ServiceCenter[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Form state
  const [productLabel, setProductLabel] = useState("");
  const [brand, setBrand] = useState("");
  const [serial, setSerial] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [months, setMonths] = useState(24);

  const load = useCallback(async (key: string) => {
    try {
      const r = await fetch("/api/warranty", { headers: { "x-owner-key": key } });
      const data = await r.json();
      setRecords(data.records || []);
    } catch {
      setRecords([]);
    }
  }, []);

  useEffect(() => {
    const key = getOwnerKey();
    setOwnerKey(key);
    if (key) load(key);
    else setRecords([]);
    // Başlangıçta tüm servisleri yükle (harita için).
    fetch("/api/service-centers").then((r) => r.json()).then((d) => setCenters(d.centers || [])).catch(() => {});
  }, [load]);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(null), 3000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productLabel.trim() || !purchaseDate) {
      setError("Ürün adı ve satın alma tarihi gerekli.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/warranty", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-owner-key": ownerKey },
        body: JSON.stringify({ ownerKey, productLabel: productLabel.trim(), brand: brand.trim(), serial: serial.trim(), purchaseDate, months }),
      });
      const data = await r.json();
      if (!r.ok) { setError(data.error || "Kayıt eklenemedi."); setBusy(false); return; }
      // Form temizle, listeyi yenile, markaya uygun servisleri öne al.
      setProductLabel(""); setBrand(""); setSerial(""); setPurchaseDate(""); setMonths(24);
      if (data.services?.length) setCenters(data.services);
      await load(ownerKey);
      showToast("Garanti kaydı eklendi. Yakın yetkili servisler aşağıda.");
    } catch {
      setError("Sunucuya ulaşılamadı.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu garanti kaydını silmek istiyor musunuz?")) return;
    try {
      await fetch(`/api/warranty/${id}`, { method: "DELETE", headers: { "x-owner-key": ownerKey } });
      setRecords((prev) => (prev ? prev.filter((r) => r.id !== id) : prev));
    } catch { /* ignore */ }
  };

  return (
    <div className="grid lg:grid-cols-12 gap-gutter items-start">
      {/* Form */}
      <div className="lg:col-span-5 space-y-6">
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="font-title-md text-title-md font-bold">Yeni Garanti Kaydı</h2>
          <div>
            <label className="text-[11px] font-bold text-secondary uppercase block mb-1">Ürün Adı / Model *</label>
            <input value={productLabel} onChange={(e) => setProductLabel(e.target.value)} maxLength={160}
              placeholder="Ör. Bosch GSB 13 RE Darbeli Matkap"
              className="w-full bg-white border border-border-subtle rounded-lg p-2.5 text-body-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-secondary uppercase block mb-1">Marka</label>
              <input value={brand} onChange={(e) => setBrand(e.target.value)} maxLength={80}
                placeholder="Bosch"
                className="w-full bg-white border border-border-subtle rounded-lg p-2.5 text-body-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-secondary uppercase block mb-1">Seri No</label>
              <input value={serial} onChange={(e) => setSerial(e.target.value)} maxLength={80}
                placeholder="Opsiyonel"
                className="w-full bg-white border border-border-subtle rounded-lg p-2.5 text-body-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-secondary uppercase block mb-1">Satın Alma Tarihi *</label>
              <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)}
                max={new Date().toISOString().slice(0, 10)}
                className="w-full bg-white border border-border-subtle rounded-lg p-2.5 text-body-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-secondary uppercase block mb-1">Garanti Süresi (ay)</label>
              <select value={months} onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full bg-white border border-border-subtle rounded-lg p-2.5 text-body-sm focus:outline-none focus:border-primary">
                {[12, 24, 36, 48, 60].map((m) => <option key={m} value={m}>{m} ay</option>)}
              </select>
            </div>
          </div>
          {error && (
            <p className="text-error font-body-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>{error}
            </p>
          )}
          <button type="submit" disabled={busy}
            className="w-full bg-primary text-white py-3 rounded font-label-caps text-label-caps font-bold hover:bg-primary/95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">{busy ? "progress_activity" : "add_task"}</span>
            {busy ? "KAYDEDİLİYOR…" : "GARANTİ KAYDET"}
          </button>
          <p className="text-[10px] text-secondary leading-relaxed">
            Kayıtlar bu cihaza özel anonim bir anahtarla saklanır; hesap gerektirmez. E-posta hatırlatma altyapısı yakında.
          </p>
        </form>
      </div>

      {/* List + Map */}
      <div className="lg:col-span-7 space-y-6">
        {records === null ? (
          <p className="text-secondary font-body-md">Yükleniyor…</p>
        ) : records.length === 0 ? (
          <div className="bg-surface-container-low border border-border-subtle rounded-2xl p-8 text-center">
            <span className="material-symbols-outlined text-[40px] text-secondary mb-2">shield</span>
            <p className="text-secondary font-body-sm">Henüz garanti kaydınız yok. Soldan ilk aletinizi ekleyin.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((rec) => {
              const meta = STATUS_META[rec.status];
              return (
                <div key={rec.id} className="bg-white border border-border-subtle rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-title-sm text-title-sm font-bold">{rec.productLabel}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${meta.cls}`}>
                          <span className="material-symbols-outlined text-[13px]">{meta.icon}</span>{meta.label}
                        </span>
                      </div>
                      <p className="text-secondary text-[12px] mt-1">
                        {rec.brand && <span className="font-bold">{rec.brand} · </span>}
                        Satın alma: {fmtDate(rec.purchaseDate)} · Bitiş: <strong>{fmtDate(rec.endDate)}</strong>
                        {rec.status !== "expired" ? ` · ${rec.daysLeft} gün kaldı` : ""}
                        {rec.serial && ` · S/N: ${rec.serial}`}
                      </p>
                    </div>
                    <button onClick={() => handleDelete(rec.id)} title="Sil"
                      className="shrink-0 text-secondary hover:text-danger-vibrant">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Yetkili servis haritası + liste */}
        <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">handyman</span>
            <h2 className="font-title-md text-title-md font-bold">Yakın Yetkili Servisler</h2>
          </div>
          <ServisHaritasi centers={centers} />
          <div className="space-y-2">
            {centers.slice(0, 6).map((c) => (
              <div key={c.id} className="flex items-start justify-between gap-3 bg-surface-container-low rounded-lg p-3">
                <div className="min-w-0">
                  <p className="font-bold text-[13px] text-on-surface line-clamp-1">{c.name}</p>
                  <p className="text-secondary text-[11px]">{c.district}, {c.city} · {c.brand === "*" ? "Çok markalı" : c.brand}</p>
                </div>
                <a href={`tel:${c.phone.replace(/\s/g, "")}`} className="shrink-0 text-primary font-bold text-[12px] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">call</span>{c.phone}
                </a>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-secondary">
            Servis listesi temsilîdir. Resmî yetkili servis için ürün kutusu/üretici sitesini doğrulayın.
          </p>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-white px-5 py-3 rounded-lg shadow-lg font-body-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-success-vibrant">check_circle</span>{toast}
        </div>
      )}
    </div>
  );
}
