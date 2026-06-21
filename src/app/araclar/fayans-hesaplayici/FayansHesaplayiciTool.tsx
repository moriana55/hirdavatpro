"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Sekil = "dikdortgen" | "l-sekli";

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

function hesapla(params: {
  sekil: Sekil;
  oda_en: number; oda_boy: number;
  l_en?: number; l_boy?: number;
  fayans_en: number; fayans_boy: number;
  derz: number;
  fire: number;
  kutu_adedi: number;
}) {
  const { sekil, oda_en, oda_boy, l_en, l_boy, fayans_en, fayans_boy, derz, fire, kutu_adedi } = params;

  let alan_m2 = oda_en * oda_boy;
  if (sekil === "l-sekli" && l_en && l_boy) {
    alan_m2 -= l_en * l_boy;
  }

  const fayans_net_alan = (fayans_en / 100) * (fayans_boy / 100);

  const fayans_adedi_net = Math.ceil(alan_m2 / fayans_net_alan);
  const fireli_alan = alan_m2 * (1 + fire / 100);
  const fayans_adedi_fireli = Math.ceil(fireli_alan / fayans_net_alan);

  const kutular = Math.ceil(fayans_adedi_fireli / kutu_adedi);

  const derz_uzunluk_m =
    (Math.ceil(oda_en / (fayans_en / 100)) * oda_boy) +
    (Math.ceil(oda_boy / (fayans_boy / 100)) * oda_en);

  return {
    alan_m2,
    fireli_alan,
    fayans_adedi_net,
    fayans_adedi_fireli,
    kutular,
    derz_uzunluk_m: Math.ceil(derz_uzunluk_m),
  };
}

const HAZIR_FAYANSLAR = [
  { label: "15×15 cm (küçük karo)", en: 15, boy: 15 },
  { label: "20×20 cm", en: 20, boy: 20 },
  { label: "25×40 cm (duvar klasiği)", en: 25, boy: 40 },
  { label: "30×30 cm", en: 30, boy: 30 },
  { label: "30×60 cm", en: 30, boy: 60 },
  { label: "45×45 cm", en: 45, boy: 45 },
  { label: "60×60 cm (büyük karo)", en: 60, boy: 60 },
  { label: "60×120 cm (büyük format)", en: 60, boy: 120 },
  { label: "Özel boyut", en: 0, boy: 0 },
];

export function FayansHesaplayiciTool() {
  const [sekil, setSekil] = useState<Sekil>("dikdortgen");
  const [oda_en, setOdaEn] = useState(4.0);
  const [oda_boy, setOdaBoy] = useState(3.5);
  const [l_en, setLEn] = useState(1.5);
  const [l_boy, setLBoy] = useState(1.0);
  const [fayans_en, setFayansEn] = useState(30);
  const [fayans_boy, setFayansBoy] = useState(30);
  const [derz, setDerz] = useState(3);
  const [fire, setFire] = useState(10);
  const [kutu_adedi, setKutuAdedi] = useState(9);
  const [hazirSecim, setHazirSecim] = useState(3);

  const sonuc = useMemo(
    () => hesapla({ sekil, oda_en, oda_boy, l_en, l_boy, fayans_en, fayans_boy, derz, fire, kutu_adedi }),
    [sekil, oda_en, oda_boy, l_en, l_boy, fayans_en, fayans_boy, derz, fire, kutu_adedi],
  );

  function hazirSec(idx: number) {
    setHazirSecim(idx);
    const s = HAZIR_FAYANSLAR[idx];
    if (s.en > 0) { setFayansEn(s.en); setFayansBoy(s.boy); }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <nav className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        <Link href="/" className="transition hover:text-orange-600/90">Ana sayfa</Link>
        <span aria-hidden className="text-zinc-400">/</span>
        <Link href="/araclar" className="transition hover:text-orange-600/90">Araçlar</Link>
        <span aria-hidden className="text-zinc-400">/</span>
        <span className="text-orange-600/90">Fayans hesaplayıcı</span>
      </nav>

      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          Fayans & Karo Hesaplayıcı
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-500">
          Oda ölçüleri ve fayans boyutuna göre gereken fayans adedi, kutu sayısı ve derz uzunluğunu hesaplayın.
          Fire payı otomatik eklenir.
        </p>
      </div>

      {/* Oda Şekli */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 space-y-5">
        <div>
          <p className="mb-2 text-sm font-semibold text-zinc-700">Oda Şekli</p>
          <div className="flex gap-2">
            {([["dikdortgen", "Dikdörtgen"], ["l-sekli", "L Şekli (girinti/çıkıntı)"]] as [Sekil, string][]).map(([v, label]) => (
              <button key={v} type="button" onClick={() => setSekil(v)}
                className={cn(
                  "flex-1 rounded-lg border px-3 py-2 text-sm font-semibold transition",
                  sekil === v ? "border-orange-500 bg-orange-500 text-white" : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300",
                )}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Oda Ölçüleri */}
        <div>
          <p className="mb-2 text-sm font-semibold text-zinc-700">Oda Ölçüleri</p>
          <div className="grid gap-3 md:grid-cols-2">
            <NumInput label="Oda Eni" value={oda_en} onChange={setOdaEn} unit="m" min={0.5} max={50} step={0.1} />
            <NumInput label="Oda Boyu" value={oda_boy} onChange={setOdaBoy} unit="m" min={0.5} max={50} step={0.1} />
          </div>
        </div>

        {sekil === "l-sekli" && (
          <div className="rounded-xl border border-zinc-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold text-zinc-500">Çıkarılacak Köşe (girintinin ölçüleri)</p>
            <div className="grid gap-3 md:grid-cols-2">
              <NumInput label="Girinti Eni" value={l_en} onChange={setLEn} unit="m" min={0.1} max={20} step={0.1} />
              <NumInput label="Girinti Boyu" value={l_boy} onChange={setLBoy} unit="m" min={0.1} max={20} step={0.1} />
            </div>
            <p className="mt-2 text-[11px] text-zinc-400">
              L şeklinde: toplam dikdörtgenden köşe alanı çıkarılır. Birden fazla girinti için ayrıca hesaplayın.
            </p>
          </div>
        )}
      </div>

      {/* Fayans Boyutu */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 space-y-4">
        <p className="text-sm font-semibold text-zinc-700">Fayans Boyutu</p>
        <div className="flex flex-wrap gap-2">
          {HAZIR_FAYANSLAR.map((f, i) => (
            <button key={i} type="button" onClick={() => hazirSec(i)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-xs font-semibold transition",
                hazirSecim === i ? "border-orange-500 bg-orange-500 text-white" : "border-zinc-200 bg-white text-zinc-600 hover:border-orange-300",
              )}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <NumInput label="Fayans Eni" value={fayans_en} onChange={(v) => { setFayansEn(v); setHazirSecim(HAZIR_FAYANSLAR.length - 1); }} unit="cm" min={5} max={200} step={1} />
          <NumInput label="Fayans Boyu" value={fayans_boy} onChange={(v) => { setFayansBoy(v); setHazirSecim(HAZIR_FAYANSLAR.length - 1); }} unit="cm" min={5} max={200} step={1} />
        </div>
      </div>

      {/* Derz & Fire & Kutu */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 grid gap-4 md:grid-cols-3">
        <NumInput label="Derz Genişliği" value={derz} onChange={setDerz} unit="mm" min={1} max={20} step={0.5} />
        <NumInput label="Fire Payı" value={fire} onChange={setFire} unit="%" min={5} max={30} step={1} />
        <NumInput label="Kutu Başı Fayans" value={kutu_adedi} onChange={setKutuAdedi} unit="adet" min={1} max={100} step={1} />
      </div>

      {/* Sonuçlar */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Sonuç</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <ResultCard
            label="Döşeme Alanı"
            value={`${sonuc.alan_m2.toFixed(2)} m²`}
            sub={sekil === "l-sekli" ? "Girinti çıkarılmış" : "Net alan"}
          />
          <ResultCard
            label="Fire Dahil Alan"
            value={`${sonuc.fireli_alan.toFixed(2)} m²`}
            sub={`%${fire} fire payı eklenmiş`}
          />
          <ResultCard
            label="Fayans Adedi"
            value={`${sonuc.fayans_adedi_fireli} adet`}
            sub={`Net: ${sonuc.fayans_adedi_net} adet`}
            highlight
          />
          <ResultCard
            label="Kutu Sayısı"
            value={`${sonuc.kutular} kutu`}
            sub={`Kutu başı ${kutu_adedi} adet fayans`}
            highlight
          />
          <ResultCard
            label="Derz Uzunluğu"
            value={`≈${sonuc.derz_uzunluk_m} m`}
            sub={`${derz} mm derz genişliğiyle`}
          />
          <ResultCard
            label="Fayans Ölçüsü"
            value={`${fayans_en}×${fayans_boy} cm`}
            sub={`${(fayans_en / 100 * fayans_boy / 100).toFixed(4)} m² / adet`}
          />
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs leading-relaxed text-emerald-700">
          <strong>Öneri:</strong> {sonuc.alan_m2.toFixed(2)} m² alan için{" "}
          <strong>%{fire} fire payıyla {sonuc.fayans_adedi_fireli} adet</strong> ({sonuc.kutular} kutu){" "}
          {fayans_en}×{fayans_boy} cm fayans gereklidir. Derz için yaklaşık{" "}
          <strong>{sonuc.derz_uzunluk_m} m</strong> derz dolgusu kullanılır.
        </div>
      </div>

      {/* Fire Payı Rehberi */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">Fire Payı Rehberi</h2>
        <div className="overflow-x-auto rounded-xl border border-zinc-200">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-4 py-2 text-left font-semibold text-zinc-600">Döşeme Tipi</th>
                <th className="px-4 py-2 text-right font-semibold text-zinc-600">Önerilen Fire</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Düz, kırpmasız döşeme", "%5–8"],
                ["Standart kesimli döşeme (çoğu oda)", "%10"],
                ["Köşegen (diyagonal) döşeme", "%15"],
                ["Karmaşık şekilli oda veya küçük parçalar", "%15–20"],
                ["Büyük format karo (60×120 cm ve üzeri)", "%10–15"],
              ].map(([tip, fire]) => (
                <tr key={tip} className="border-b border-zinc-100 last:border-0">
                  <td className="px-4 py-2 text-zinc-700">{tip}</td>
                  <td className="px-4 py-2 text-right font-semibold tabular-nums text-orange-700">{fire}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Uyarı */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-700">
        <strong>Not:</strong> Bu hesaplama rehber niteliğindedir. Fayans boyutları üreticiye göre küçük farklar
        gösterebilir. Satın alma öncesi lot numaralarının aynı olduğunu kontrol edin — farklı lot fayanslar
        arasında renk ve ton farkı olabilir.
      </div>

      {/* Diğer Araçlar */}
      <div className="border-t border-zinc-100 pt-6">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Diğer araçlar</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/araclar/boya-hesaplayici", label: "Boya hesaplayıcı" },
            { href: "/araclar/beton-karisim", label: "Beton karışım" },
            { href: "/araclar/kablo-kesiti", label: "Kablo kesiti" },
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
