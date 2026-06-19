// YouTube / Instagram embed yardımcıları.
//
// Telif açısından güvenli: platformların resmî embed yöntemini kullanırız
// (YouTube nocookie iframe, Instagram resmî embed). Burada yalnızca URL parse
// ve doğrulama yapılır; render bileşeni VideoEmbed.tsx içindedir.

// Bir YouTube URL'inden (veya doğrudan id'den) 11 karakterlik video id'sini ayıklar.
// Desteklenen biçimler:
//   https://www.youtube.com/watch?v=VIDEOID
//   https://youtu.be/VIDEOID
//   https://www.youtube.com/embed/VIDEOID
//   https://www.youtube.com/shorts/VIDEOID
//   https://www.youtube-nocookie.com/embed/VIDEOID
//   VIDEOID (11 karakter, doğrudan)
export function normalizeYouTube(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  // Doğrudan 11 karakterlik id.
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  // youtu.be/<id>
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return isYtId(id) ? id : null;
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "m.youtube.com") {
    // watch?v=<id>
    const v = url.searchParams.get("v");
    if (v && isYtId(v)) return v;
    // /embed/<id> | /shorts/<id> | /v/<id>
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length >= 2 && ["embed", "shorts", "v"].includes(parts[0]) && isYtId(parts[1])) {
      return parts[1];
    }
  }

  return null;
}

function isYtId(id: string | undefined): id is string {
  return Boolean(id) && /^[a-zA-Z0-9_-]{11}$/.test(id!);
}

// Gizlilik dostu (nocookie) embed URL'i üretir.
export function youtubeEmbedUrl(input: string): string | null {
  const id = normalizeYouTube(input);
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
}

// Instagram gönderi/reel URL doğrulama. Geçerliyse temizlenmiş URL döner.
// Desteklenen: instagram.com/p/<code>/, /reel/<code>/, /tv/<code>/
export function normalizeInstagram(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "").toLowerCase();
  if (host !== "instagram.com" && host !== "instagr.am") return null;
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length >= 2 && ["p", "reel", "tv"].includes(parts[0]) && /^[a-zA-Z0-9_-]+$/.test(parts[1])) {
    // Sorgu parametrelerini at, sondaki / korunur.
    return `https://www.instagram.com/${parts[0]}/${parts[1]}/`;
  }
  return null;
}
