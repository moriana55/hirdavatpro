"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Disc3, ShieldCheck, Zap } from "lucide-react";
import type { KesimMalzemesi, TestereAmaci, OrtamTipi } from "@/lib/testere/recommend";
import { testereOner } from "@/lib/testere/recommend";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const MALZEME_OPTIONS: { value: KesimMalzemesi; label: string; hint: string }[] = [
  { value: "ahsap-yumusak", label: "Yumuşak ahşap", hint: "Çam, ladin, kavak" },
  { value: "ahsap-sert", label: "Sert ahşap", hint: "Meşe, kayın, ceviz" },
  { value: "mdf-sunta", label: "MDF / Sunta / Laminat", hint: "Panel malzeme" },
  { value: "metal-yumusak", label: "Metal (yumuşak)", hint: "Alüminyum, bakır" },
  { value: "metal-sert", label: "Metal (sert)", hint: "Çelik, paslanmaz" },
  { value: "plastik", label: "Plastik / PVC", hint: "Boru, levha" },
  { value: "beton-tugla", label: "Beton / Tuğla", hint: "Elmas disk ile" },
];

const AMAC_OPTIONS: { value: TestereAmaci; label: string }[] = [
  { value: "duz-kesim", label: "Düz kesim" },
  { value: "egri-kesim", label: "Eğri / profil kesim" },
  { value: "hassas-marangoz", label: "Hassas marangoz kesimi" },
  { value: "budama", label: "Budama / dal" },
  { value: "yikim", label: "Yıkım / söküm" },
];

const ORTAM_OPTIONS: { value: OrtamTipi; label: string }[] = [
  { value: "atolye", label: "Atölye" },
  { value: "santiye", label: "Şantiye" },
  { value: "hobi", label: "Hobi / ev" },
];

export function TestereSecimTool() {
  const [malzeme, setMalzeme] = useState<KesimMalzemesi>("ahsap-yumusak");
  const [amac, setAmac] = useState<TestereAmaci>("duz-kesim");
  const [ortam, setOrtam] = useState<OrtamTipi>("atolye");
  const [kablosuz, setKablosuz] = useState(false);

  const sonuc = useMemo(
    () => testereOner({ malzeme, amac, ortam, kablosuz }),
    [malzeme, amac, ortam, kablosuz],
  );

  return (
    <div className="mx-auto max-w-5xl space-y-10 px-4 py-14 md:px-6 md:py-20">
      <header className="space-y-4 border-b border-zinc-200 pb-10">
        <nav className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">
          <Link href="/" className="transition hover:text-orange-600/90">Ana sayfa</Link>
          <span className="text-zinc-400">/</span>
          <Link href="/araclar" className="transition hover:text-orange-600/90">Araçlar</Link>
          <span className="text-zinc-400">/</span>
          <span className="text-orange-600/90">Testere seçimi</span>
        </nav>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          Testere & bıçak seçimi
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-500">
          Neyi keseceğinize ve nasıl keseceğinize göre doğru makine + bıçak kombinasyonunu bulun.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-5 md:gap-10">
        <div className="space-y-8 md:col-span-3">
          <fieldset className="space-y-4">
            <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">Kesim malzemesi</legend>
            <RadioGroup value={malzeme} onValueChange={(v) => setMalzeme(v as KesimMalzemesi)} className="gap-3">
              {MALZEME_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors",
                    malzeme === o.value ? "border-orange-500/50 bg-zinc-100" : "border-zinc-200 bg-white/30 hover:border-zinc-300",
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
            <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">Kesim amacı</legend>
            <RadioGroup value={amac} onValueChange={(v) => setAmac(v as TestereAmaci)} className="gap-3">
              {AMAC_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors",
                    amac === o.value ? "border-orange-500/50 bg-zinc-100" : "border-zinc-200 bg-white/30 hover:border-zinc-300",
                  )}
                >
                  <RadioGroupItem value={o.value} />
                  <span className="text-sm font-medium text-zinc-800">{o.label}</span>
                </label>
              ))}
            </RadioGroup>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">Kullanım ortamı</legend>
            <RadioGroup value={ortam} onValueChange={(v) => setOrtam(v as OrtamTipi)} className="gap-3 grid grid-cols-3">
              {ORTAM_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className={cn(
                    "flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 transition-colors text-center",
                    ortam === o.value ? "border-orange-500/50 bg-zinc-100" : "border-zinc-200 bg-white/30 hover:border-zinc-300",
                  )}
                >
                  <RadioGroupItem value={o.value} className="sr-only" />
                  <span className="text-sm font-medium text-zinc-800">{o.label}</span>
                </label>
              ))}
            </RadioGroup>
          </fieldset>

          <div className="space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">Güç kaynağı</span>
            <button
              type="button"
              role="switch"
              aria-checked={kablosuz}
              onClick={() => setKablosuz((d) => !d)}
              className={cn(
                "flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                kablosuz ? "border-orange-500/40 bg-orange-500/10" : "border-zinc-200 bg-white/30 hover:border-zinc-300",
              )}
            >
              <span className="font-medium text-zinc-800">Akülü / kablosuz tercih</span>
              <span className={cn("relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors", kablosuz ? "border-orange-500 bg-orange-600/30" : "border-zinc-600 bg-zinc-800")}>
                <span className={cn("ml-1 inline-block size-4 rounded-full bg-zinc-200 transition-transform", kablosuz && "translate-x-5 bg-orange-500")} />
              </span>
            </button>
          </div>
        </div>

        <Card className="md:col-span-2 h-fit border-zinc-200 md:sticky md:top-24">
          <CardHeader>
            <div className="flex items-center gap-2 text-orange-600/90">
              <Disc3 className="size-5" />
              <CardTitle className="text-base font-semibold text-zinc-900">Öneri</CardTitle>
            </div>
            <CardDescription className="text-zinc-500">{sonuc.baslik}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Makine tipi</p>
              <p className="mt-1 text-sm font-medium leading-snug text-zinc-900 flex items-center gap-2">
                <Zap className="size-4 text-orange-600/70 shrink-0" />
                {sonuc.makineTipi}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Bıçak / disk önerisi</p>
              <p className="mt-1 text-sm font-medium leading-snug text-zinc-900">{sonuc.bicakOnerisi}</p>
            </div>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Diş detayı</p>
              <p className="mt-1 text-xs text-zinc-400">{sonuc.disDetayi}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Malzeme notu</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-400">{sonuc.malzemeNotu}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-500/90">
                <ShieldCheck className="size-4 shrink-0" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Güvenlik & ipuçları</p>
              </div>
              <ul className="list-inside list-disc space-y-1.5 text-xs text-zinc-500 marker:text-zinc-400">
                {sonuc.ipucu.map((t, i) => (
                  <li key={i} className="leading-relaxed">{t}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
