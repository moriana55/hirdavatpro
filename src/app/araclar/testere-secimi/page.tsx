import type { Metadata } from "next";
import { TestereSecimTool } from "./TestereSecimTool";
import { ToolSchema } from "@/components/site/ToolSchema";

export const metadata: Metadata = {
  title: "Testere & bıçak seçimi",
  description: "Malzeme, kesim tipi ve ortama göre doğru testere ve bıçak önerisi. Daire, şerit, dekupaj, tilki kuyruğu, zincirli.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/testere-secimi" },
};

export default function TestereSecimPage() {
  return (
    <>
      <ToolSchema
        path="/araclar/testere-secimi"
        name="Testere & Bıçak Seçim Aracı"
        description="Malzeme, kesim tipi ve ortama göre doğru testere ve bıçak önerisi."
        applicationCategory="BrowserApplication"
        faqs={[
          { q: "Ahşap kesmek için kaç dişli daire testere bıçağı gerekir?", a: "Kaba ve hızlı kesimler için az dişli (24-40 diş), temiz ve hassas kesimler için çok dişli (48-80 diş) bıçaklar uygundur. Diş sayısı arttıkça kesim temizlenir, hız düşer." },
          { q: "Metal kesmek için hangi testere kullanılır?", a: "İnce metal sac için metal kesme diskli avuç taşlama veya bimetal şerit; profil ve boru için soğuk kesme (metal daire) testeresi uygundur. Ahşap bıçağıyla metal kesilmez." },
          { q: "Dekupaj testeresi ne için kullanılır?", a: "Dekupaj (jigsaw) eğrisel ve içeriden başlayan kesimler içindir. Bıçak seçimi malzemeye göre yapılır: ahşap için iri diş, metal için ince diş, plastik/laminat için özel bıçak." },
        ]}
      />
      <TestereSecimTool />
    </>
  );
}
