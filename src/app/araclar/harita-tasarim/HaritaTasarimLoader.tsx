"use client";

import dynamic from "next/dynamic";

// mapbox-gl ağır bir istemci kütüphanesi — sadece bu sayfa açıldığında yüklenir,
// ilk JS yükünü ve LCP'yi düşürür. Harita etkileşimli olduğu için ssr: false uygundur.
const HaritaTasarimClient = dynamic(
  () =>
    import("@/components/araclar/HaritaTasarimClient").then(
      (m) => m.HaritaTasarimClient,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="mx-auto max-w-[1200px] px-6 py-24 text-center text-secondary">
        Harita tasarımcısı yükleniyor…
      </div>
    ),
  },
);

export default function HaritaTasarimLoader() {
  return <HaritaTasarimClient />;
}
