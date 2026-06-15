import type { Metadata } from "next";
import { FayansHesaplayiciTool } from "./FayansHesaplayiciTool";

export const metadata: Metadata = {
  title: "Fayans & Karo Hesaplayıcı — Kaç Kutu Fayans Gerekir?",
  description: "Oda ölçüleri ve fayans boyutuna göre gereken fayans adedi, kutu sayısı ve derz uzunluğunu hesaplayın. Fire payı otomatik eklenir. L şekilli odalar desteklenir.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/fayans-hesaplayici" },
};

export default function FayansHesaplayiciPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
      <FayansHesaplayiciTool />
    </div>
  );
}
