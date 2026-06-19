import type { Metadata } from "next";
import { MatkapUcuTool } from "@/components/matkap-ucu/MatkapUcuTool";
import { ToolSchema } from "@/components/site/ToolSchema";

export const metadata: Metadata = {
  title: "Matkap ucu seçimi",
  description: "Malzeme ve kullanıma göre matkap ucu ailesi önerisi; darbeli matkap uyumu ve pratik notlar.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/matkap-ucu" },
};

export default function MatkapUcuPage() {
  return (
    <>
      <ToolSchema
        path="/araclar/matkap-ucu"
        name="Matkap Ucu Seçim Aracı"
        description="Malzeme ve kullanıma göre matkap ucu ailesi önerisi; darbeli matkap uyumu ve pratik notlar."
        applicationCategory="BrowserApplication"
        faqs={[
          { q: "Beton delmek için hangi matkap ucu kullanılır?", a: "Beton, tuğla ve taş için sert metal (karbür) uçlu, darbeli matkaba uygun beton ucu (SDS veya silindirik şaft) kullanılır. Ahşap veya metal ucu betonda hızla körelir." },
          { q: "Metal delmek için hangi uç gerekir?", a: "Metal için HSS (yüksek hız çeliği) uçlar tercih edilir; paslanmaz ve sert çelik için kobalt katkılı (HSS-Co) uçlar daha dayanıklıdır. Yağ/soğutma kullanmak uç ömrünü uzatır." },
          { q: "Darbeli matkapla normal uç kullanılır mı?", a: "Darbeli (kırıcı) modda yalnızca darbeye uygun beton uçları kullanılmalıdır. Ahşap/metal uçları darbe altında kırılabilir veya işlevini yitirir." },
        ]}
      />
      <MatkapUcuTool />
    </>
  );
}
