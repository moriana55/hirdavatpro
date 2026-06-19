import type { Metadata } from "next";
import { ZeminPlanlayiciTool } from "./ZeminPlanlayiciTool";
import { ToolSchema } from "@/components/site/ToolSchema";

export const metadata: Metadata = {
  title: "Zemin & Yerleşim Planlayıcı — 2D Oda Planı & Malzeme Hesabı",
  description:
    "Oda ölçülerini girin, fayans/laminat/boya seçin; 2D yerleşim planını görselleştirin ve gereken malzeme miktarını (karo adedi, derz, boya litresi) anında hesaplayın. Planı yazdırın veya SVG olarak indirin.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/zemin-planlayici" },
};

export default function ZeminPlanlayiciPage() {
  return (
    <>
      <ToolSchema
        path="/araclar/zemin-planlayici"
        name="Zemin & Yerleşim Planlayıcı"
        description="Oda ölçülerinden 2D yerleşim planı çıkaran ve malzeme miktarını hesaplayan ücretsiz araç."
        faqs={[
          { q: "Oda zemini için ne kadar malzeme gerekir?", a: "Oda ölçülerini girdiğinizde araç; seçtiğiniz kaplamaya göre (fayans/laminat/boya) gereken karo adedini, derz uzunluğunu veya boya litresini fire payıyla birlikte hesaplar." },
          { q: "Laminat mı fayans mı tercih etmeliyim?", a: "Islak alanlar (banyo, mutfak, balkon) için fayans/seramik; oturma odası ve yatak odası gibi kuru alanlar için laminat parke daha ekonomik ve sıcak bir seçenektir." },
          { q: "Planı kaydedebilir veya yazdırabilir miyim?", a: "Evet. Oluşturduğunuz 2D yerleşim planını yazdırabilir veya SVG dosyası olarak indirip usta/tedarikçiyle paylaşabilirsiniz." },
        ]}
      />
      <div className="px-4 py-14 md:px-6 md:py-20">
        <ZeminPlanlayiciTool />
      </div>
    </>
  );
}
