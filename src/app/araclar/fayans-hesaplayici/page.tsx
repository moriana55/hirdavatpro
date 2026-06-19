import type { Metadata } from "next";
import { FayansHesaplayiciTool } from "./FayansHesaplayiciTool";
import { ToolSchema } from "@/components/site/ToolSchema";

export const metadata: Metadata = {
  title: "Fayans & Karo Hesaplayıcı — Kaç Kutu Fayans Gerekir?",
  description: "Oda ölçüleri ve fayans boyutuna göre gereken fayans adedi, kutu sayısı ve derz uzunluğunu hesaplayın. Fire payı otomatik eklenir. L şekilli odalar desteklenir.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/fayans-hesaplayici" },
};

export default function FayansHesaplayiciPage() {
  return (
    <>
      <ToolSchema
        path="/araclar/fayans-hesaplayici"
        name="Fayans & Karo Hesaplayıcı"
        description="Oda ölçülerine göre gereken fayans adedi, kutu sayısı ve derz uzunluğunu hesaplayan ücretsiz araç."
        faqs={[
          { q: "Kaç kutu fayans almalıyım?", a: "Önce döşenecek alanı (m²) hesaplayın, fayans boyutuna göre adet bulun ve %10 fire payı ekleyin. Aracımız oda ölçüsü ve fayans boyutundan kutu sayısını otomatik hesaplar." },
          { q: "Fayans alırken neden fire payı eklenir?", a: "Kesimler, kenar uyumları, kırılmalar ve sonradan tamir için %10 (karmaşık/diyagonal döşemede %15) fazladan fayans alınması önerilir. Aynı seri/parti numarasından almak renk tutarlılığı sağlar." },
          { q: "1 m²'ye kaç fayans gider?", a: "Fayans boyutuna bağlıdır. Örneğin 30x30 cm fayanstan 1 m²'ye yaklaşık 11 adet, 60x60 cm fayanstan ise yaklaşık 3 adet gider (derz kalınlığı hariç)." },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <FayansHesaplayiciTool />
      </div>
    </>
  );
}
