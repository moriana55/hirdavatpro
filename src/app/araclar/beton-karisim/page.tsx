import type { Metadata } from "next";
import { BetonKarisimTool } from "./BetonKarisimTool";

export const metadata: Metadata = {
  title: "Beton Karışım Hesaplayıcı — Hırdavat Pro",
  description:
    "C10'dan C30'a beton sınıfı seçin, hacim veya torba sayısı girin — çimento, kum, çakıl ve su miktarlarını anında hesaplayın.",
};

export default function BetonKarisimPage() {
  return <BetonKarisimTool />;
}
