// Hafif bulanık metin eşleştirme yardımcıları (harici bağımlılık yok).
// B2B teklif satırlarını katalog ürünlerine eşlemek için kullanılır.

// Türkçe karakterleri normalize et + küçük harf + alfasayısal dışını boşluğa çevir.
export function normalize(s: string): string {
  return s
    .toLocaleLowerCase("tr")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

// Levenshtein düzenleme mesafesi (iteratif, iki satırlık DP — O(n) bellek).
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = new Array<number>(b.length + 1);
  let curr = new Array<number>(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    const ca = a.charCodeAt(i - 1);
    for (let j = 1; j <= b.length; j++) {
      const cost = ca === b.charCodeAt(j - 1) ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1, // silme
        curr[j - 1] + 1, // ekleme
        prev[j - 1] + cost // değiştirme
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

// 0..1 arası benzerlik skoru (1 = birebir aynı).
export function similarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na && !nb) return 1;
  if (!na || !nb) return 0;
  if (na === nb) return 1;
  const maxLen = Math.max(na.length, nb.length);
  const dist = levenshtein(na, nb);
  return 1 - dist / maxLen;
}

// Token tabanlı örtüşme skoru — kelime sırası fark etmeden ortak token oranı.
// "Bosch GSB 13 RE" vs "GSB13RE Bosch" gibi sıralamaları yakalar.
export function tokenOverlap(a: string, b: string): number {
  const ta = new Set(normalize(a).split(" ").filter(Boolean));
  const tb = new Set(normalize(b).split(" ").filter(Boolean));
  if (ta.size === 0 || tb.size === 0) return 0;
  let inter = 0;
  for (const t of ta) if (tb.has(t)) inter++;
  // Daha küçük token setine göre normalize (alt-küme eşleşmesini ödüllendir).
  return inter / Math.min(ta.size, tb.size);
}
