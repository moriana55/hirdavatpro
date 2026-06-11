"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PaintBucket, ShieldCheck } from "lucide-react";
import type { YuzeyTipi, BoyaTuru } from "@/lib/boya/hesapla";
import { boyaHesapla } from "@/lib/boya/hesapla";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const YUZEY_OPTIONS: { value: YuzeyTipi; label: string; hint: string }[] = [
  { value: "duz-siva", label: "Düz sıva", hint: "Alçı, perdahlı beton" },
  { value: "kaba-siva", label: "Kaba / pürüzlü sıva", hint: "Çimento sıva, taş yüzey" },
  { value: "alcipan", label: "Alçıpan", hint: "Asma tavan, bölme duvar" },
  { value: "ahsap", label: "Ahşap", hint: "Kapı, pervaz, tavan göbeği" },
  { value: "metal", label: "Metal", hint: "Çelik, sac, profil" },
  { value: "tugla", label: "Tuğla / briket", hint: "Görünür tuğla, bims" },
];

const BOYA_OPTIONS: { value: BoyaTuru; label: string; hint: string }[] = [
  { value: "ic-cephe", label: "İç cephe boyası", hint: "Oda, koridor, mutfak" },
  { value: "dis-cephe", label: "Dış cephe boyası", hint: "Bina dışı, balkon" },
  { value: "tavan", label: "Tavan boyası", hint: "Sadece tavan" },
];

function NumInput({
  label,
  value,
  onChange,
  unit,
  min = 0.1,
  max = 100,
  step = 0.1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit: string;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-zinc-600">{label}</span>
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
        <input
          type="number"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Math.max(min, parseFloat(e.target.value) || min))}
          className="w-full bg-transparent text-sm font-medium text-zinc-900 outline-none tabular-nums"
        />
        <span className="shrink-0 text-xs text-zinc-400">{unit}</span>
      </div>
    </label>
  );
}

function RadioOpt<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; hint: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex w-full cursor-pointer items-start gap-3 rounded-lg border p-3 text-left transition",
            value === opt.value
              ? "border-orange-400 bg-orange-50"
              : "border-zinc-200 bg-zinc-50 hover:border-zinc-300",
          )}
        >
          <span
            className={cn(
              "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
              value === opt.value ? "border-orange-500 bg-orange-500" : "border-zinc-300",
            )}
          >
            {value === opt.value && <span className="size-1.5 rounded-full bg-white" />}
          </span>
          <div>
            <span className="text-sm font-medium text-zinc-900">{opt.label}</span>
            <span className="ml-2 text-xs text-zinc-400">{opt.hint}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export function BoyaHesaplamaciTool() {
  const [en, setEn] = useState(4);
  const [boy, setBoy] = useState(5);
  const [yukseklik, setYukseklik] = useState(2.7);
  const [katSayisi, setKatSayisi] = useState<1 | 2 | 3>(2);
  const [yuzeyTipi, setYuzeyTipi] = useState<YuzeyTipi>("duz-siva");
  const [boyaTuru, setBoyaTuru] = useState<BoyaTuru>("ic-cephe");
  const [tavanDahil, setTavanDahil] = useState(false);
  const [kapiSayisi, setKapiSayisi] = useState(1);
  const [pencereSayisi, setPencereSayisi] = useState(1);

  const sonuc = useMemo(
    () =>
      boyaHesapla({
        en,
        boy,
        yukseklik,
        katSayisi,
        yuzeyTipi,
        boyaTuru,
        tavanDahil,
        kapiSayisi,
        pencereSayisi,
      }),
    [en, boy, yukseklik, katSayisi, yuzeyTipi, boyaTuru, tavanDahil, kapiSayisi, pencereSayisi],
  );

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-14 md:px-6 md:py-20">
      <header className="space-y-4 border-b border-zinc-200 pb-10">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">
          <Link href="/" className="transition hover:text-orange-600/90">
            Ana sayfa
          </Link>
          <span className="text-zinc-400">/</span>
          <Link href="/araclar" className="transition hover:text-orange-600/90">
            Araçlar
          </Link>
          <span className="text-zinc-400">/</span>
          <span className="text-orange-600/90">Boya hesaplayıcı</span>
        </nav>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          Boya miktarı hesaplayıcı
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-500">
          Oda ölçüleri, yüzey tipi ve kat sayısına göre ihtiyaç duyulan boya miktarını ve kutu kombinasyonunu hesaplar.
          Öneriler bilgilendiricidir; gerçek tüketim yüzey durumuna göre değişebilir.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Sol — Girişler */}
        <div className="space-y-8">
          {/* Oda boyutları */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-zinc-800">Oda boyutları</legend>
            <div className="grid grid-cols-3 gap-3">
              <NumInput label="En" value={en} onChange={setEn} unit="m" min={0.5} max={50} />
              <NumInput label="Boy" value={boy} onChange={setBoy} unit="m" min={0.5} max={50} />
              <NumInput label="Yükseklik" value={yukseklik} onChange={setYukseklik} unit="m" min={1} max={10} />
            </div>
          </fieldset>

          {/* Yüzey tipi */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-zinc-800">Yüzey tipi</legend>
            <RadioOpt options={YUZEY_OPTIONS} value={yuzeyTipi} onChange={setYuzeyTipi} />
          </fieldset>

          {/* Boya türü */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-zinc-800">Boya türü</legend>
            <RadioOpt options={BOYA_OPTIONS} value={boyaTuru} onChange={setBoyaTuru} />
          </fieldset>

          {/* Kat sayısı */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-zinc-800">Kat sayısı</legend>
            <div className="flex gap-2">
              {([1, 2, 3] as const).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKatSayisi(k)}
                  className={cn(
                    "flex-1 rounded-lg border py-2.5 text-sm font-semibold transition",
                    katSayisi === k
                      ? "border-orange-400 bg-orange-50 text-orange-700"
                      : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-300",
                  )}
                >
                  {k} kat
                </button>
              ))}
            </div>
          </fieldset>

          {/* Ek seçenekler */}
          <fieldset className="space-y-3">
            <legend className="mb-3 text-sm font-semibold text-zinc-800">Ek seçenekler</legend>

            <button
              type="button"
              onClick={() => setTavanDahil(!tavanDahil)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition",
                tavanDahil
                  ? "border-orange-400 bg-orange-50"
                  : "border-zinc-200 bg-zinc-50 hover:border-zinc-300",
              )}
            >
              <span
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded border-2 transition",
                  tavanDahil ? "border-orange-500 bg-orange-500" : "border-zinc-300",
                )}
              >
                {tavanDahil && (
                  <svg viewBox="0 0 10 8" className="size-2.5 fill-white" aria-hidden>
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </svg>
                )}
              </span>
              <span className="text-sm font-medium text-zinc-900">Tavan dahil</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <NumInput
                label="Kapı sayısı"
                value={kapiSayisi}
                onChange={(v) => setKapiSayisi(Math.round(v))}
                unit="adet"
                min={0}
                max={10}
                step={1}
              />
              <NumInput
                label="Pencere sayısı"
                value={pencereSayisi}
                onChange={(v) => setPencereSayisi(Math.round(v))}
                unit="adet"
                min={0}
                max={10}
                step={1}
              />
            </div>
          </fieldset>
        </div>

        {/* Sağ — Sonuç */}
        <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <Card className="border-zinc-200 bg-zinc-50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-orange-600/90">
                <PaintBucket className="size-5 shrink-0" />
                <CardTitle className="text-lg font-semibold text-zinc-900">Hesaplama Sonucu</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Alan özeti */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Brüt alan", val: `${sonuc.brutAlan} m²` },
                  { label: "Düşüm", val: `-${sonuc.dusumAlan} m²` },
                  { label: "Net alan", val: `${sonuc.netAlan} m²` },
                ].map(({ label, val }) => (
                  <div key={label} className="rounded-lg border border-zinc-200 bg-white p-3 text-center">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
                    <p className="mt-0.5 text-base font-bold tabular-nums text-zinc-900">{val}</p>
                  </div>
                ))}
              </div>

              {/* Miktar */}
              <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-orange-500">
                  Önerilen miktar (israf payı dahil)
                </p>
                <p className="text-3xl font-bold tabular-nums text-orange-700">
                  {sonuc.onerilenMiktar} <span className="text-xl font-semibold">L</span>
                </p>
                <p className="mt-0.5 text-xs text-orange-600">
                  Teorik: {sonuc.teorikMiktar} L · Yayma: {sonuc.yaymaSurati} m²/L
                </p>
              </div>

              {/* Kutu önerisi */}
              {sonuc.kutular.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Kutu kombinasyonu</p>
                  <div className="flex flex-wrap gap-2">
                    {sonuc.kutular.map((k, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm font-semibold text-zinc-800"
                      >
                        {k.adet} × {k.boyut}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Uygulama notu */}
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Uygulama notu</p>
                <p className="text-sm leading-relaxed text-zinc-700">{sonuc.uygulamaNotu}</p>
              </div>

              {/* Dikkat */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="mb-2 flex items-center gap-1.5 text-amber-700">
                  <ShieldCheck className="size-4 shrink-0" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Dikkat</span>
                </div>
                <ul className="space-y-1.5">
                  {sonuc.dikkat.map((d, i) => (
                    <li key={i} className="text-xs leading-relaxed text-amber-800">
                      • {d}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <p className="text-[11px] leading-relaxed text-zinc-400">
            Hesaplama teorik olup %15 israf payı içerir. Gerçek tüketim; uygulamacı deneyimi, yüzey hazırlığı ve boya
            markasına göre değişir. Üretici teknik veri sayfası her zaman önceliklidir.
          </p>
        </div>
      </div>
    </div>
  );
}
