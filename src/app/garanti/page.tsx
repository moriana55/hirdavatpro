import type { Metadata } from "next";
import Link from "next/link";
import { GarantiClient } from "@/components/garanti/GarantiClient";

export const metadata: Metadata = {
  title: "Garanti & Servis Takibi — Aletlerinizin Garantisini Yönetin",
  description:
    "Satın aldığınız elektrikli el aletlerini kaydedin; garanti bitiş tarihini ve kalan günü otomatik hesaplayalım. Markaya göre en yakın yetkili servisleri harita üzerinde görün.",
  alternates: { canonical: "https://hirdavatpro.com/garanti" },
};

export default function GarantiPage() {
  return (
    <div className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-[13px] text-secondary font-body-sm">
        <Link href="/" className="hover:text-primary transition-colors decoration-none font-bold">Ana Sayfa</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Garanti & Servis</span>
      </nav>

      <header className="mb-10 max-w-3xl">
        <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full font-label-caps text-[11px] font-bold uppercase tracking-wider mb-4">
          <span className="material-symbols-outlined text-[16px]">verified_user</span>
          Garanti & Servis Takibi
        </span>
        <h1 className="font-headline-lg text-headline-lg md:text-display-lg font-bold mb-3">Garanti & Servis Takibi</h1>
        <p className="text-secondary font-body-lg leading-relaxed">
          Satın aldığınız aletlerin garantisini tek yerden takip edin. Garanti bitiş tarihini ve kalan günü
          otomatik hesaplıyoruz; markaya göre en yakın yetkili servisleri harita üzerinde gösteriyoruz.
        </p>
      </header>

      <GarantiClient />
    </div>
  );
}
