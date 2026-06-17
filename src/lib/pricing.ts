// Fiyat aralığı ("₺1500-2500") metnini sayısal değerlere çeviren yardımcılar.
// Katalogdaki priceRange alanı serbest metindir; tahmini maliyet hesabı için
// orta nokta (mid) ve alt/üst sınır çıkarırız.

export interface ParsedPrice {
  min: number;
  max: number;
  mid: number;
}

/** "₺1500-2500", "1500 - 2500 TL", "₺2.500" gibi metinleri ayrıştırır. */
export function parsePriceRange(raw?: string | null): ParsedPrice | null {
  if (!raw) return null;
  // Sayıları çek (binlik ayırıcı nokta/virgülü temizle).
  const cleaned = raw.replace(/\./g, "").replace(/,/g, "");
  const nums = (cleaned.match(/\d+/g) || []).map((n) => parseInt(n, 10)).filter((n) => n > 0);
  if (nums.length === 0) return null;
  const min = Math.min(...nums);
  const max = Math.max(...nums);
  return { min, max, mid: Math.round((min + max) / 2) };
}

/** Türk Lirası biçimlendirme (₺1.500). */
export function formatTRY(value: number): string {
  return "₺" + Math.round(value).toLocaleString("tr-TR");
}

/** Bir aralığı "₺1.500 – ₺2.500" biçiminde göster. */
export function formatRange(p: ParsedPrice): string {
  if (p.min === p.max) return formatTRY(p.min);
  return `${formatTRY(p.min)} – ${formatTRY(p.max)}`;
}
