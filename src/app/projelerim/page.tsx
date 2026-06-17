import type { Metadata } from "next";
import Link from "next/link";
import { ProjelerimClient } from "@/components/projelerim/ProjelerimClient";

export const metadata: Metadata = {
  title: "Projelerim — Kayıtlı Projeler & AI Adım-Adım Rehber",
  description:
    "Proje sihirbazıyla çıkardığınız alet ve malzeme listelerini kaydedin; her proje için yapay zekâ destekli adım-adım uygulama rehberi ve katalog fiyatlarına göre tahmini maliyet alın.",
  alternates: { canonical: "https://hirdavatpro.com/projelerim" },
};

export default function ProjelerimPage() {
  return (
    <div className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-[13px] text-secondary font-body-sm">
        <Link href="/" className="hover:text-primary transition-colors decoration-none font-bold">Ana Sayfa</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Projelerim</span>
      </nav>

      <header className="mb-10 max-w-3xl">
        <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full font-label-caps text-[11px] font-bold uppercase tracking-wider mb-4">
          <span className="material-symbols-outlined text-[16px]">folder_special</span>
          Kayıtlı Projeler
        </span>
        <h1 className="font-headline-lg text-headline-lg md:text-display-lg font-bold mb-3">Projelerim</h1>
        <p className="text-secondary font-body-lg leading-relaxed">
          Proje sihirbazıyla çıkardığınız listeleri buraya kaydedin. Her proje için adım-adım uygulama
          rehberi ve katalog fiyatlarına göre tahmini maliyet üretilir. Kayıtlar bu cihaza özel anonim bir
          anahtarla saklanır — hesap gerektirmez.
        </p>
      </header>

      <ProjelerimClient />
    </div>
  );
}
