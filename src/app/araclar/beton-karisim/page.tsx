import type { Metadata } from "next";
import { BetonKarisimTool } from "./BetonKarisimTool";
import { ToolSchema } from "@/components/site/ToolSchema";

export const metadata: Metadata = {
  title: "Beton Karışım Hesaplayıcı — Hırdavat Pro",
  description:
    "C10'dan C30'a beton sınıfı seçin, hacim veya torba sayısı girin — çimento, kum, çakıl ve su miktarlarını anında hesaplayın.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/beton-karisim" },
};

export default function BetonKarisimPage() {
  return (
    <>
      <ToolSchema
        path="/araclar/beton-karisim"
        name="Beton Karışım Hesaplayıcı"
        description="Beton sınıfına ve hacme göre çimento, kum, çakıl ve su miktarlarını hesaplayan ücretsiz araç."
        faqs={[
          { q: "1 m³ beton için kaç torba çimento gerekir?", a: "Beton sınıfına bağlıdır. Yaklaşık olarak C20 beton için 1 m³'e 300-350 kg (yaklaşık 6-7 torba 50 kg) çimento gider. Kesin değer için sınıfı seçip aracı kullanın." },
          { q: "Beton sınıfları (C16, C20, C25) ne demek?", a: "C harfinden sonraki sayı, betonun 28 günlük basınç dayanımını (MPa) belirtir. C20, 20 MPa dayanımlı betondur. Yüksek sınıf daha fazla çimento ve dikkat gerektirir." },
          { q: "Su/çimento oranı neden önemli?", a: "Fazla su betonun dayanımını ciddi şekilde düşürür. İdeal su/çimento oranı genellikle 0,45-0,60 arasındadır; kıvam için su yerine akışkanlaştırıcı katkı tercih edilir." },
        ]}
      />
      <BetonKarisimTool />
    </>
  );
}
