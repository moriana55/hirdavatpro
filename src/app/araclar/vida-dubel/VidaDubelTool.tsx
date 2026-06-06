"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Layers, ShieldCheck, Weight } from "lucide-react";
import type { TabanMalzeme, MontajYuku, VidaTipi } from "@/lib/vida-dubel/recommend";
import { vidaDubelOner } from "@/lib/vida-dubel/recommend";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const TABAN_OPTIONS: { value: TabanMalzeme; label: string; hint: string }[] = [
  { value: "beton-yogun", label: "Beton (yoğun)", hint: "Kolon, perde duvar, döşeme" },
  { value: "beton-gaz", label: "Gazbeton / Ytong", hint: "Hafif blok, ısı yalıtımlı" },
  { value: "tugla-dolu", label: "Tuğla (dolu)", hint: "Sert, eski bina tuğlası" },
  { value: "tugla-delme", label: "Tuğla (delikli)", hint: "Boşluklu, modern blok" },
  { value: "alcipan", label: "Alçıpan / Rigips", hint: "Bölme duvar, asma tavan" },
  { value: "ahsap", label: "Ahşap / OSB", hint: "Kiriş, lama, panel" },
  { value: "metal-ince", label: "Metal (ince sac)", hint: "Profil, kanal, 1–4 mm" },
  { value: "metal-kalin", label: "Metal (kalın)", hint: "Çelik profil, 5 mm+" },
];

const YUK_OPTIONS: { value: MontajYuku; label: string; hint: string }[] = [
  { value: "hafif", label: "Hafif", hint: "< 5 kg · çerçeve, kablo, ayna" },
  { value: "orta", label: "Orta", hint: "5–25 kg · raf, dolap kapısı" },
  { value: "agir", label: "Ağır", hint: "25 kg+ · mutfak dolabı, klima" },
];

const VIDA_OPTIONS: { value: VidaTipi; label: string }[] = [
  { value: "vidali", label: "Vida (standart)" },
  { value: "civisiz", label: "Perçin / çiviyle" },
  { value: "civata", label: "Civata + somun" },
];

export function VidaDubelTool() {
  const [taban, setTaban] = useState<TabanMalzeme>("beton-yogun");
  const [yuk, setYuk] = useState<MontajYuku>("orta");
  const [vidaTipi, setVidaTipi] = useState<VidaTipi>("vidali");

  const sonuc = useMemo(
    () => vidaDubelOner({ taban, yuk, vidaTipi }),
    [taban, yuk, vidaTipi],
  );

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-14 md:px-6 md:py-20">
      <header className="space-y-4 border-b border-zinc-200 pb-10">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">
          <Link href="/" className="transition hover:text-orange-600/90">Ana sayfa</Link>
          <span className="text-zinc-400">/</span>
          <Link href="/araclar" className="transition hover:text-orange-600/90">Araçlar</Link>
          <span className="text-zinc-400">/</span>
          <span className="text-orange-600/90">Vida & dübel eşleştirme</span>
        </nav>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          Vida & dübel eşleştirme
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-500">
          Montaj yükü ve taban malzemesine göre doğru dübel tipini, vida boyutunu ve delik çapını bulun.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-5 md:gap-10">
        <div className="space-y-8 md:col-span-3">
          <fieldset className="space-y-4">
            <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">Taban malzemesi</legend>
            <RadioGroup value={taban} onValueChange={(v) => setTaban(v as TabanMalzeme)} className="gap-3">
              {TABAN_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors",
                    taban === o.value
                      ? "border-orange-500/50 bg-zinc-100"
                      : "border-zinc-200 bg-white/30 hover:border-zinc-300",
                  )}
                >
                  <RadioGroupItem value={o.value} className="mt-1" />
                  <div className="min-w-0">
                    <span className="block text-sm font-medium text-zinc-800">{o.label}</span>
                    <span className="text-xs text-zinc-500">{o.hint}</span>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">Montaj yükü</legend>
            <RadioGroup value={yuk} onValueChange={(v) => setYuk(v as MontajYuku)} className="gap-3 grid grid-cols-3">
              {YUK_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className={cn(
                    "flex cursor-pointer flex-col gap-1 rounded-lg border px-4 py-3 transition-colors",
                    yuk === o.value
                      ? "border-orange-500/50 bg-zinc-100"
                      : "border-zinc-200 bg-white/30 hover:border-zinc-300",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={o.value} />
                    <span className="text-sm font-medium text-zinc-800">{o.label}</span>
                  </div>
                  <span className="pl-6 text-[11px] text-zinc-500">{o.hint}</span>
                </label>
              ))}
            </RadioGroup>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">Bağlantı tipi</legend>
            <RadioGroup value={vidaTipi} onValueChange={(v) => setVidaTipi(v as VidaTipi)} className="gap-3 grid grid-cols-3">
              {VIDA_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className={cn(
                    "flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 transition-colors text-center",
                    vidaTipi === o.value
                      ? "border-orange-500/50 bg-zinc-100"
                      : "border-zinc-200 bg-white/30 hover:border-zinc-300",
                  )}
                >
                  <RadioGroupItem value={o.value} className="sr-only" />
                  <span className="text-sm font-medium text-zinc-800">{o.label}</span>
                </label>
              ))}
            </RadioGroup>
          </fieldset>
        </div>

        <Card className="md:col-span-2 h-fit border-zinc-200 md:sticky md:top-24">
          <CardHeader>
            <div className="flex items-center gap-2 text-orange-600/90">
              <Layers className="size-5" />
              <CardTitle className="text-base font-semibold text-zinc-900">Öneri</CardTitle>
            </div>
            <CardDescription className="text-zinc-500">{sonuc.baslik}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Dübel tipi</p>
              <p className="mt-1 text-sm font-medium leading-snug text-zinc-900">{sonuc.dubelTipi}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Vida / civata</p>
                <p className="mt-1 text-xs font-medium text-zinc-800">{sonuc.vidaBoyutu}</p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Delik çapı</p>
                <p className="mt-1 text-xs font-medium text-zinc-800">{sonuc.delikCapi}</p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Derinlik</p>
                <p className="mt-1 text-xs font-medium text-zinc-800">{sonuc.derinlik}</p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
                <div className="flex items-center gap-1">
                  <Weight className="size-3 text-orange-600/70" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Maks. yük</p>
                </div>
                <p className="mt-1 text-xs font-medium text-zinc-800">{sonuc.maxYuk}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Montaj notu</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">{sonuc.montajNotu}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-500/90">
                <ShieldCheck className="size-4 shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Dikkat & ipucu</p>
              </div>
              <ul className="list-inside list-disc space-y-1.5 text-xs text-zinc-500 marker:text-zinc-400">
                {sonuc.ipucu.map((t, i) => (
                  <li key={i} className="leading-relaxed">{t}</li>
                ))}
              </ul>
            </div>

            <p className="text-[10px] leading-relaxed text-zinc-400 border-t border-zinc-100 pt-3">
              Öneriler bilgilendirici niteliktedir. Yapısal yükler için mühendis görüşü alın.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
