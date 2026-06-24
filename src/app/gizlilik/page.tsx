import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gizlilik Politikası (KVKK)",
  description:
    "HırdavatPro gizlilik politikası ve KVKK aydınlatma metni. Hangi kişisel verileri topladığımız, nasıl kullandığımız, çerezler, üçüncü taraf hizmetler ve KVKK kapsamındaki haklarınız.",
  alternates: { canonical: "https://hirdavatpro.com/gizlilik" },
};

export default function GizlilikPage() {
  return (
    <div className="pt-32 pb-20 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
      <nav className="mb-8 flex flex-wrap items-center gap-2 text-[13px] text-secondary font-body-sm">
        <Link href="/" className="hover:text-primary transition-colors decoration-none font-bold">
          Ana Sayfa
        </Link>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-semibold">Gizlilik Politikası</span>
      </nav>

      <header className="mb-10 max-w-3xl">
        <span className="inline-flex items-center gap-2 bg-tertiary/10 text-tertiary px-3 py-1 rounded-full font-label-caps text-[11px] font-bold uppercase tracking-wider mb-4">
          <span className="material-symbols-outlined text-[16px]">shield_lock</span>
          KVKK
        </span>
        <h1 className="font-headline-lg text-headline-lg md:text-display-lg font-bold mb-3">
          Gizlilik Politikası &amp; KVKK Aydınlatma Metni
        </h1>
        <p className="text-secondary font-body-lg leading-relaxed">
          6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında; hangi verileri
          topladığımızı, neden işlediğimizi ve haklarınızı bu metinde açıklıyoruz.
        </p>
      </header>

      <article className="max-w-3xl space-y-8 text-on-surface font-body-md leading-relaxed">
        <section>
          <h2 className="font-headline-md text-headline-md font-bold mb-3">
            1. Veri sorumlusu
          </h2>
          <p className="text-secondary">
            Bu gizlilik politikası, HırdavatPro (&quot;Site&quot;) tarafından sunulan karşılaştırma,
            teknik rehber ve kurumsal teklif hizmetleri kapsamında geçerlidir. Site, bir
            karşılaştırma ve bilgilendirme platformudur; doğrudan satış yapmaz.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold mb-3">
            2. Topladığımız veriler
          </h2>
          <ul className="list-disc pl-6 space-y-2 text-secondary">
            <li>
              <strong>İletişim / teklif verileri:</strong> Kurumsal teklif (B2B/RFQ) ya da iletişim
              formlarını doldurduğunuzda paylaştığınız ad, firma, e-posta, telefon ve mesaj içeriği.
            </li>
            <li>
              <strong>Kullanım verileri:</strong> Ziyaret edilen sayfalar, tarayıcı türü, yaklaşık
              konum ve site performansını ölçmek için toplanan anonim/istatistiksel veriler.
            </li>
            <li>
              <strong>Çerezler (cookies):</strong> Tercihlerinizi hatırlamak, karşılaştırma sepetini
              tutmak ve trafiği analiz etmek için kullanılan zorunlu ve isteğe bağlı çerezler.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold mb-3">
            3. Verilerin işlenme amacı
          </h2>
          <p className="text-secondary">
            Kişisel verilerinizi; teklif taleplerinizi yanıtlamak, hizmetlerimizi sunmak ve
            iyileştirmek, yasal yükümlülükleri yerine getirmek ve site güvenliğini sağlamak
            amaçlarıyla işleriz. Verilerinizi pazarlama amacıyla üçüncü taraflara satmayız.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold mb-3">
            4. Üçüncü taraf hizmetler ve bağlantılar
          </h2>
          <p className="text-secondary">
            Site; harita (Mapbox), barındırma ve analitik gibi üçüncü taraf hizmetleri kullanabilir.
            Ayrıca dış mağazalara yönlendiren <strong>ortaklık (affiliate) bağlantıları</strong>{" "}
            içerir; bu siteleri ziyaret ettiğinizde ilgili sağlayıcının kendi gizlilik politikası
            geçerli olur. Ayrıntı için{" "}
            <Link
              href="/affiliate-aciklama"
              className="text-primary font-semibold hover:underline decoration-none"
            >
              Affiliate Açıklaması
            </Link>{" "}
            sayfasına bakabilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold mb-3">
            5. KVKK kapsamındaki haklarınız
          </h2>
          <p className="text-secondary">
            KVKK&apos;nın 11. maddesi uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme,
            bunlara erişme, düzeltilmesini veya silinmesini talep etme ve işlemeye itiraz etme
            haklarına sahipsiniz. Bu haklarınızı kullanmak için bizimle iletişime geçebilirsiniz.
          </p>
        </section>

        <section>
          <h2 className="font-headline-md text-headline-md font-bold mb-3">6. İletişim</h2>
          <p className="text-secondary">
            Gizlilik ile ilgili tüm talepleriniz için{" "}
            <Link href="/b2b" className="text-primary font-semibold hover:underline decoration-none">
              iletişim / teklif formu
            </Link>{" "}
            üzerinden bize ulaşabilirsiniz. Bu politika gerektiğinde güncellenebilir; güncel sürüm
            her zaman bu sayfada yayınlanır.
          </p>
        </section>
      </article>
    </div>
  );
}
