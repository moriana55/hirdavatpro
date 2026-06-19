// İnceleme videosu / marka gönderisi gösterimi (resmî embed — telif güvenli).
//
// YouTube: youtube-nocookie iframe, lazy yükleme, responsive 16:9, title.
// Instagram: resmî embed (blockquote + embed.js) — opsiyonel, varsa gösterilir.
//
// Bu bir Server Component'tir (interaktivite gerekmez). Instagram script'i
// next/script ile lazyOnload stratejisiyle yüklenir.

import Script from "next/script";
import { youtubeEmbedUrl, normalizeInstagram } from "@/lib/media-embed";

type Props = {
  youtubeUrl?: string;
  instagramUrl?: string;
  title?: string;
};

export function VideoEmbed({ youtubeUrl, instagramUrl, title }: Props) {
  const ytEmbed = youtubeUrl ? youtubeEmbedUrl(youtubeUrl) : null;
  const igUrl = instagramUrl ? normalizeInstagram(instagramUrl) : null;

  // Hiçbir geçerli medya yoksa hiç render etme.
  if (!ytEmbed && !igUrl) return null;

  return (
    <section className="mt-16 pt-10 border-t border-border-subtle">
      <div className="mb-6 flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-[28px]">smart_display</span>
        <div>
          <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface">İnceleme Videosu</h2>
          <p className="text-secondary text-body-sm mt-0.5">
            Bu ürünle ilgili bağımsız inceleme ve uygulama görüntüleri.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
        {/* YouTube — responsive 16:9 */}
        {ytEmbed && (
          <div className={igUrl ? "lg:col-span-8" : "lg:col-span-12"}>
            <div
              className="relative w-full overflow-hidden rounded-lg border border-border-subtle bg-black shadow-sm"
              style={{ aspectRatio: "16 / 9" }}
            >
              <iframe
                src={ytEmbed}
                title={title ? `${title} inceleme videosu` : "İnceleme videosu"}
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Instagram — resmî embed */}
        {igUrl && (
          <div className={ytEmbed ? "lg:col-span-4" : "lg:col-span-12"}>
            <blockquote
              className="instagram-media mx-auto"
              data-instgrm-permalink={igUrl}
              data-instgrm-version="14"
              style={{
                background: "#FFF",
                border: 0,
                borderRadius: 8,
                margin: 0,
                maxWidth: 540,
                width: "100%",
              }}
            >
              <a href={igUrl} target="_blank" rel="noreferrer" className="text-sm text-secondary">
                Instagram&apos;da görüntüle
              </a>
            </blockquote>
            {/* Resmî Instagram embed script'i — yalnızca IG gönderisi varsa yüklenir. */}
            <Script src="https://www.instagram.com/embed.js" strategy="lazyOnload" />
          </div>
        )}
      </div>
    </section>
  );
}
