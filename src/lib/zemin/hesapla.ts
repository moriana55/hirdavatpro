/**
 * Zemin/oda yerleşim planlayıcı hesapları (Feature 10).
 * Fayans (fayans-hesaplayici) ve boya (boya/hesapla) mantığını yeniden kullanır;
 * burada tek yerde toplanmış sade sürümleri yer alır (client'tan da çağrılabilir).
 */

export type Malzeme = "fayans" | "laminat" | "boya";

export interface ZeminGirdi {
  odaEn: number; // metre
  odaBoy: number; // metre
  malzeme: Malzeme;
  // Fayans/laminat için karo ölçüsü (cm)
  karoEn: number;
  karoBoy: number;
  derz: number; // mm (fayans)
  fire: number; // %
  kutuAdedi: number; // kutu başı adet
  // Boya için
  duvarYuksekligi: number; // metre
  katSayisi: number;
}

export interface ZeminSonuc {
  alanM2: number;
  malzeme: Malzeme;
  // Fayans/laminat
  karoAdedi?: number;
  kutuSayisi?: number;
  derzUzunlukM?: number;
  // Boya
  duvarAlaniM2?: number;
  boyaLitre?: number;
  // Görsel grid için (kaç sütun/satır)
  grid?: { cols: number; rows: number };
  ozet: string;
}

// Yayma süratleri (boya/hesapla ile uyumlu — düz sıva varsayımı).
const BOYA_YAYMA = 11; // m²/L düz sıva

export function zeminHesapla(g: ZeminGirdi): ZeminSonuc {
  const alanM2 = Math.max(0, g.odaEn * g.odaBoy);

  if (g.malzeme === "boya") {
    const cevre = 2 * (g.odaEn + g.odaBoy) * g.duvarYuksekligi;
    const netAlan = cevre * g.katSayisi;
    const litre = Math.ceil((netAlan / BOYA_YAYMA) * 1.15 * 10) / 10; // %15 fire
    return {
      alanM2: Math.round(alanM2 * 100) / 100,
      malzeme: g.malzeme,
      duvarAlaniM2: Math.round(cevre * 10) / 10,
      boyaLitre: litre,
      ozet: `${Math.round(cevre * 10) / 10} m² duvar (${g.katSayisi} kat) için ≈ ${litre} L boya gerekir.`,
    };
  }

  // Fayans / laminat — karo bazlı (fayans-hesaplayici mantığı).
  const karoNetAlan = (g.karoEn / 100) * (g.karoBoy / 100); // m²/adet
  const fireliAlan = alanM2 * (1 + g.fire / 100);
  const karoAdedi = Math.ceil(fireliAlan / karoNetAlan);
  const kutuSayisi = Math.ceil(karoAdedi / Math.max(1, g.kutuAdedi));

  // Derz uzunluğu (fayans için; laminatta tıklamalı, derz yok).
  const derzUzunlukM =
    g.malzeme === "fayans"
      ? Math.ceil(
          Math.ceil(g.odaEn / (g.karoEn / 100)) * g.odaBoy +
            Math.ceil(g.odaBoy / (g.karoBoy / 100)) * g.odaEn
        )
      : 0;

  const cols = Math.max(1, Math.ceil(g.odaEn / (g.karoEn / 100)));
  const rows = Math.max(1, Math.ceil(g.odaBoy / (g.karoBoy / 100)));

  return {
    alanM2: Math.round(alanM2 * 100) / 100,
    malzeme: g.malzeme,
    karoAdedi,
    kutuSayisi,
    derzUzunlukM,
    grid: { cols, rows },
    ozet:
      g.malzeme === "fayans"
        ? `${alanM2.toFixed(2)} m² için %${g.fire} fireyle ${karoAdedi} adet (${kutuSayisi} kutu) ${g.karoEn}×${g.karoBoy} cm fayans ve ≈ ${derzUzunlukM} m derz gerekir.`
        : `${alanM2.toFixed(2)} m² için %${g.fire} fireyle ${karoAdedi} adet (${kutuSayisi} paket) ${g.karoEn}×${g.karoBoy} cm laminat gerekir.`,
  };
}
