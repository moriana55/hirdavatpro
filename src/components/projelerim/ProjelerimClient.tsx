"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { getOwnerKey } from "@/lib/owner-key";

interface SavedItem {
  category: string;
  categoryLabel: string;
  rol: "alet" | "sarf" | "guvenlik";
  neden: string;
  productId?: string;
  brand?: string;
  model?: string;
  priceRange?: string;
}

interface Project {
  id: string;
  name: string;
  desc: string;
  items: SavedItem[];
  notes: string;
  createdAt: string;
}

interface GuideStep { baslik: string; detay: string; }
interface Guide {
  baslik: string;
  ozet: string;
  adimlar: GuideStep[];
  ipuclari: string[];
  maliyet: { altLimit: number; ustLimit: number; orta: number; kalemSayisi: number; fiyatliKalem: number };
}

const formatTRY = (v: number) => "₺" + Math.round(v).toLocaleString("tr-TR");

const ROL_BADGE: Record<string, string> = {
  alet: "bg-primary/10 text-primary",
  sarf: "bg-tertiary/10 text-tertiary",
  guvenlik: "bg-warning-amber/10 text-warning-amber",
};

export function ProjelerimClient() {
  const [ownerKey, setOwnerKey] = useState("");
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [guides, setGuides] = useState<Record<string, { loading: boolean; data?: Guide; mode?: string }>>({});

  const load = useCallback(async (key: string) => {
    try {
      const r = await fetch("/api/projects", { headers: { "x-owner-key": key } });
      const data = await r.json();
      setProjects(data.projects || []);
    } catch {
      setProjects([]);
    }
  }, []);

  useEffect(() => {
    const key = getOwnerKey();
    setOwnerKey(key);
    if (key) load(key);
    else setProjects([]);
  }, [load]);

  // Yeni proje: önce project-kit ile listeyi çıkar, sonra kaydet.
  const handleCreate = async () => {
    if (!name.trim() || !desc.trim()) {
      setError("Proje adı ve iş tarifi gerekli.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const kitRes = await fetch("/api/project-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: desc.trim() }),
      });
      const kit = await kitRes.json();
      if (!kitRes.ok) {
        setError(kit.error || "Liste oluşturulamadı.");
        setBusy(false);
        return;
      }
      // Her satırın ilk eşleşen ürününü kaleme dönüştür.
      const items: SavedItem[] = (kit.lines || []).map((l: any) => {
        const p = l.products?.[0];
        return {
          category: l.category,
          categoryLabel: l.categoryLabel,
          rol: l.rol,
          neden: l.neden,
          productId: p?.id,
          brand: p?.brand,
          model: p?.model,
          priceRange: p?.priceRange,
        };
      });

      const saveRes = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-owner-key": ownerKey },
        body: JSON.stringify({ ownerKey, name: name.trim(), desc: desc.trim(), items }),
      });
      const saved = await saveRes.json();
      if (!saveRes.ok) {
        setError(saved.error || "Proje kaydedilemedi.");
        setBusy(false);
        return;
      }
      setName("");
      setDesc("");
      setCreating(false);
      await load(ownerKey);
    } catch {
      setError("Sunucuya ulaşılamadı.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    try {
      await fetch(`/api/projects/${id}`, { method: "DELETE", headers: { "x-owner-key": ownerKey } });
      setProjects((prev) => (prev ? prev.filter((p) => p.id !== id) : prev));
    } catch {
      /* ignore */
    }
  };

  const loadGuide = async (project: Project) => {
    if (openId === project.id) { setOpenId(null); return; }
    setOpenId(project.id);
    if (guides[project.id]?.data) return;
    setGuides((g) => ({ ...g, [project.id]: { loading: true } }));
    try {
      const r = await fetch("/api/project-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: project.desc, baslik: project.name, items: project.items }),
      });
      const data = await r.json();
      setGuides((g) => ({ ...g, [project.id]: { loading: false, data: data.guide, mode: data.mode } }));
    } catch {
      setGuides((g) => ({ ...g, [project.id]: { loading: false } }));
    }
  };

  const addItemsToBasket = (items: SavedItem[]) => {
    try {
      let basket: string[] = JSON.parse(localStorage.getItem("hirdavatpro_basket") || "[]");
      let added = 0;
      for (const it of items) {
        if (!it.productId || basket.includes(it.productId)) continue;
        if (basket.length >= 3) break;
        basket.push(it.productId);
        added++;
      }
      localStorage.setItem("hirdavatpro_basket", JSON.stringify(basket));
      window.dispatchEvent(new Event("hirdavatpro_basket_change"));
      alert(added > 0 ? `${added} ürün karşılaştırma sepetine eklendi.` : "Eklenecek yeni ürün bulunamadı (maks 3).");
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="space-y-8">
      {/* Create panel */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 shadow-sm">
        {!creating ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="font-title-md text-title-md font-bold">Yeni Proje Oluştur</h2>
              <p className="text-secondary font-body-sm">İşi tarif edin; alet & malzeme listesini çıkarıp kaydedelim.</p>
            </div>
            <button
              onClick={() => setCreating(true)}
              className="shrink-0 bg-primary text-white py-3 px-6 rounded font-label-caps text-label-caps font-bold hover:bg-primary/95 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>YENİ PROJE
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              placeholder="Proje adı (ör. Banyo Yenileme)"
              className="w-full bg-white border border-border-subtle rounded-xl p-3 text-body-md focus:outline-none focus:border-primary"
            />
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Yapacağınız işi anlatın (ör. Banyo fayansını söküp yenilerini döşeyeceğim)."
              className="w-full bg-white border border-border-subtle rounded-xl p-3 text-body-md focus:outline-none focus:border-primary resize-none"
            />
            {error && (
              <p className="text-error font-body-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">error</span>{error}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={busy}
                className="bg-primary text-white py-3 px-6 rounded font-label-caps text-label-caps font-bold hover:bg-primary/95 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {busy ? (
                  <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>KAYDEDİLİYOR…</>
                ) : (
                  <><span className="material-symbols-outlined text-[18px]">save</span>OLUŞTUR & KAYDET</>
                )}
              </button>
              <button
                onClick={() => { setCreating(false); setError(null); }}
                className="border border-border-subtle text-secondary py-3 px-6 rounded font-label-caps text-label-caps font-bold hover:bg-surface-container transition-all"
              >
                VAZGEÇ
              </button>
            </div>
          </div>
        )}
      </div>

      {/* List */}
      {projects === null ? (
        <p className="text-secondary font-body-md">Yükleniyor…</p>
      ) : projects.length === 0 ? (
        <div className="bg-surface-container-low border border-border-subtle rounded-2xl p-10 text-center">
          <span className="material-symbols-outlined text-[48px] text-secondary mb-3">folder_open</span>
          <h3 className="font-title-md text-title-md font-bold mb-2">Henüz kayıtlı projeniz yok</h3>
          <p className="text-secondary font-body-sm max-w-md mx-auto mb-5">
            Yukarıdan yeni bir proje oluşturun ya da <Link href="/proje-sihirbazi" className="text-primary font-bold hover:underline">Proje Sihirbazı</Link> ile bir liste çıkarıp kaydedin.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {projects.map((project) => {
            const guide = guides[project.id];
            const open = openId === project.id;
            return (
              <div key={project.id} className="bg-white border border-border-subtle rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-title-md text-title-md font-bold">{project.name}</h3>
                    {project.desc && <p className="text-secondary font-body-sm mt-1">{project.desc}</p>}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {project.items.slice(0, 8).map((it, i) => (
                        <span key={i} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${ROL_BADGE[it.rol] || ROL_BADGE.alet}`}>
                          {it.categoryLabel}
                        </span>
                      ))}
                      {project.items.length > 8 && (
                        <span className="text-[10px] text-secondary font-bold self-center">+{project.items.length - 8}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => loadGuide(project)}
                      className="bg-primary text-white px-4 py-2 rounded font-label-caps text-[11px] font-bold hover:bg-primary/90 flex items-center gap-1 justify-center"
                    >
                      <span className="material-symbols-outlined text-[16px]">{open ? "expand_less" : "menu_book"}</span>
                      {open ? "GİZLE" : "REHBER & MALİYET"}
                    </button>
                    <button
                      onClick={() => addItemsToBasket(project.items)}
                      className="border border-primary text-primary px-4 py-2 rounded font-label-caps text-[11px] font-bold hover:bg-primary/10 flex items-center gap-1 justify-center"
                    >
                      <span className="material-symbols-outlined text-[16px]">compare_arrows</span>KARŞILAŞTIR
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-secondary hover:text-danger-vibrant px-4 py-1.5 rounded text-[11px] font-bold flex items-center gap-1 justify-center"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>SİL
                    </button>
                  </div>
                </div>

                {open && (
                  <div className="border-t border-border-subtle bg-surface-container-low p-5">
                    {guide?.loading ? (
                      <p className="text-secondary font-body-sm flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                        Rehber hazırlanıyor…
                      </p>
                    ) : guide?.data ? (
                      <div className="space-y-6">
                        {/* Maliyet */}
                        <div className="bg-white border border-border-subtle rounded-xl p-4">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <span className="font-label-caps text-[10px] text-secondary font-bold uppercase">Tahmini Maliyet (katalog)</span>
                              <p className="font-headline-sm text-headline-sm font-bold text-on-surface">
                                {guide.data.maliyet.fiyatliKalem > 0
                                  ? `${formatTRY(guide.data.maliyet.altLimit)} – ${formatTRY(guide.data.maliyet.ustLimit)}`
                                  : "Fiyat verisi yetersiz"}
                              </p>
                            </div>
                            <span className="text-[10px] text-secondary font-medium max-w-[200px] text-right">
                              {guide.data.maliyet.fiyatliKalem}/{guide.data.maliyet.kalemSayisi} kalemde fiyat bilgisi. Tahmindir; bayi fiyatları değişebilir.
                            </span>
                          </div>
                        </div>

                        {/* Adımlar */}
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-label-caps text-[11px] text-secondary font-bold uppercase">
                              {guide.mode === "ai" ? "Yapay zekâ rehberi" : "Uzman kural rehberi"}
                            </span>
                          </div>
                          <ol className="space-y-3">
                            {guide.data.adimlar.map((step, i) => (
                              <li key={i} className="flex gap-3">
                                <span className="shrink-0 w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center font-bold text-[13px]">{i + 1}</span>
                                <div>
                                  <h4 className="font-title-sm text-title-sm font-bold">{step.baslik}</h4>
                                  <p className="text-secondary font-body-sm">{step.detay}</p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* İpuçları */}
                        {guide.data.ipuclari.length > 0 && (
                          <div className="bg-warning-amber/10 border border-warning-amber/20 rounded-xl p-4">
                            <h4 className="font-label-caps text-[11px] text-warning-amber font-bold uppercase mb-2 flex items-center gap-1">
                              <span className="material-symbols-outlined text-[16px]">tips_and_updates</span>İpuçları
                            </h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {guide.data.ipuclari.map((tip, i) => (
                                <li key={i} className="text-secondary font-body-sm">{tip}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-secondary font-body-sm">Rehber yüklenemedi. Tekrar deneyin.</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
