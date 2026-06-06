import type { Metadata } from "next";
import { VidaDubelTool } from "./VidaDubelTool";

export const metadata: Metadata = {
  title: "Vida & Dübel Eşleştirme — Taban ve Yüke Göre Doğru Seçim",
  description: "Beton, gazbeton, alçıpan, ahşap ve metal için doğru dübel tipi, vida boyutu ve delik çapı önerisi. Montaj yüküne göre anlık seçim aracı.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/vida-dubel" },
};

export default function VidaDubelPage() {
  return <VidaDubelTool />;
}
