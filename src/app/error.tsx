"use client";

// Sayfa düzeyinde hata sınırı (error boundary). Üretimde beklenmedik bir
// render/server hatası olursa Next'in çıplak hata ekranı yerine markalı,
// "tekrar dene" + ana sayfaya dönüş seçenekli bir sayfa gösterilir.
// Layout'un header/footer'ı korunur (global-error gerekmez).

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Sunucu/istemci loguna düş; PII içermez.
    console.error("Sayfa hatası:", error);
  }, [error]);

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-block bg-primary-fixed text-on-primary-fixed-variant px-3 py-1 font-label-caps text-label-caps rounded">
          HATA
        </span>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
          Bir şeyler ters gitti
        </h1>
        <p className="mt-4 text-secondary">
          Beklenmedik bir hata oluştu. Lütfen tekrar deneyin; sorun sürerse ana
          sayfaya dönebilirsiniz.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => reset()}
            className="bg-primary text-on-primary px-6 py-3 font-label-caps text-label-caps rounded hover:bg-primary-container active:scale-95 transition-all"
          >
            Tekrar dene
          </button>
          <Link
            href="/"
            className="border border-zinc-300 px-6 py-3 font-label-caps text-label-caps rounded hover:bg-zinc-100 transition-colors text-on-surface"
          >
            Ana sayfa
          </Link>
        </div>
      </div>
    </section>
  );
}
