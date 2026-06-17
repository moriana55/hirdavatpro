import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/products/store";
import { CATEGORY_LABELS } from "@/lib/products/types";
import type { ProductCategory } from "@/lib/products/types";
import { B2BHizliSiparisClient } from "@/components/b2b/B2BHizliSiparisClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "B2B Hızlı Sipariş & Toplu Teklif",
  description:
    "Kurumsal alıcılar için toplu hızlı sipariş: SKU/ürün adı yapıştırın veya seçin, adetleri girin, tek tıkla teklif isteyin. Cari hesap ve vadeli alım imkanları.",
  alternates: { canonical: "https://hirdavatpro.com/b2b" },
};

export default async function B2BPage() {
  let products: { id: string; brand: string; model: string; category: string; categoryLabel: string }[] = [];
  try {
    const rows = await getProducts();
    products = rows.map((p) => ({
      id: p.id,
      brand: p.brand,
      model: p.model,
      category: p.category,
      categoryLabel: CATEGORY_LABELS[p.category as ProductCategory] || p.category,
    }));
  } catch (e) {
    console.error("b2b products load error:", e);
  }

  return (
    <div className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-[13px] text-secondary font-body-sm">
        <Link href="/" className="hover:text-primary transition-colors decoration-none font-bold">Ana Sayfa</Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-semibold">B2B Hızlı Sipariş</span>
      </nav>

      <header className="mb-8 max-w-3xl">
        <span className="inline-flex items-center gap-2 bg-tertiary/10 text-tertiary px-3 py-1 rounded-full font-label-caps text-[11px] font-bold uppercase tracking-wider mb-4">
          <span className="material-symbols-outlined text-[16px]">business_center</span>
          Kurumsal
        </span>
        <h1 className="font-headline-lg text-headline-lg md:text-display-lg font-bold mb-3">B2B Hızlı Sipariş</h1>
        <p className="text-secondary font-body-lg leading-relaxed">
          Şantiye, atölye ve kurumsal alıcılar için toplu sipariş kolaylığı. Ürün listenizi
          yapıştırın veya katalogdan seçin, adetleri girin ve tek formla fiyat teklifi alın.
        </p>
      </header>

      {/* Cari hesap stub bilgi kartı */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: "receipt_long", title: "Toplu Teklif (RFQ)", desc: "Tüm ürünleriniz için tek seferde fiyat teklifi alın." },
          { icon: "account_balance_wallet", title: "Cari Hesap", desc: "Onaylı firmalara açık hesap ve vadeli alım (yakında)." },
          { icon: "local_shipping", title: "Toplu Sevkiyat", desc: "Tek adrese konsolide teslimat ve fatura." },
        ].map((c) => (
          <div key={c.title} className="bg-white border border-border-subtle rounded-xl p-5 shadow-sm">
            <span className="material-symbols-outlined text-primary text-[28px] mb-2">{c.icon}</span>
            <h3 className="font-title-sm text-title-sm font-bold mb-1">{c.title}</h3>
            <p className="text-secondary text-body-sm leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      <B2BHizliSiparisClient products={products} />
    </div>
  );
}
