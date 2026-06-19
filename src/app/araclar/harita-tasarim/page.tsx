import type { Metadata } from "next";
import HaritaTasarimLoader from "./HaritaTasarimLoader";
import { ToolSchema } from "@/components/site/ToolSchema";

export const metadata: Metadata = {
  title: "Nordic Minimalist Harita Tasarımcısı — HırdavatPro",
  description: "En özel konumlarınızı İskandinav tarzı şık minimalist harita posterlerine dönüştürün. Ücretsiz yüksek kaliteli çıktı alın.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/harita-tasarim" },
};

export default function HaritaTasarimPage() {
  return (
    <>
      <ToolSchema
        path="/araclar/harita-tasarim"
        name="Harita & Zemin Tasarımcısı"
        description="Konumları İskandinav-minimalist harita posterlerine dönüştüren ücretsiz tasarım aracı."
        applicationCategory="DesignApplication"
        faqs={[
          { q: "Harita posteri tasarımı ücretsiz mi?", a: "Evet, araç ücretsizdir ve tarayıcı üzerinden çalışır; kurulum gerektirmez." },
          { q: "Çıktıyı nasıl alabilirim?", a: "Tasarımı yüksek kaliteli görsel olarak dışa aktarabilir, dilerseniz baskı için kaydedebilirsiniz." },
        ]}
      />
      <HaritaTasarimLoader />
    </>
  );
}
