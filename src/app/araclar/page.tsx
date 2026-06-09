import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Disc3, Drill, Layers } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Araçlar — Hırdavat Seçim Araçları",
  description: "Matkap ucu, testere seçimi, vida & dübel eşleştirme ve daha fazlası. Taban malzemesi ve montaj yüküne göre anlık teknik öneri.",
};

const items = [
  {
    href: "/araclar/matkap-ucu",
    title: "Matkap ucu seçimi",
    desc: "Ahşaptan betona: uç ailesi, darbe uyumu ve pratik notlar.",
    icon: Drill,
    live: true,
  },
  {
    href: "/araclar/vida-dubel",
    title: "Vida & dübel eşleştirme",
    desc: "Beton, gazbeton, alçıpan, ahşap ve metal için doğru dübel tipi, vida boyutu ve delik çapı önerisi.",
    icon: Layers,
    live: true,
  },
  {
    href: "/araclar/testere-secimi",
    title: "Testere & bıçak seçimi",
    desc: "Malzeme, kesim tipi ve ortama göre daire, şerit, dekupaj, tilki kuyruğu veya zincirli testere önerisi.",
    icon: Disc3,
    live: true,
  },
] as const;

export default function AraclarPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
      <nav className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
        <Link href="/" className="transition hover:text-orange-600/90">
          Ana sayfa
        </Link>
        <span aria-hidden className="text-zinc-400">
          /
        </span>
        <span className="text-orange-600/90">Araçlar</span>
      </nav>

      <h1 className="mt-6 font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">Araçlar</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-500 md:text-[15px]">
        Her araç tek bir kararı hızlandırmak için. Öneriler bilgilendiricidir; üretici şartları ve iş güvenliği her
        zaman sizin tarafınızda.
      </p>

      <ul className="mt-12 grid gap-6 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          const card = (
            <Card
              className={cn(
                "h-full border-zinc-200 transition",
                item.live ? "bg-zinc-50 hover:border-zinc-300" : "bg-white/30 opacity-80",
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-orange-600/90">
                    <Icon className="size-5 shrink-0" aria-hidden />
                    <CardTitle className="text-lg font-semibold text-zinc-900">{item.title}</CardTitle>
                  </div>
                  {item.live ? (
                    <span className="shrink-0 rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Canlı
                    </span>
                  ) : (
                    <span className="shrink-0 rounded border border-zinc-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      Yakında
                    </span>
                  )}
                </div>
                <CardDescription className="text-[13px] leading-relaxed text-zinc-500">{item.desc}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {item.live ? (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-orange-600/90">
                    Aracı aç
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                ) : (
                  <span className="text-sm text-zinc-400">İçerik hazırlanıyor.</span>
                )}
              </CardContent>
            </Card>
          );

          if (item.live) {
            return (
              <li key={item.href}>
                <Link href={item.href} className="block">
                  {card}
                </Link>
              </li>
            );
          }

          return <li key={item.title}>{card}</li>;
        })}
      </ul>
    </div>
  );
}
