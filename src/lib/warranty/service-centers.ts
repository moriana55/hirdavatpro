// Yetkili servis merkezleri — TEMSİLİ (seed) veri.
// TODO(owner): Gerçek yetkili servis verisiyle değiştir (marka API'leri / manuel liste).
// Koordinatlar Mapbox haritasında pin için kullanılabilir (lazy-loaded).

export interface ServiceCenter {
  id: string;
  brand: string; // hizmet verdiği marka(lar) — "*" tümü
  name: string;
  city: string;
  district: string;
  phone: string;
  address: string;
  lng: number;
  lat: number;
}

export const SERVICE_CENTERS: ServiceCenter[] = [
  { id: "sc-bosch-ist", brand: "Bosch", name: "Bosch Yetkili Servisi — Perpa", city: "İstanbul", district: "Şişli", phone: "0212 320 00 00", address: "Perpa Ticaret Merkezi B Blok, Şişli", lng: 28.9655, lat: 41.0625 },
  { id: "sc-makita-ist", brand: "Makita", name: "Makita Teknik Servis — Karaköy", city: "İstanbul", district: "Beyoğlu", phone: "0212 251 00 00", address: "Necatibey Cad. No:1, Karaköy", lng: 28.9744, lat: 41.0256 },
  { id: "sc-dewalt-ist", brand: "DeWalt", name: "Stanley/DeWalt Servis — Ataşehir", city: "İstanbul", district: "Ataşehir", phone: "0216 580 00 00", address: "Barbaros Mah. Ataşehir", lng: 29.1244, lat: 40.9925 },
  { id: "sc-uni-ist", brand: "*", name: "ProTamir Çok Markalı Elektrikli El Aleti Servisi", city: "İstanbul", district: "Bağcılar", phone: "0212 430 00 00", address: "Mahmutbey Yolu, Bağcılar", lng: 28.8333, lat: 41.0394 },
  { id: "sc-bosch-ank", brand: "Bosch", name: "Bosch Yetkili Servisi — Ostim", city: "Ankara", district: "Yenimahalle", phone: "0312 354 00 00", address: "Ostim OSB, Yenimahalle", lng: 32.7480, lat: 39.9720 },
  { id: "sc-uni-ank", brand: "*", name: "Başkent Çok Markalı Alet Servisi", city: "Ankara", district: "Siteler", phone: "0312 350 00 00", address: "Siteler, Altındağ", lng: 32.8930, lat: 39.9560 },
  { id: "sc-makita-izm", brand: "Makita", name: "Makita Servis — İzmir", city: "İzmir", district: "Konak", phone: "0232 445 00 00", address: "Gazi Bulvarı, Konak", lng: 27.1380, lat: 38.4237 },
  { id: "sc-uni-izm", brand: "*", name: "Ege Profesyonel Alet Servisi", city: "İzmir", district: "Bornova", phone: "0232 339 00 00", address: "Sanayi Sitesi, Bornova", lng: 27.2110, lat: 38.4700 },
  { id: "sc-uni-bursa", brand: "*", name: "Nilüfer Elektrikli El Aleti Servisi", city: "Bursa", district: "Nilüfer", phone: "0224 443 00 00", address: "Nilüfer OSB, Bursa", lng: 28.9610, lat: 40.2130 },
  { id: "sc-uni-antalya", brand: "*", name: "Akdeniz Alet Bakım & Servis", city: "Antalya", district: "Kepez", phone: "0242 340 00 00", address: "Sanayi Mah. Kepez", lng: 30.7330, lat: 36.9400 },
];

const TR = (s: string) => s.toLocaleLowerCase("tr").trim();

/** Markaya (ve isteğe bağlı şehre) göre uygun servisleri sıralı döndürür. */
export function findServiceCenters(opts: { brand?: string; city?: string }): ServiceCenter[] {
  const brand = opts.brand ? TR(opts.brand) : "";
  const city = opts.city ? TR(opts.city) : "";
  return SERVICE_CENTERS.map((sc) => {
    let score = 0;
    if (brand && TR(sc.brand) === brand) score += 3;
    if (sc.brand === "*") score += 1; // çok markalı her zaman aday
    if (city && TR(sc.city) === city) score += 2;
    return { sc, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.sc);
}
