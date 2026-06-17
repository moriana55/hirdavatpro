"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { zeminHesapla, type Malzeme } from "@/lib/zemin/hesapla";

function NumInput({ label, value, onChange, unit, min, max, step }: {
  label: string; value: number; onChange: (v: number) => void;
  unit: string; min: number; max: number; step: number;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-zinc-600">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
        <input type="number" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Math.max(min, parseFloat(e.target.value) || min))}
          className="w-full bg-transparent text-sm font-medium text-zinc-900 outline-none tabular-nums" />
        <span className="shrink-0 text-xs text-zinc-400">{unit}</span>
      </div>
    </label>
  );
}

function ResultCard({ label, value, sub, highlight }: { label: string; value: string; sub?: string; highlight?: boolean }) {
  return (
    <div className={cn("rounded-xl border p-4", highlight ? "border-orange-200 bg-orange-50" : "border-zinc-200 bg-white")}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
      <p className={cn("mt-1 text-xl font-bold tabular-nums", highlight ? "text-orange-700" : "text-zinc-900")}>{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-zinc-400">{sub}</p>}
    </div>
  );
}

const HAZIR = [
  { label: "30×30", en: 30, boy: 30 },
  { label: "30×60", en: 30, boy: 60 },
  { label: "45×45", en: 45, boy: 45 },
  { label: "60×60", en: 60, boy: 60 },
  { label: "20×120 (laminat)", en: 20, boy: 120 },
];

export function ZeminPlanlayiciTool() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [malzeme, setMalzeme] = useState<Malzeme>("fayans");
  const [odaEn, setOdaEn] = useState(4.0);
  const [odaBoy, setOdaBoy] = useState(3.5);
  const [karoEn, setKaroEn] = useState(30);
  const [karoBoy, setKaroBoy] = useState(30);
  const [derz, setDerz] = useState(3);
  const [fire, setFire] = useState(10);
  const [kutuAdedi, setKutuAdedi] = useState(9);
  const [duvarYuksekligi, setDuvarYuksekligi] = useState(2.7);
  const [katSayisi, setKatSayisi] = useState(2);
  const [renk, setRenk] = useState("#e7c9a9");

  const sonuc = useMemo(
    () => zeminHesapla({ odaEn, odaBoy, malzeme, karoEn, karoBoy, derz, fire, kutuAdedi, duvarYuksekligi, katSayisi }),
    [odaEn, odaBoy, malzeme, karoEn, karoBoy, derz, fire, kutuAdedi, duvarYuksekligi, katSayisi],
  );

  // 2D grid çizimi için ölçek.
  const VIEW_W = 600;
  const scale = VIEW_W / Math.max(odaEn, 0.5);
  const planW = odaEn * scale;
  const planH = odaBoy * scale;
  const cellW = (karoEn / 100) * scale;
  const cellH = (karoBoy / 100) * scale;
  const cols = Math.ceil(odaEn / (karoEn / 100));
  const rows = Math.ceil(odaBoy / (karoBoy / 100));
  const isFloor = malzeme !== "boya";

  const downloadSVG = () => {
    if (!svgRef.current) return;
    const xml = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([`<?xml version="1.0" encoding="UTF-8"?>\n${xml}`], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zemin-plani-${odaEn}x${odaBoy}m.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <nav className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500 print:hidden">
        <Link href="/" className="transition hover:text-orange-600/90">Ana sayfa</Link>
        <span aria-hidden className="text-zinc-400">/</span>
        <Link href="/araclar" className="transition hover:text-orange-600/90">Araçlar</Link>
        <span aria-hidden className="text-zinc-400">/</span>
        <span className="text-orange-600/90">Zemin & yerleşim planlayıcı</span>
      </nav>

      <div className="print:hidden">
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          Zemin & Yerleşim Planlayıcı
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          Oda ölçülerini girin, malzemeyi seçin; 2D yerleşim planını görselleştirin ve gereken malzeme miktarını
          (fayans/laminat adedi, derz veya boya litresi) anında hesaplayın. Planı yazdırabilir veya görsel olarak indirebilirsiniz.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Controls */}
        <div className="lg:col-span-5 space-y-5 print:hidden">
          {/* Malzeme */}
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 space-y-4">
            <p className="text-sm font-semibold text-zinc-700">Malzeme</p>
            <div className="flex gap-2">
              {([["fayans", "Fayans"], ["laminat", "Laminat"], ["boya", "Boya"]] as [Malzeme, string][]).map(([v, label]) => (
                <button key={v} type="button" onClick={() => setMalzeme(v)}
                  className={cn("flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition",
                    malzeme === v ? "border-orange-500 bg-orange-500 text-white" : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300")}>
                  {label}
                </button>
              ))}
            </div>

            <p className="text-sm font-semibold text-zinc-700">Oda Ölçüleri</p>
            <div className="grid gap-3 md:grid-cols-2">
              <NumInput label="Oda Eni" value={odaEn} onChange={setOdaEn} unit="m" min={0.5} max={50} step={0.1} />
              <NumInput label="Oda Boyu" value={odaBoy} onChange={setOdaBoy} unit="m" min={0.5} max={50} step={0.1} />
            </div>
          </div>

          {isFloor ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 space-y-4">
              <p className="text-sm font-semibold text-zinc-700">Karo Boyutu</p>
              <div className="flex flex-wrap gap-2">
                {HAZIR.map((h) => (
                  <button key={h.label} type="button" onClick={() => { setKaroEn(h.en); setKaroBoy(h.boy); }}
                    className={cn("rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                      karoEn === h.en && karoBoy === h.boy ? "border-orange-500 bg-orange-500 text-white" : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300")}>
                    {h.label}
                  </button>
                ))}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <NumInput label="Karo Eni" value={karoEn} onChange={setKaroEn} unit="cm" min={5} max={200} step={1} />
                <NumInput label="Karo Boyu" value={karoBoy} onChange={setKaroBoy} unit="cm" min={5} max={200} step={1} />
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {malzeme === "fayans" && <NumInput label="Derz" value={derz} onChange={setDerz} unit="mm" min={1} max={20} step={0.5} />}
                <NumInput label="Fire" value={fire} onChange={setFire} unit="%" min={5} max={30} step={1} />
                <NumInput label="Kutu/Paket" value={kutuAdedi} onChange={setKutuAdedi} unit="adet" min={1} max={100} step={1} />
              </div>
              <label className="flex items-center gap-3 text-sm text-zinc-600">
                <span className="font-semibold">Karo rengi</span>
                <input type="color" value={renk} onChange={(e) => setRenk(e.target.value)} className="h-8 w-12 cursor-pointer rounded border border-zinc-200" />
              </label>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 grid gap-3 md:grid-cols-2">
              <NumInput label="Duvar Yüksekliği" value={duvarYuksekligi} onChange={setDuvarYuksekligi} unit="m" min={1.5} max={6} step={0.1} />
              <NumInput label="Kat Sayısı" value={katSayisi} onChange={setKatSayisi} unit="kat" min={1} max={4} step={1} />
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={() => window.print()}
              className="flex-1 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700">
              Planı Yazdır / PDF
            </button>
            <button onClick={downloadSVG}
              className="flex-1 rounded-lg border border-zinc-300 px-4 py-2.5 text-sm font-bold text-zinc-700 transition hover:border-orange-300 hover:text-orange-600">
              Görseli İndir (SVG)
            </button>
          </div>
        </div>

        {/* Plan + Results */}
        <div className="lg:col-span-7 space-y-5">
          {/* 2D Plan */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-4">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              2D Yerleşim Planı — {odaEn} × {odaBoy} m ({sonuc.alanM2.toFixed(2)} m²)
            </p>
            <svg ref={svgRef} viewBox={`0 0 ${VIEW_W + 40} ${planH + 50}`} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
              <rect x={0} y={0} width={VIEW_W + 40} height={planH + 50} fill="#ffffff" />
              <g transform="translate(20,20)">
                {/* Oda zemin */}
                <rect x={0} y={0} width={planW} height={planH} fill={isFloor ? renk : "#f4f4f5"} stroke="#27272a" strokeWidth={2} />
                {/* Karo gridi */}
                {isFloor && Array.from({ length: rows }).map((_, r) =>
                  Array.from({ length: cols }).map((_, c) => (
                    <rect key={`${r}-${c}`} x={c * cellW} y={r * cellH}
                      width={Math.min(cellW, planW - c * cellW)} height={Math.min(cellH, planH - r * cellH)}
                      fill="none" stroke="#27272a" strokeWidth={0.6} strokeOpacity={0.5} />
                  ))
                )}
                {!isFloor && (
                  <text x={planW / 2} y={planH / 2} textAnchor="middle" dominantBaseline="middle"
                    fontSize={16} fill="#a1a1aa" fontFamily="sans-serif">Boya: 4 duvar yüzeyi</text>
                )}
                {/* Ölçü etiketleri */}
                <text x={planW / 2} y={planH + 24} textAnchor="middle" fontSize={13} fill="#52525b" fontFamily="sans-serif">{odaEn} m</text>
                <text x={-10} y={planH / 2} textAnchor="middle" fontSize={13} fill="#52525b" fontFamily="sans-serif"
                  transform={`rotate(-90 -10 ${planH / 2})`}>{odaBoy} m</text>
              </g>
            </svg>
            {isFloor && (
              <p className="mt-2 text-[11px] text-zinc-400">{cols} sütun × {rows} satır yerleşim. Kenar karoları kesilerek tamamlanır.</p>
            )}
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <ResultCard label="Alan" value={`${sonuc.alanM2.toFixed(2)} m²`} sub="Net döşeme" />
            {isFloor ? (
              <>
                <ResultCard label={malzeme === "fayans" ? "Fayans Adedi" : "Laminat Adedi"} value={`${sonuc.karoAdedi} adet`} sub={`%${fire} fire dahil`} highlight />
                <ResultCard label={malzeme === "fayans" ? "Kutu" : "Paket"} value={`${sonuc.kutuSayisi}`} sub={`${kutuAdedi} adet/kutu`} highlight />
                {malzeme === "fayans" && <ResultCard label="Derz Uzunluğu" value={`≈${sonuc.derzUzunlukM} m`} sub={`${derz} mm derz`} />}
              </>
            ) : (
              <>
                <ResultCard label="Duvar Alanı" value={`${sonuc.duvarAlaniM2} m²`} sub={`${katSayisi} kat`} />
                <ResultCard label="Boya" value={`≈${sonuc.boyaLitre} L`} sub="%15 fire dahil" highlight />
              </>
            )}
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-relaxed text-emerald-700">
            <strong>Öneri:</strong> {sonuc.ozet}
          </div>
        </div>
      </div>

      {/* Diğer Araçlar */}
      <div className="border-t border-zinc-100 pt-6 print:hidden">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Diğer araçlar</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/araclar/fayans-hesaplayici", label: "Fayans hesaplayıcı" },
            { href: "/araclar/boya-hesaplayici", label: "Boya hesaplayıcı" },
            { href: "/araclar/harita-tasarim", label: "Harita tasarımcısı" },
          ].map((l) => (
            <Link key={l.href} href={l.href}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-600 transition hover:border-orange-300 hover:text-orange-600">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
