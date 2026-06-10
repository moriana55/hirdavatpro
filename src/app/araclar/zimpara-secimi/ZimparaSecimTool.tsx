"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Layers, ShieldCheck, ChevronRight } from "lucide-react";
import type { IslemTipi, ZimparaMalzeme, ZimparaArac } from "@/lib/zimpara/recommend";
import { zimparaOner } from "@/lib/zimpara/recommend";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const MALZEME_OPTIONS: { value: ZimparaMalzeme; label: string; hint: string }[] = [
  { value: "ahsap-ham", label: "Ham ahşap", hint: "Çam, meşe, MDF, OSB" },
  { value: "ahsap-boyali", label: "Boyalı / lakeli ahşap", hint: "Kat arası, eski yüzey" },
  { value: "metal-celik", label: "Çelik / demir", hint: "Profil, sac, kaynak" },
  { value: "metal-aluminyum", label: "Alüminyum", hint: "Profil, döküm, levha" },
  { value: "boya-astar", label: "Boya / astar katı", hint: "Kat arası veya son kat öncesi" },
  { value: "plastik", label: "Plastik / ABS", hint: "Levha, boru, döküm parça" },
  { value: "beton-sivi", label: "Beton / şap", hint: "Zemin, duvar, döküm" },
];

const ISLEM_OPTIONS: { value: IslemTipi; label: string }[] = [
  { value: "kaba-zimpara", label: "Kaba zımpara (malzeme alma)" },
  { value: "pürüz-giderme", label: "Pürüz giderme / düzeltme" },
  { value: "boya-oncesi", label: "Boya öncesi hazırlık" },
  { value: "cila-oncesi", label: "Cila / vernik öncesi" },
  { value: "pas-giderme", label: "Pas / korozyon temizliği" },
  { value: "kaynak-temizlik", label: "Kaynak izi / çapak temizliği" },
];

const ARAC_OPTIONS: { value: ZimparaArac; label: string; hint: string }[] = [
  { value: "el", label: "El ile (blok)", hint: "Küçük alan, ince iş" },
  { value: "titresimli", label: "Titreşimli zımpara makinesi", hint: "Yüzey işleme" },
  { value: "disk", label: "Disk / açılı taşlama", hint: "Metal, kaba ahşap" },
  { value: "bant", label: "Bant zımpara makinesi", hint: "Hızlı malzeme alma" },
];

function GritBadge({ grit }: { grit: string }) {
  const num = parseInt(grit);
  const color =
    num <= 60
      ? "bg-red-50 border-red-200 text-red-700"
      : num <= 120
      ? "bg-orange-50 border-orange-200 text-orange-700"
      : num <= 240
      ? "bg-yellow-50 border-yellow-200 text-yellow-700"
      : "bg-emerald-50 border-emerald-200 text-emerald-700";
  return (
    <span className={cn("rounded border px-2.5 py-0.5 text-[11px] font-bold tabular-nums tracking-wide", color)}>
      #{grit}
    </span>
  );
}

export function ZimparaSecimTool() {
  const [malzeme, setMalzeme] = useState<ZimparaMalzeme>("ahsap-ham");
  const [islem, setIslem] = useState<IslemTipi>("boya-oncesi");
  const [arac, setArac] = useState<ZimparaArac>("el");

  const sonuc = useMemo(() => zimparaOner({ malzeme, islem, arac }), [malzeme, islem, arac]);

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
          <span className="text-orange-600/90">Zımpara seçimi</span>
        </nav>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          Zımpara & grit seçimi
        </h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-500">
          Malzeme ve işleme göre doğru grit sırası, zımpara cinsi ve uygulama önerileri. Öneriler bilgilendiricidir;
          üretici talimatları ve iş güvenliği kurallarına uyun.
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Sol — Seçenekler */}
        <div className="space-y-8">
          {/* Malzeme */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-zinc-800">Malzeme</legend>
            <RadioGroup
              value={malzeme}
              onValueChange={(v) => setMalzeme(v as ZimparaMalzeme)}
              className="space-y-2"
            >
              {MALZEME_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition",
                    malzeme === opt.value
                      ? "border-orange-400 bg-orange-50"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300",
                  )}
                >
                  <RadioGroupItem value={opt.value} className="mt-0.5 shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-zinc-900">{opt.label}</span>
                    <span className="ml-2 text-xs text-zinc-400">{opt.hint}</span>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </fieldset>

          {/* İşlem */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-zinc-800">İşlem türü</legend>
            <RadioGroup
              value={islem}
              onValueChange={(v) => setIslem(v as IslemTipi)}
              className="space-y-2"
            >
              {ISLEM_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition",
                    islem === opt.value
                      ? "border-orange-400 bg-orange-50"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300",
                  )}
                >
                  <RadioGroupItem value={opt.value} className="shrink-0" />
                  <span className="text-sm font-medium text-zinc-900">{opt.label}</span>
                </label>
              ))}
            </RadioGroup>
          </fieldset>

          {/* Araç */}
          <fieldset>
            <legend className="mb-3 text-sm font-semibold text-zinc-800">Kullanılan araç</legend>
            <RadioGroup
              value={arac}
              onValueChange={(v) => setArac(v as ZimparaArac)}
              className="grid grid-cols-2 gap-2"
            >
              {ARAC_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer flex-col gap-0.5 rounded-lg border p-3 transition",
                    arac === opt.value
                      ? "border-orange-400 bg-orange-50"
                      : "border-zinc-200 bg-zinc-50 hover:border-zinc-300",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={opt.value} className="shrink-0" />
                    <span className="text-sm font-medium text-zinc-900">{opt.label}</span>
                  </div>
                  <span className="pl-6 text-[11px] text-zinc-400">{opt.hint}</span>
                </label>
              ))}
            </RadioGroup>
          </fieldset>
        </div>

        {/* Sağ — Sonuç */}
        <div className="space-y-4 lg:sticky lg:top-8 lg:self-start">
          <Card className="border-zinc-200 bg-zinc-50">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 text-orange-600/90">
                <Layers className="size-5 shrink-0" />
                <CardTitle className="text-lg font-semibold text-zinc-900">Öneri</CardTitle>
              </div>
              <p className="text-[12px] text-zinc-500">{sonuc.baslik}</p>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Grit sırası */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">Grit sırası</p>
                <div className="flex flex-wrap items-center gap-2">
                  {sonuc.gritSirasi.map((g, i) => (
                    <div key={g} className="flex items-center gap-1">
                      <GritBadge grit={g} />
                      {i < sonuc.gritSirasi.length - 1 && (
                        <ChevronRight className="size-3 text-zinc-300" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Zımpara cinsi */}
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Zımpara cinsi</p>
                <p className="text-sm font-medium text-zinc-800">{sonuc.zimparaCinsi}</p>
              </div>

              {/* Uygulama */}
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-zinc-500">Uygulama notu</p>
                <p className="text-sm leading-relaxed text-zinc-700">{sonuc.uygulama}</p>
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
            Öneriler genel rehber niteliğindedir. Yüzey koşulları, ürün kalitesi ve makine değişkenlik gösterebilir.
            Üretici talimatları her zaman geçerlidir.
          </p>
        </div>
      </div>
    </div>
  );
}
