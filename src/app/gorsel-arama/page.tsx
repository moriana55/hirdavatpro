import type { Metadata } from "next";
import Link from "next/link";
import { GorselAramaClient } from "@/components/gorsel-arama/GorselAramaClient";

export const metadata: Metadata = {
  title: "Görsel Parça Arama — Fotoğrafla Parça Tanı",
  description:
    "Vida, matkap ucu, disk veya herhangi bir hırdavat parçasının fotoğrafını yükleyin; yapay zeka parçayı tanısın ve katalogda eşleşen ürünleri önersin.",
  alternates: { canonical: "https://hirdavatpro.com/gorsel-arama" },
};

export default function GorselAramaPage() {
  return (
    <div className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-[13px] text-secondary font-body-sm">
        <Link href="/" className="hover:text-primary transition-colors decoration-none font-bold">Ana Sayfa</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Görsel Parça Arama</span>
      </nav>

      <header className="mb-10 max-w-3xl">
        <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full font-label-caps text-[11px] font-bold uppercase tracking-wider mb-4">
          <span className="material-symbols-outlined text-[16px]">photo_camera</span>
          Yeni Özellik
        </span>
        <h1 className="font-headline-lg text-headline-lg md:text-display-lg font-bold mb-3">
          Fotoğrafla Parça Tanı
        </h1>
        <p className="text-secondary font-body-lg leading-relaxed">
          Elinizdeki vidayı, matkap ucunu, diski veya tanımadığınız bir parçayı fotoğraflayın.
          Yapay zekâ parçayı tanısın, kataloğumuzda eşleşen ürünleri anında listeleyelim.
        </p>
      </header>

      <GorselAramaClient />
    </div>
  );
}
