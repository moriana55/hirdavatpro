import type { Metadata } from "next";
import Link from "next/link";

// Markalı 404 sayfası. notFound() ya da bilinmeyen URL'lerde Next'in çıplak
// varsayılan 404'ü yerine, kullanıcıyı katalog/araçlara geri yönlendiren
// (trafik hunisi) bir sayfa gösterilir. Layout otomatik header/footer ekler.
export const metadata: Metadata = {
  title: "Sayfa bulunamadı",
  // Boş/ölü sayfa dizine eklenmesin.
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 font-label-caps text-label-caps rounded">
          404
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
          Aradığınız sayfa bulunamadı
        </h1>
        <p className="mt-4 text-secondary">
          Bağlantı taşınmış, kaldırılmış ya da hiç var olmamış olabilir. Aşağıdaki
          bölümlerden devam edebilirsiniz.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="bg-primary text-on-primary px-6 py-3 font-label-caps text-label-caps rounded hover:bg-primary-container active:scale-95 transition-all"
          >
            Ana sayfa
          </Link>
          <Link
            href="/karsilastirma"
            className="border border-zinc-300 px-6 py-3 font-label-caps text-label-caps rounded hover:bg-zinc-100 transition-colors text-on-surface"
          >
            Karşılaştırmalar
          </Link>
          <Link
            href="/araclar"
            className="border border-zinc-300 px-6 py-3 font-label-caps text-label-caps rounded hover:bg-zinc-100 transition-colors text-on-surface"
          >
            Hesaplama araçları
          </Link>
        </div>

        <p className="mt-10 text-sm text-secondary">
          Belirli bir ürün mü arıyorsunuz?{" "}
          <Link href="/arama" className="text-primary underline underline-offset-4">
            Arama yapın
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
