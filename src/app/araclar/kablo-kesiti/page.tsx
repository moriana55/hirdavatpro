import type { Metadata } from "next";
import { KabloKesitiTool } from "./KabloKesitiTool";
import { ToolSchema } from "@/components/site/ToolSchema";

export const metadata: Metadata = {
  title: "Kablo Kesiti Hesaplayıcı — Doğru Kablo Seçimi",
  description: "Akım, kablo uzunluğu ve izin verilen gerilim düşüşüne göre minimum bakır veya alüminyum kablo kesitini anında hesaplayın. IEC 60364 tabanlı.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/kablo-kesiti" },
};

export default function KabloKesitiPage() {
  return (
    <>
      <ToolSchema
        path="/araclar/kablo-kesiti"
        name="Kablo Kesiti Hesaplayıcı"
        description="Akım, mesafe ve gerilim düşüşüne göre minimum kablo kesitini hesaplayan ücretsiz araç."
        faqs={[
          { q: "Kablo kesiti neye göre seçilir?", a: "Kablo kesiti; taşınacak akım (amper), hat uzunluğu, izin verilen gerilim düşüşü ve iletken cinsine (bakır/alüminyum) göre belirlenir. Uzun hatlarda gerilim düşüşü kesiti büyütür." },
          { q: "2,5 mm² kablo kaç amper taşır?", a: "Tek başına serili bakır 2,5 mm² kablo döşeme şekline göre yaklaşık 16-21 A taşıyabilir. Kesin değer döşeme yöntemi ve ortam sıcaklığına bağlıdır; aracın çıktısını referans alın." },
          { q: "Bakır mı alüminyum kablo mu daha iyi?", a: "Bakır daha iyi iletkendir ve aynı akım için daha ince kesit yeter; alüminyum daha ucuz ama aynı akım için daha kalın kesit gerektirir. İç tesisatta genellikle bakır tercih edilir." },
        ]}
      />
      <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
        <KabloKesitiTool />
      </div>
    </>
  );
}
