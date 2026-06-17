import { getProducts } from "@/lib/products/store";
import { ComparisonBasketClient } from "@/components/karsilastirma/ComparisonBasketClient";

export const dynamic = "force-dynamic";

export default async function SepetKarsilastirmaPage() {
  // Veritabanındaki tüm ürünleri çekip istemciye aktarıyoruz,
  // böylece LocalStorage'daki ID'lerle istemci tarafında hızlıca eşleştirme yapabiliriz.
  const products = await getProducts();

  return <ComparisonBasketClient allProducts={products} />;
}
