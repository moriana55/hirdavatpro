// Anonim sahip anahtarı (ownerKey) — kullanıcı hesabı olmadan kayıtlı proje /
// garanti kaydı sahipliği için localStorage'da saklanan rastgele kimlik.
// Sunucu sadece bu anahtarı eşleştirir; PII içermez.

const KEY = "hirdavatpro_owner_key";

export function getOwnerKey(): string {
  if (typeof window === "undefined") return "";
  try {
    let v = localStorage.getItem(KEY);
    if (!v || !/^[A-Za-z0-9_-]{8,64}$/.test(v)) {
      v = generate();
      localStorage.setItem(KEY, v);
    }
    return v;
  } catch {
    return "";
  }
}

function generate(): string {
  // crypto.randomUUID mevcutsa kullan, yoksa fallback.
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return "ok_" + crypto.randomUUID().replace(/-/g, "");
    }
  } catch {
    /* ignore */
  }
  return "ok_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
