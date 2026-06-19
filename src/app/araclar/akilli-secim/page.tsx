import { getProducts } from "@/lib/products/store";
import { AkilliSecimWizardClient } from "@/components/araclar/AkilliSecimWizardClient";
import { ToolSchema } from "@/components/site/ToolSchema";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Akıllı Alet Danışmanı — HırdavatPro",
  description: "Bütçeniz, kullanım yoğunluğunuz ve ihtiyaç duyduğunuz özelliklere göre en ideal profesyonel aleti saniyeler içinde belirleyin.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/akilli-secim" },
};

export default async function AkilliSecimPage() {
  const products = await getProducts();

  return (
    <>
      <ToolSchema
        path="/araclar/akilli-secim"
        name="Akıllı Alet Danışmanı"
        description="Bütçe, kullanım yoğunluğu ve ihtiyaca göre en uygun profesyonel aleti öneren ücretsiz seçim sihirbazı."
        applicationCategory="BrowserApplication"
        faqs={[
          { q: "Hobi mi profesyonel kullanım için mi alet almalıyım?", a: "Ara sıra ev işleri için hobi/DIY sınıfı aletler ekonomik ve yeterlidir. Günlük yoğun kullanım veya şantiye için profesyonel sınıf, kömürsüz (fırçasız) motorlu ve daha yüksek garantili modeller önerilir." },
          { q: "Akülü mü kablolu mu alet daha iyi?", a: "Hareket özgürlüğü ve saha işleri için akülü; sürekli yüksek güç gerektiren atölye işleri için kablolu avantajlıdır. Akülülerde aynı marka batarya platformunda kalmak maliyeti düşürür." },
          { q: "Marka seçerken neye dikkat etmeliyim?", a: "Yedek parça ve servis erişimi, batarya platformu uyumu, garanti süresi ve gerçek kullanıcı geri bildirimleri belirleyicidir. Bu araç ihtiyaçlarınıza göre tarafsız öneri üretir." },
        ]}
      />
      <AkilliSecimWizardClient allProducts={products} />
    </>
  );
}
