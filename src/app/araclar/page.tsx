import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Disc3, Drill, Eraser, Grid3x3, HardHat, LayoutGrid, Layers, Map, PaintBucket, Sparkles, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Araçlar — Hırdavat Seçim & Hesaplama Araçları",
  description: "Akıllı alet danışmanı, matkap ucu, testere seçimi, vida & dübel eşleştirme, zımpara grit seçimi, boya/beton/kablo/fayans hesaplayıcıları ve harita tasarımcısı. Taban malzemesi ve işleme göre anlık teknik öneri.",
  alternates: { canonical: "https://hirdavatpro.com/araclar" },
};

const items = [
  {
    href: "/araclar/akilli-secim",
    title: "Akıllı Alet Danışmanı (Sihirbaz)",
    desc: "Kullanım şartları, bütçe ve beklentilerinize en uygun endüstriyel aleti mühendislik gerekçeleriyle keşfedin.",
    icon: Sparkles,
    live: true,
  },
  {
    href: "/araclar/matkap-ucu",
    title: "Matkap Ucu Seçimi",
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
  {
    href: "/araclar/zimpara-secimi",
    title: "Zımpara & grit seçimi",
    desc: "Ham ahşap, metal, boya katı ve plastik için doğru grit sırası, zımpara cinsi ve uygulama önerisi.",
    icon: Eraser,
    live: true,
  },
  {
    href: "/araclar/boya-hesaplayici",
    title: "Boya miktarı hesaplayıcı",
    desc: "Oda ölçüleri, yüzey tipi ve kat sayısına göre gereken boya miktarını ve ideal kutu kombinasyonunu hesaplayın.",
    icon: PaintBucket,
    live: true,
  },
  {
    href: "/araclar/beton-karisim",
    title: "Beton karışım hesaplayıcı",
    desc: "C10'dan C30'a beton sınıfı seçin, hacim veya torba sayısı girin — çimento, kum, çakıl ve su miktarlarını anında hesaplayın.",
    icon: HardHat,
    live: true,
  },
  {
    href: "/araclar/kablo-kesiti",
    title: "Kablo kesiti hesaplayıcı",
    desc: "Akım, kablo uzunluğu ve izin verilen gerilim düşüşüne göre minimum bakır veya alüminyum kablo kesitini anında hesaplayın.",
    icon: Zap,
    live: true,
  },
  {
    href: "/araclar/fayans-hesaplayici",
    title: "Fayans & karo hesaplayıcı",
    desc: "Oda ölçüleri ve fayans boyutuna göre gereken fayans adedi, kutu sayısı ve derz uzunluğunu hesaplayın. Fire payı otomatik eklenir.",
    icon: Grid3x3,
    live: true,
  },
  {
    href: "/araclar/zemin-planlayici",
    title: "Zemin & Yerleşim Planlayıcı",
    desc: "Oda ölçülerini girin, fayans/laminat/boya seçin; 2D yerleşim planını görselleştirip malzeme miktarını hesaplayın. Yazdırın veya SVG indirin.",
    icon: LayoutGrid,
    live: true,
  },
  {
    href: "/araclar/harita-tasarim",
    title: "Harita & Zemin Tasarımcısı",
    desc: "Nordic-minimalist zemin ve yerleşim planı tasarımcısı: ölçüleri girin, malzeme ve düzeni görselleştirin.",
    icon: Map,
    live: true,
  },
] as const;

export default function AraclarPage() {
  return (
    <div className="mx-auto max-w-max-width px-margin-mobile py-14 md:px-margin-desktop md:py-20 pt-32">
      <nav className="flex flex-wrap items-center gap-2 font-label-caps text-label-caps text-secondary">
        <Link href="/" className="transition hover:text-primary decoration-none font-bold">
          Ana sayfa
        </Link>
        <span aria-hidden className="text-border-subtle">
          /
        </span>
        <span className="text-primary">Araçlar</span>
      </nav>

      <span className="badge badge-tech mt-6">Teknik Hesaplama</span>
      <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight text-on-surface md:text-4xl">Seçim &amp; Hesaplama Araçları</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary md:text-[15px]">
        Her araç tek bir kararı hızlandırmak için. Öneriler bilgilendiricidir; üretici şartları ve iş güvenliği her
        zaman sizin tarafınızda.
      </p>

      <ul className="mt-12 grid gap-gutter md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;
          const card = (
            <Card
              className={cn(
                "h-full border-border-subtle transition group",
                item.live ? "bg-surface-container-lowest hover:border-primary hover:shadow-md" : "bg-surface-container-low opacity-80",
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-primary">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary-fixed text-on-primary-fixed-variant">
                      <Icon className="size-4.5 shrink-0" aria-hidden />
                    </span>
                    <CardTitle className="text-lg font-bold text-on-surface">{item.title}</CardTitle>
                  </div>
                  {item.live ? (
                    <span className="shrink-0 rounded border border-success-vibrant/30 bg-success-vibrant/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success-vibrant">
                      Canlı
                    </span>
                  ) : (
                    <span className="shrink-0 rounded border border-border-subtle px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary">
                      Yakında
                    </span>
                  )}
                </div>
                <CardDescription className="text-[13px] leading-relaxed text-secondary">{item.desc}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {item.live ? (
                  <span className="inline-flex items-center gap-1 font-label-caps text-label-caps font-bold text-primary group-hover:gap-2 transition-all">
                    Aracı aç
                    <ArrowRight className="size-4" aria-hidden />
                  </span>
                ) : (
                  <span className="text-sm text-secondary/70">İçerik hazırlanıyor.</span>
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
