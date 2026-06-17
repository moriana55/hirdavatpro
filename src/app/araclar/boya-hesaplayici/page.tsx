import type { Metadata } from "next";
import { BoyaHesaplamaciTool } from "./BoyaHesaplamaciTool";

export const metadata: Metadata = {
  title: "Boya Miktarı Hesaplayıcı — Hırdavat Pro",
  description:
    "Oda en, boy ve yükseklik ölçülerine göre ihtiyaç duyulan boya miktarını ve ideal kutu kombinasyonunu hesaplayın. Yüzey tipi, kat sayısı ve kapı/pencere düşümü dahil.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/boya-hesaplayici" },
};

export default function BoyaHesaplamaciPage() {
  return <BoyaHesaplamaciTool />;
}
