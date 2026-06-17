import type { Metadata } from "next";
import Link from "next/link";
import { ProjeSihirbaziClient } from "@/components/proje-sihirbazi/ProjeSihirbaziClient";

export const metadata: Metadata = {
  title: "Proje Sihirbazı — İşi Tarif Et, Sepet Çıkar",
  description:
    "Yapacağınız işi kendi cümlelerinizle anlatın (ör. 'banyo fayansı değiştireceğim'); gereken tüm alet, sarf ve güvenlik malzemelerini eşleşen ürünlerle birlikte tek tıkla karşılaştırma sepetinize ekleyin.",
  alternates: { canonical: "https://hirdavatpro.com/proje-sihirbazi" },
};

export default function ProjeSihirbaziPage() {
  return (
    <div className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-[13px] text-secondary font-body-sm">
        <Link href="/" className="hover:text-primary transition-colors decoration-none font-bold">Ana Sayfa</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Proje Sihirbazı</span>
      </nav>

      <header className="mb-10 max-w-3xl">
        <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full font-label-caps text-[11px] font-bold uppercase tracking-wider mb-4">
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          İşi Tarif Et, Sepet Çıkar
        </span>
        <h1 className="font-headline-lg text-headline-lg md:text-display-lg font-bold mb-3">
          Proje Sihirbazı
        </h1>
        <p className="text-secondary font-body-lg leading-relaxed">
          Yapacağınız işi kendi cümlelerinizle yazın. Size gereken aletlerin, sarf
          malzemelerinin ve iş güvenliği ekipmanlarının eksiksiz listesini çıkaralım —
          eşleşen ürünleri tek tıkla karşılaştırma sepetinize ekleyin.
        </p>
      </header>

      <ProjeSihirbaziClient />
    </div>
  );
}
