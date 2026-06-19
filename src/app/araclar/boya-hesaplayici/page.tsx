import type { Metadata } from "next";
import { BoyaHesaplamaciTool } from "./BoyaHesaplamaciTool";
import { ToolSchema } from "@/components/site/ToolSchema";

export const metadata: Metadata = {
  title: "Boya Miktarı Hesaplayıcı — Hırdavat Pro",
  description:
    "Oda en, boy ve yükseklik ölçülerine göre ihtiyaç duyulan boya miktarını ve ideal kutu kombinasyonunu hesaplayın. Yüzey tipi, kat sayısı ve kapı/pencere düşümü dahil.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/boya-hesaplayici" },
};

export default function BoyaHesaplamaciPage() {
  return (
    <>
      <ToolSchema
        path="/araclar/boya-hesaplayici"
        name="Boya Miktarı Hesaplayıcı"
        description="Oda ölçüleri, yüzey tipi ve kat sayısına göre gereken boya miktarını hesaplayan ücretsiz araç."
        faqs={[
          { q: "Bir oda için kaç litre boya gerekir?", a: "Boyanacak duvar alanını (m²) hesaplayın, kat sayısıyla çarpın ve boyanın verim değerine (genellikle 1 litre yaklaşık 8-12 m²/kat) bölün. Aracımız ölçüleri girdiğinizde otomatik hesaplar." },
          { q: "Kaç kat boya atmalıyım?", a: "Yeni veya renk değişimi olan yüzeylerde genellikle 2 kat önerilir. Astar atılmış düzgün yüzeylerde 2 kat çoğunlukla yeterlidir; koyu rengi açığa çevirirken 3 kat gerekebilir." },
          { q: "Boya hesabında kapı ve pencere düşülür mü?", a: "Evet, hassas hesap için kapı ve pencere alanları toplam duvar alanından düşülür. Aracımız kapı/pencere düşümünü hesaba katar." },
        ]}
      />
      <BoyaHesaplamaciTool />
    </>
  );
}
