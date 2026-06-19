import type { Metadata } from "next";
import { ZimparaSecimTool } from "./ZimparaSecimTool";
import { ToolSchema } from "@/components/site/ToolSchema";

export const metadata: Metadata = {
  title: "Zımpara & Grit Seçimi — Malzeme ve İşleme Göre Doğru Seçim",
  description:
    "Ham ahşap, metal, boya katı ve plastik için doğru grit sırası, zımpara cinsi ve uygulama önerisi. Araç tipine göre pratik notlar.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/zimpara-secimi" },
};

export default function ZimparaSecimPage() {
  return (
    <>
      <ToolSchema
        path="/araclar/zimpara-secimi"
        name="Zımpara & Grit Seçim Aracı"
        description="Malzeme ve işleme göre doğru grit sırası, zımpara cinsi ve uygulama önerisi."
        applicationCategory="BrowserApplication"
        faqs={[
          { q: "Zımpara grit numarası ne anlama gelir?", a: "Grit, yüzeydeki aşındırıcı tane yoğunluğudur. Küçük numara (40-80) kaba ve hızlı aşındırma, büyük numara (180-400) ince perdah içindir. Daima kabadan inceye doğru ilerlenir." },
          { q: "Ham ahşap için hangi grit sırası kullanılır?", a: "Tipik sıra: 80 (kaba düzeltme) → 120 (orta) → 180/220 (son perdah). Lake/cila öncesi 220-240'a kadar çıkmak pürüzsüz yüzey verir." },
          { q: "Boya sökmek için hangi zımpara?", a: "Eski boya katmanını sökmek için 60-80 grit kaba zımpara ve mümkünse eksantrik (orbital) zımpara makinesi kullanılır. İşlem sonrası 120-180 ile yüzey hazırlanır." },
        ]}
      />
      <ZimparaSecimTool />
    </>
  );
}
