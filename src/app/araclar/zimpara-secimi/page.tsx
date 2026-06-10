import type { Metadata } from "next";
import { ZimparaSecimTool } from "./ZimparaSecimTool";

export const metadata: Metadata = {
  title: "Zımpara & Grit Seçimi — Malzeme ve İşleme Göre Doğru Seçim",
  description:
    "Ham ahşap, metal, boya katı ve plastik için doğru grit sırası, zımpara cinsi ve uygulama önerisi. Araç tipine göre pratik notlar.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/zimpara-secimi" },
};

export default function ZimparaSecimPage() {
  return <ZimparaSecimTool />;
}
