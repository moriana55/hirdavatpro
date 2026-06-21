import type { Metadata } from "next";
import { getProducts } from "@/lib/products/store";
import { ComparisonBasketClient } from "@/components/karsilastirma/ComparisonBasketClient";

export const metadata: Metadata = {
  title: "Karşılaştırma Sepeti",
  description: "Seçtiğiniz hırdavat ürünlerini yan yana teknik spec bazında karşılaştırın.",
  alternates: { canonical: "https://hirdavatpro.com/karsilastirma/sepet" },
  // Kişiye özel (localStorage) sepet sayfası — indekslenmez, ince/yinelenen içerik önlemi.
  robots: { index: false, follow: true },
};

export const dynamic = "force-dynamic";

export default async function SepetKarsilastirmaPage() {
  // Veritabanındaki tüm ürünleri çekip istemciye aktarıyoruz,
  // böylece LocalStorage'daki ID'lerle istemci tarafında hızlıca eşleştirme yapabiliriz.
  const products = await getProducts();

  return <ComparisonBasketClient allProducts={products} />;
}
