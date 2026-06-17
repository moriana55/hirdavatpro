import type { Metadata } from "next";
import { HaritaTasarimClient } from "@/components/araclar/HaritaTasarimClient";

export const metadata: Metadata = {
  title: "Nordic Minimalist Harita Tasarımcısı — HırdavatPro",
  description: "En özel konumlarınızı İskandinav tarzı şık minimalist harita posterlerine dönüştürün. Ücretsiz yüksek kaliteli çıktı alın.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/harita-tasarim" },
};

export default function HaritaTasarimPage() {
  return <HaritaTasarimClient />;
}
