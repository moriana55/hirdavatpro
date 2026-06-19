import type { Metadata } from "next";
import { VidaDubelTool } from "./VidaDubelTool";
import { ToolSchema } from "@/components/site/ToolSchema";

export const metadata: Metadata = {
  title: "Vida & Dübel Eşleştirme — Taban ve Yüke Göre Doğru Seçim",
  description: "Beton, gazbeton, alçıpan, ahşap ve metal için doğru dübel tipi, vida boyutu ve delik çapı önerisi. Montaj yüküne göre anlık seçim aracı.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/vida-dubel" },
};

export default function VidaDubelPage() {
  return (
    <>
      <ToolSchema
        path="/araclar/vida-dubel"
        name="Vida & Dübel Eşleştirme Aracı"
        description="Taban malzemesi ve montaj yüküne göre doğru dübel tipi, vida boyutu ve delik çapı önerisi."
        applicationCategory="BrowserApplication"
        faqs={[
          { q: "Alçıpana ağır eşya nasıl asılır?", a: "Alçıpanda kelebek (toggle) dübel veya metal boşluk dübeli kullanılır. Çok ağır yükler için mutlaka arkadaki ahşap/metal karkasa vidalanmalı veya kelebek dübel tercih edilmelidir." },
          { q: "Gazbetona hangi dübel takılır?", a: "Gazbeton (ytong) için özel uzun spiral gazbeton dübelleri kullanılır. Standart plastik dübel gözenekli yapıda tutmaz ve sıyrılır." },
          { q: "Dübel için delik çapı ne olmalı?", a: "Delik çapı dübelin nominal çapına eşit olmalıdır (ör. 8 mm dübel için 8 mm matkap ucu). Daha büyük delik dübelin tutma gücünü ciddi şekilde düşürür." },
        ]}
      />
      <VidaDubelTool />
    </>
  );
}
