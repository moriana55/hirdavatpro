import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Affiliate (Ortaklık) Açıklaması",
  description:
    "HırdavatPro'daki bazı bağlantılar ortaklık (affiliate) bağlantısıdır. Bu bağlantılar üzerinden yapılan alışverişlerden komisyon kazanabiliriz. Editoryal bağımsızlığımız ve değerlendirme ilkelerimiz hakkında bilgi.",
  alternates: { canonical: "https://hirdavatpro.com/affiliate-aciklama" },
};

export default function AffiliateAciklamaPage() {
  return (
    <div className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-[13px] text-secondary font-body-sm">
        <Link href="/" className="hover:text-primary transition-colors decoration-none font-bold">
          Ana Sayfa
        </Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Affiliate Açıklaması</span>
      </nav>

      <header className="mb-10 max-w-3xl">
        <span className="inline-flex items-center gap-2 bg-tertiary/10 text-tertiary px-3 py-1 rounded-full font-label-caps text-[11px] font-bold uppercase tracking-wider mb-4">
          <span className="material-symbols-outlined text-[16px]">handshake</span>
          Şeffaflık
        </span>
        <h1 className="font-headline-lg text-headline-lg md:text-display-lg font-bold mb-3">
          Affiliate (Ortaklık) Açıklaması
        </h1>
        <p className="text-secondary font-body-lg leading-relaxed">
          HırdavatPro&apos;nun nasıl gelir elde ettiği ve değerlendirmelerimizin neden bu durumdan
          etkilenmediği konusunda tam şeffaflık ilkesiyle hareket ediyoruz.
        </p>
      </header>

      <article className="max-w-3xl space-y-8 text-on-surface font-body-md leading-relaxed">
        <section className="bg-white border border-border-subtle rounded-xl p-6 shadow-sm">
          <p className="text-on-surface">
            <strong>Bu sitedeki bazı bağlantılar ortaklık (affiliate) bağlantısıdır.</strong> Bu
            bağlantılar üzerinden bir ürün satın aldığınızda, size hiçbir ek maliyet
            getirmeksizin satıcıdan küçük bir komisyon kazanabiliriz. Bu komisyonlar, sitenin
            teknik altyapısını ve bağımsız içerik üretimini finanse etmemize yardımcı olur.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold mb-3">Komisyon nasıl çalışır?</h2>
          <p className="text-secondary">
            HırdavatPro bir <strong>karşılaştırma ve teknik rehber platformudur</strong> — doğrudan
            ürün satışı yapmayız, stok tutmayız ve ödeme almayız. &quot;Nereden alınır&quot; benzeri
            bağlantılara tıkladığınızda üçüncü taraf satıcıların (pazaryerleri, mağazalar)
            sitelerine yönlendirilirsiniz. Eğer orada bir alışveriş yaparsanız, ilgili ortaklık
            programı bize komisyon ödeyebilir. Ödediğiniz fiyat, ortaklık bağlantısı kullanıp
            kullanmamanızdan bağımsız olarak aynıdır.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold mb-3">
            Editoryal bağımsızlığımız
          </h2>
          <p className="text-secondary">
            Karşılaştırmalarımız ve ürün değerlendirmelerimiz, üreticilerin teknik
            spesifikasyonlarına ve objektif kriterlere dayanır. Bir ürünü öne çıkarmamız ya da
            tavsiye etmemiz, o ürünün ortaklık komisyonu sunup sunmamasından{" "}
            <strong>etkilenmez</strong>. Komisyon kazandığımız markalar lehine yorum yapmayız;
            amacımız sizin doğru aleti seçmenize yardımcı olmaktır.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold mb-3">Yasal çerçeve</h2>
          <p className="text-secondary">
            Bu açıklama, ABD Federal Ticaret Komisyonu (FTC) ortaklık beyanı yönergeleri ve Google
            Arama yayıncı politikaları başta olmak üzere uluslararası şeffaflık standartlarıyla
            uyumlu olarak yayınlanmıştır. Sorularınız için{" "}
            <Link href="/b2b" className="text-primary font-semibold hover:underline decoration-none">
              bizimle iletişime
            </Link>{" "}
            geçebilirsiniz.
          </p>
        </section>
      </article>
    </div>
  );
}
