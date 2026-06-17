"use client";

import { useState, useRef } from "react";
import Link from "next/link";

interface Match {
  id: string;
  brand: string;
  model: string;
  category: string;
  categoryLabel: string;
  priceRange?: string;
}

interface Vision {
  parca: string;
  kategori?: string;
  guven: "yuksek" | "orta" | "dusuk";
  notlar: string;
  anahtarKelimeler: string[];
}

interface ApiResp {
  mode: "ai" | "stub";
  message?: string;
  vision: Vision | null;
  matches: Match[];
  categories?: { key: string; label: string }[];
  error?: string;
}

const productSlug = (p: { brand: string; model: string }) =>
  `${p.brand}-${p.model}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

const GUVEN_LABEL: Record<string, string> = {
  yuksek: "Yüksek güven",
  orta: "Orta güven",
  dusuk: "Düşük güven",
};

export function GorselAramaClient() {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resp, setResp] = useState<ApiResp | null>(null);
  const [manualCat, setManualCat] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const fileObj = useRef<File | null>(null);

  const onPick = (f: File | null) => {
    setError(null);
    setResp(null);
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setError("Sadece JPEG, PNG veya WEBP yükleyebilirsiniz.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("Görsel en fazla 5 MB olabilir.");
      return;
    }
    fileObj.current = f;
    setPreview(URL.createObjectURL(f));
  };

  const onSubmit = async () => {
    if (!fileObj.current) {
      setError("Önce bir görsel seçin.");
      return;
    }
    setLoading(true);
    setError(null);
    setResp(null);
    try {
      const fd = new FormData();
      fd.append("image", fileObj.current);
      const r = await fetch("/api/visual-search", { method: "POST", body: fd });
      const data: ApiResp = await r.json();
      if (!r.ok) {
        setError(data.error || "Bir hata oluştu.");
      } else {
        setResp(data);
      }
    } catch {
      setError("Sunucuya ulaşılamadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-gutter items-start">
      {/* Upload column */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 shadow-sm">
        <div
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            onPick(e.dataTransfer.files?.[0] ?? null);
          }}
          className="aspect-video border-2 border-dashed border-border-subtle rounded-xl flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary transition-colors bg-white overflow-hidden"
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Yüklenen parça" className="max-h-full max-w-full object-contain" />
          ) : (
            <>
              <span className="material-symbols-outlined text-[48px] text-secondary mb-3">add_a_photo</span>
              <p className="font-title-sm text-title-sm font-bold mb-1">Görsel seçin veya sürükleyin</p>
              <p className="text-secondary text-body-sm">JPEG / PNG / WEBP · maks 5 MB</p>
            </>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0] ?? null)}
        />

        {error && (
          <p className="mt-4 text-error font-body-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </p>
        )}

        <button
          onClick={onSubmit}
          disabled={loading || !preview}
          className="mt-5 w-full bg-primary text-white py-3.5 rounded font-label-caps text-label-caps font-bold hover:bg-primary/95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              ANALİZ EDİLİYOR…
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[18px]">search</span>
              PARÇAYI TANI
            </>
          )}
        </button>
      </div>

      {/* Results column */}
      <div className="space-y-6">
        {resp?.mode === "stub" && (
          <div className="bg-warning-amber/10 border border-warning-amber/30 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-warning-amber">info</span>
              <div className="flex-1">
                <p className="text-body-sm text-on-surface leading-relaxed mb-3">{resp.message}</p>
                {resp.categories && (
                  <div className="flex flex-wrap gap-2 items-center">
                    <select
                      value={manualCat}
                      onChange={(e) => setManualCat(e.target.value)}
                      className="bg-white border border-border-subtle rounded px-3 py-2 text-body-sm focus:outline-none focus:border-primary"
                    >
                      <option value="">Kategori seçin…</option>
                      {resp.categories.map((c) => (
                        <option key={c.key} value={c.key}>{c.label}</option>
                      ))}
                    </select>
                    {manualCat && (
                      <Link
                        href={`/kategori/${manualCat}`}
                        className="bg-primary text-white px-4 py-2 rounded font-label-caps text-[11px] font-bold hover:bg-primary/90 transition-colors decoration-none"
                      >
                        ÜRÜNLERİ GÖR →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {resp?.vision && (
          <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-title-md text-title-md font-bold">Tanımlanan Parça</h2>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  resp.vision.guven === "yuksek"
                    ? "bg-success-vibrant/10 text-success-vibrant"
                    : resp.vision.guven === "orta"
                    ? "bg-warning-amber/10 text-warning-amber"
                    : "bg-error/10 text-error"
                }`}
              >
                {GUVEN_LABEL[resp.vision.guven] || resp.vision.guven}
              </span>
            </div>
            <p className="font-headline-sm text-title-md font-bold text-primary mb-2">{resp.vision.parca}</p>
            {resp.vision.notlar && (
              <p className="text-secondary text-body-sm leading-relaxed mb-3">{resp.vision.notlar}</p>
            )}
            {resp.vision.anahtarKelimeler?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {resp.vision.anahtarKelimeler.map((k) => (
                  <span key={k} className="bg-surface-container px-2.5 py-1 rounded text-[11px] text-secondary font-medium">
                    {k}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {resp && resp.matches.length > 0 && (
          <div>
            <h3 className="font-title-md text-title-md font-bold mb-3">Katalogda Eşleşen Ürünler</h3>
            <div className="space-y-3">
              {resp.matches.map((m) => (
                <Link
                  key={m.id}
                  href={`/urun/${productSlug(m)}`}
                  className="block bg-white border border-border-subtle rounded-xl p-4 hover:border-primary transition-all decoration-none"
                >
                  <span className="text-[10px] font-bold text-secondary uppercase block">{m.brand} · {m.categoryLabel}</span>
                  <span className="font-title-sm text-title-sm font-bold text-on-surface">{m.model}</span>
                  {m.priceRange && <span className="block text-primary font-bold text-body-sm mt-1">{m.priceRange}</span>}
                </Link>
              ))}
            </div>
          </div>
        )}

        {resp?.mode === "ai" && resp.matches.length === 0 && (
          <div className="bg-surface-container-low border border-border-subtle rounded-xl p-6 text-center">
            <p className="text-secondary font-body-sm">
              Parça tanındı ancak kataloğumuzda doğrudan eşleşen bir ürün bulunamadı.
              <Link href="/arama" className="text-primary font-bold hover:underline ml-1">Manuel arama yapın →</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
