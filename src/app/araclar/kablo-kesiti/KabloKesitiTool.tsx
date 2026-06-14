"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Faz = "tek" | "uc";
type Malzeme = "bakir" | "aluminyum";

// IEC 60364 tabanlı standart kesitler ve taşıma akımları (borulu döşeme, 30°C)
const STANDART_KESITLER: { kesit: number; bakir: number; aluminyum: number }[] = [
  { kesit: 1.5,  bakir: 13,  aluminyum: 0  },
  { kesit: 2.5,  bakir: 18,  aluminyum: 14 },
  { kesit: 4,    bakir: 24,  aluminyum: 18 },
  { kesit: 6,    bakir: 32,  aluminyum: 25 },
  { kesit: 10,   bakir: 43,  aluminyum: 33 },
  { kesit: 16,   bakir: 57,  aluminyum: 44 },
  { kesit: 25,   bakir: 76,  aluminyum: 58 },
  { kesit: 35,   bakir: 96,  aluminyum: 74 },
  { kesit: 50,   bakir: 119, aluminyum: 91 },
  { kesit: 70,   bakir: 150, aluminyum: 114 },
  { kesit: 95,   bakir: 182, aluminyum: 139 },
  { kesit: 120,  bakir: 210, aluminyum: 160 },
];

// Özdirençler Ω·mm²/m
const RO: Record<Malzeme, number> = { bakir: 0.0175, aluminyum: 0.028 };

function hesapla(faz: Faz, malzeme: Malzeme, akim: number, uzunluk: number, gerilem: number) {
  const gerilim = faz === "tek" ? 230 : 400;
  const sarj = faz === "tek" ? 2 : Math.sqrt(3); // tek fazda gidiş-dönüş, üç fazda √3
  const izinliDusus = (gerilim * gerilem) / 100;
  // S = (ρ × L × I × sarj) / ΔU
  const hesaplanan = (RO[malzeme] * uzunluk * akim * sarj) / izinliDusus;

  const onerilir = STANDART_KESITLER.find(
    (r) => r.kesit >= hesaplanan && (malzeme === "bakir" ? r.bakir : r.aluminyum) >= akim,
  );

  return { hesaplanan, onerilir, gerilim, izinliDusus };
}

function NumInput({
  label, value, onChange, unit, min, max, step,
}: {
  label: string; value: number; onChange: (v: number) => void;
  unit: string; min: number; max: number; step: number;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-zinc-600">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
        <input
          type="number"
          min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Math.max(min, parseFloat(e.target.value) || min))}
          className="w-full bg-transparent text-sm font-medium text-zinc-900 outline-none tabular-nums"
        />
        <span className="shrink-0 text-xs text-zinc-400">{unit}</span>
      </div>
    </label>
  );
}

function ResultCard({ label, value, sub, highlight }: {
  label: string; value: string; sub?: string; highlight?: boolean;
}) {
  return (
    <div className={cn("rounded-xl border p-4", highlight ? "border-orange-200 bg-orange-50" : "border-zinc-200 bg-white")}>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
      <p className={cn("mt-1 text-xl font-bold tabular-nums", highlight ? "text-orange-700" : "text-zinc-900")}>{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-zinc-400">{sub}</p>}
    </div>
  );
}

export function KabloKesitiTool() {
  const [faz, setFaz] = useState<Faz>("tek");
  const [malzeme, setMalzeme] = useState<Malzeme>("bakir");
  const [akim, setAkim] = useState(16);
  const [uzunluk, setUzunluk] = useState(20);
  const [gerilem, setGerilem] = useState(3);

  const sonuc = useMemo(
    () => hesapla(faz, malzeme, akim, uzunluk, gerilem),
    [faz, malzeme, akim, uzunluk, gerilem],
  );

  const maxAkim = malzeme === "bakir"
    ? (sonuc.onerilir?.bakir ?? 0)
    : (sonuc.onerilir?.aluminyum ?? 0);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <nav className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        <Link href="/" className="transition hover:text-orange-600/90">Ana sayfa</Link>
        <span aria-hidden className="text-zinc-400">/</span>
        <Link href="/araclar" className="transition hover:text-orange-600/90">Araçlar</Link>
        <span aria-hidden className="text-zinc-400">/</span>
        <span className="text-orange-600/90">Kablo kesiti</span>
      </nav>

      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          Kablo Kesiti Hesaplayıcı
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          Akım, kablo uzunluğu ve izin verilen gerilim düşüşüne göre minimum kablo kesitini hesaplayın.
        </p>
      </div>

      {/* Faz & Malzeme Seçimi */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 space-y-5">
        <div>
          <p className="mb-2 text-sm font-semibold text-zinc-700">Şebeke Tipi</p>
          <div className="flex gap-2">
            {([["tek", "Tek Fazlı (230 V)"], ["uc", "Üç Fazlı (400 V)"]] as [Faz, string][]).map(([v, label]) => (
              <button key={v} type="button" onClick={() => setFaz(v)}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition",
                  faz === v ? "border-orange-500 bg-orange-500 text-white" : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300",
                )}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-zinc-700">İletken Malzeme</p>
          <div className="flex gap-2">
            {([["bakir", "Bakır"], ["aluminyum", "Alüminyum"]] as [Malzeme, string][]).map(([v, label]) => (
              <button key={v} type="button" onClick={() => setMalzeme(v)}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition",
                  malzeme === v ? "border-orange-500 bg-orange-500 text-white" : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300",
                )}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Parametreler */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 grid gap-4 md:grid-cols-3">
        <NumInput label="Akım (A)" value={akim} onChange={setAkim} unit="A" min={1} max={400} step={1} />
        <NumInput label="Kablo Uzunluğu" value={uzunluk} onChange={setUzunluk} unit="m" min={1} max={500} step={1} />
        <NumInput label="Max. Gerilim Düşüşü" value={gerilem} onChange={setGerilem} unit="%" min={1} max={10} step={0.5} />
      </div>

      {/* Sonuçlar */}
      {sonuc.onerilir ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Sonuç</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <ResultCard
              label="Önerilen Kesit"
              value={`${sonuc.onerilir.kesit} mm²`}
              sub={`Hesaplanan min: ${sonuc.hesaplanan.toFixed(2)} mm²`}
              highlight
            />
            <ResultCard
              label="Max. Taşıma Akımı"
              value={`${maxAkim} A`}
              sub={`${malzeme === "bakir" ? "Bakır" : "Alüminyum"}, borulu döşeme`}
            />
            <ResultCard
              label="İzin Verilen Düşüş"
              value={`${sonuc.izinliDusus.toFixed(1)} V`}
              sub={`%${gerilem} × ${sonuc.gerilim} V`}
            />
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-relaxed text-emerald-700">
            <strong>Öneri:</strong> {malzeme === "bakir" ? "Bakır" : "Alüminyum"} {sonuc.onerilir.kesit} mm²
            kablo — {faz === "tek" ? "tek fazlı" : "üç fazlı"} {sonuc.gerilim} V şebeke,{" "}
            {uzunluk} m mesafe, {akim} A yük için uygundur. Devre koruma sigortası max <strong>{maxAkim} A</strong> seçilmelidir.
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
          <strong>Tablo sınırı aşıldı:</strong> {akim} A yük için standart tablomuzda uygun kesit bulunamadı.
          Lütfen bir elektrik mühendisiyle danışın.
        </div>
      )}

      {/* Referans Tablo */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
          Referans: Kablo Kesiti → Max. Akım (Borulu Döşeme, 30°C)
        </h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-4 py-2 text-left font-semibold text-zinc-600">Kesit (mm²)</th>
                <th className="px-4 py-2 text-right font-semibold text-zinc-600">Bakır (A)</th>
                <th className="px-4 py-2 text-right font-semibold text-zinc-600">Alüminyum (A)</th>
              </tr>
            </thead>
            <tbody>
              {STANDART_KESITLER.map((r) => (
                <tr
                  key={r.kesit}
                  className={cn(
                    "border-b border-zinc-100 last:border-0",
                    sonuc.onerilir?.kesit === r.kesit && "bg-orange-50 font-semibold",
                  )}
                >
                  <td className="px-4 py-2 text-zinc-800">{r.kesit}</td>
                  <td className="px-4 py-2 text-right tabular-nums text-zinc-700">{r.bakir}</td>
                  <td className="px-4 py-2 text-right tabular-nums text-zinc-500">
                    {r.aluminyum > 0 ? r.aluminyum : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Uyarı */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-700">
        <strong>Önemli Not:</strong> Bu hesaplama IEC 60364 standardına dayalı rehber niteliğindedir. Gerçek
        kurulum koşulları (gruplu kablo, sıva altı, yüksek çevre sıcaklığı) değerleri değiştirir. Elektrik
        tesisatı için mutlaka yetkili elektrikçi veya elektrik mühendisiyle çalışın.
      </div>

      {/* Diğer Araçlar */}
      <div className="border-t border-zinc-100 pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Diğer araçlar</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/araclar/boya-hesaplayici", label: "Boya hesaplayıcı" },
            { href: "/araclar/beton-karisim", label: "Beton karışım" },
            { href: "/araclar/vida-dubel", label: "Vida & dübel" },
            { href: "/araclar/matkap-ucu", label: "Matkap ucu seçimi" },
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
