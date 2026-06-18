import type { Metadata } from "next";
import SearchClient from "./SearchClient";

export const metadata: Metadata = {
  title: "Ürün & Karşılaştırma Arama",
  description:
    "Marka, model veya \"bosch vs makita\" şeklinde karşılaştırma arayın. Tüm hırdavat ürünleri ve teknik karşılaştırmalar tek aramada.",
  alternates: { canonical: "/arama" },
  // Arama sonuç sayfaları indekslenmez (ince/yinelenen içerik önlemi).
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return <SearchClient />;
}
