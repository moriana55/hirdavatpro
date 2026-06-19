import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-on-secondary-fixed text-on-secondary w-full py-12 px-margin-desktop flex flex-col items-center justify-center mt-auto border-t border-border-subtle/10">
      <div className="max-w-max-width w-full grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 mx-auto">
        {/* About Column */}
        <div className="col-span-1 md:col-span-2 space-y-4">
          <span className="font-headline-lg text-headline-lg text-primary-fixed block">
            Hırdavat<span className="text-white">Pro</span>
          </span>
          <p className="text-secondary-fixed-dim font-body-sm max-w-sm leading-relaxed">
            Endüstriyel hassasiyet ve mühendislik verileriyle donatılmış Türkiye&apos;nin en kapsamlı hırdavat analiz ve karşılaştırma platformu.
          </p>
        </div>

        {/* Keşfet Column — ana içerik akışları */}
        <div>
          <h4 className="font-label-caps text-label-caps text-white mb-6">KEŞFET</h4>
          <ul className="space-y-3 text-secondary-fixed-dim font-body-sm">
            <li>
              <Link href="/karsilastirma" className="hover:text-primary-fixed transition-colors decoration-none">
                Karşılaştırmalar
              </Link>
            </li>
            <li>
              <Link href="/araclar" className="hover:text-primary-fixed transition-colors decoration-none">
                Seçim Araçları
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:text-primary-fixed transition-colors decoration-none">
                Teknik Rehberler
              </Link>
            </li>
            <li>
              <Link href="/arama" className="hover:text-primary-fixed transition-colors decoration-none">
                Ürün Arama
              </Link>
            </li>
          </ul>
        </div>

        {/* Planlama & B2B Column — lead-gen ve proje araçları */}
        <div>
          <h4 className="font-label-caps text-label-caps text-white mb-6">PLANLAMA &amp; B2B</h4>
          <ul className="space-y-3 text-secondary-fixed-dim font-body-sm">
            <li>
              <Link href="/proje-sihirbazi" className="hover:text-primary-fixed transition-colors decoration-none">
                Proje Sihirbazı
              </Link>
            </li>
            <li>
              <Link href="/projelerim" className="hover:text-primary-fixed transition-colors decoration-none">
                Projelerim
              </Link>
            </li>
            <li>
              <Link href="/b2b" className="hover:text-primary-fixed transition-colors decoration-none">
                Kurumsal Teklif İste
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="w-full border-t border-on-secondary-fixed-variant/20 pt-8 text-center max-w-max-width mx-auto">
        <p className="font-label-caps text-label-caps text-secondary-fixed-dim">
          © {new Date().getFullYear()} HırdavatPro. Her Spesifikasyonda Endüstriyel Hassasiyet.
        </p>
      </div>
    </footer>
  );
}
