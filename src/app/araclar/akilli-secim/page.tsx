import { getProducts } from "@/lib/products/store";
import { AkilliSecimWizardClient } from "@/components/araclar/AkilliSecimWizardClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Akıllı Alet Danışmanı — HırdavatPro",
  description: "Bütçeniz, kullanım yoğunluğunuz ve ihtiyaç duyduğunuz özelliklere göre en ideal profesyonel aleti saniyeler içinde belirleyin.",
};

export default async function AkilliSecimPage() {
  const products = await getProducts();

  return <AkilliSecimWizardClient allProducts={products} />;
}
