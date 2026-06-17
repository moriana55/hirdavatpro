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

        {/* Kurumsal Column */}
        <div>
          <h4 className="font-label-caps text-label-caps text-white mb-6">KURUMSAL</h4>
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
          </ul>
        </div>

        {/* Keşfet Column */}
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
