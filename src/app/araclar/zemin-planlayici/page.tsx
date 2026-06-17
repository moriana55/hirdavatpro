import type { Metadata } from "next";
import { ZeminPlanlayiciTool } from "./ZeminPlanlayiciTool";

export const metadata: Metadata = {
  title: "Zemin & Yerleşim Planlayıcı — 2D Oda Planı & Malzeme Hesabı",
  description:
    "Oda ölçülerini girin, fayans/laminat/boya seçin; 2D yerleşim planını görselleştirin ve gereken malzeme miktarını (karo adedi, derz, boya litresi) anında hesaplayın. Planı yazdırın veya SVG olarak indirin.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/zemin-planlayici" },
};

export default function ZeminPlanlayiciPage() {
  return (
    <div className="px-4 py-14 md:px-6 md:py-20">
      <ZeminPlanlayiciTool />
    </div>
  );
}
