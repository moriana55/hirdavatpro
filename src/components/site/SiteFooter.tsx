import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white/80">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between md:gap-12">
          <div className="max-w-md space-y-2">
            <p className="font-heading text-sm font-semibold text-zinc-800">Hırdavat Pro</p>
            <p className="text-[13px] leading-relaxed text-zinc-500">
              Atölye ve şantiye kararlarını hızlandıran, teknik netlik öncelikli yardımcı araçlar. Satış vaadi değil;
              doğru uç, doğru işlem, doğru güvenlik.
            </p>
          </div>
          <div className="flex flex-wrap gap-10 text-[13px]">
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">Keşfet</p>
              <ul className="space-y-2 text-zinc-400">
                <li>
                  <Link href="/karsilastirma" className="hover:text-orange-600/90 transition">
                    Karşılaştırmalar
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-orange-600/90 transition">
                    Rehberler
                  </Link>
                </li>
                <li>
                  <Link href="/arama" className="hover:text-orange-600/90 transition">
                    Arama
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">Araçlar</p>
              <ul className="space-y-2 text-zinc-400">
                <li>
                  <Link href="/araclar/matkap-ucu" className="hover:text-orange-600/90 transition">
                    Matkap ucu seçimi
                  </Link>
                </li>
                <li>
                  <Link href="/araclar/testere-secimi" className="hover:text-orange-600/90 transition">
                    Testere seçimi
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-zinc-500">Yasal</p>
              <p className="max-w-xs text-zinc-400 leading-relaxed">
                Öneriler bilgilendirme amaçlıdır. Üretici katalogları, iş güvenliği ve yerel mevzuat her zaman önceliklidir.
              </p>
            </div>
          </div>
        </div>
        <p className="mt-10 text-center text-[11px] text-zinc-400">
          © {new Date().getFullYear()} hirdavatpro.com
        </p>
      </div>
    </footer>
  );
}
