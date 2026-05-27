"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Drill, ShieldCheck } from "lucide-react";
import type { Kullanim, Malzeme } from "@/lib/matkap-ucu/recommend";
import { oneriMetni } from "@/lib/matkap-ucu/recommend";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const MALZEME_OPTIONS: { value: Malzeme; label: string; hint: string }[] = [
  { value: "ahsap", label: "Ahşap", hint: "Kereste, kontrplak" },
  { value: "plastik", label: "Plastik", hint: "PVC, akrilik" },
  { value: "metal_yumusak", label: "Metal yumuşak", hint: "Bakır, alüminyum" },
  { value: "metal_sert", label: "Metal sert", hint: "Paslanmaz, sert çelik" },
  { value: "beton_tas", label: "Beton / taş", hint: "Duvar, betonarme" },
];

const KULLANIM_OPTIONS: { value: Kullanim; label: string }[] = [
  { value: "delik_acma", label: "Temiz delik" },
  { value: "sabitleme_ongesi", label: "Vida / dübel öncesi" },
  { value: "genis_acma", label: "Geniş çap" },
];

export function MatkapUcuTool() {
  const [malzeme, setMalzeme] = useState<Malzeme>("ahsap");
  const [kullanim, setKullanim] = useState<Kullanim>("delik_acma");
  const [darbeli, setDarbeli] = useState(false);

  const sonuc = useMemo(
    () => oneriMetni({ malzeme, kullanim, darbeliMatkap: darbeli }),
    [malzeme, kullanim, darbeli],
  );

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-14 md:px-6 md:py-20">
      <header className="space-y-4 border-b border-zinc-200 pb-10">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">
          <Link href="/" className="transition hover:text-orange-600/90">
            Ana sayfa
          </Link>
          <span aria-hidden className="text-zinc-400">
            /
          </span>
          <Link href="/araclar" className="transition hover:text-orange-600/90">
            Araçlar
          </Link>
          <span aria-hidden className="text-zinc-400">
            /
          </span>
          <span className="text-orange-600/90">Matkap ucu</span>
        </nav>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          Matkap ucu seçimi
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-500">
          Malzeme ve işin türüne göre uç ailesi önerisi. Üretici tabloları ve şantiye güvenliği her zaman önceliklidir.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-5 md:gap-10">
        <div className="space-y-8 md:col-span-3">
          <fieldset className="space-y-4">
            <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">Malzeme</legend>
            <RadioGroup value={malzeme} onValueChange={(v) => setMalzeme(v as Malzeme)} className="gap-3">
              {MALZEME_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors",
                    malzeme === o.value
                      ? "border-orange-500/50 bg-zinc-100"
                      : "border-zinc-200 bg-white/30 hover:border-zinc-300",
                  )}
                >
                  <RadioGroupItem value={o.value} id={`m-${o.value}`} className="mt-1" />
                  <div className="min-w-0">
                    <span className="block text-sm font-medium text-zinc-800">{o.label}</span>
                    <span className="text-xs text-zinc-500">{o.hint}</span>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">Kullanım</legend>
            <RadioGroup value={kullanim} onValueChange={(v) => setKullanim(v as Kullanim)} className="gap-3">
              {KULLANIM_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                    kullanim === o.value
                      ? "border-orange-500/50 bg-zinc-100"
                      : "border-zinc-200 bg-white/30 hover:border-zinc-300",
                  )}
                >
                  <RadioGroupItem value={o.value} id={`k-${o.value}`} />
                  <span className="text-sm font-medium text-zinc-800">{o.label}</span>
                </label>
              ))}
            </RadioGroup>
          </fieldset>

          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">Matkap modu</span>
            <button
              type="button"
              role="switch"
              aria-checked={darbeli}
              onClick={() => setDarbeli((d) => !d)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                darbeli ? "border-orange-500/40 bg-orange-500/10" : "border-zinc-200 bg-white/30 hover:border-zinc-300",
              )}
            >
              <span className="font-medium text-zinc-800">Darbeli matkap</span>
              <span
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors",
                  darbeli ? "border-orange-500 bg-orange-600/30" : "border-zinc-600 bg-zinc-800",
                )}
              >
                <span
                  className={cn(
                    "ml-1 inline-block size-4 rounded-full bg-zinc-200 transition-transform",
                    darbeli && "translate-x-5 bg-orange-500",
                  )}
                />
              </span>
            </button>
            <p className="text-xs text-zinc-400">Betonda SDS + darbe; ahşap/plastikte genelde darbesiz.</p>
          </div>
        </div>

        <Card className="md:col-span-2 h-fit border-zinc-200 md:sticky md:top-24">
          <CardHeader>
            <div className="flex items-center gap-2 text-orange-600/90">
              <Drill className="size-5" />
              <CardTitle className="text-base font-semibold text-zinc-900">Öneri</CardTitle>
            </div>
            <CardDescription className="text-zinc-500">{sonuc.baslik}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Uç ailesi</p>
              <p className="mt-1 text-sm font-medium leading-snug text-zinc-900">{sonuc.ucAilesi}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Uyum</p>
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{sonuc.malzemeUyumu}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Darbe</p>
              <p className="mt-1 text-xs text-zinc-400">{sonuc.darbeNotu}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-500/90">
                <ShieldCheck className="size-4 shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Notlar</p>
              </div>
              <ul className="list-inside list-disc space-y-1.5 text-xs text-zinc-500 marker:text-zinc-400">
                {sonuc.ipucu.map((t, i) => (
                  <li key={i} className="leading-relaxed">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="outline" className="w-full border-zinc-300 text-zinc-400" type="button" disabled>
              PDF özet (yakında)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
