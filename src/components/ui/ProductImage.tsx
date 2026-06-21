"use client";

import { useState } from "react";

// Kaynak görsel ölürse (örn. geçici CDN linki) kırık ikon yerine
// temiz bir yer tutucu göster. Katalog kalitesi için kritik.
//
// Yer tutucu: harici istek gerektirmeyen inline SVG (data URI).
const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">` +
      `<rect width="320" height="320" fill="#f4f4f5"/>` +
      `<g fill="none" stroke="#a1a1aa" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">` +
      `<rect x="104" y="116" width="112" height="88" rx="8"/>` +
      `<path d="M124 188l24-28 18 20 16-14 22 22"/>` +
      `<circle cx="140" cy="142" r="9"/>` +
      `</g>` +
      `<text x="160" y="236" text-anchor="middle" font-family="system-ui,sans-serif" font-size="15" fill="#a1a1aa">Görsel yok</text>` +
      `</svg>`
  );

type ProductImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "onError" | "src"
> & { src: string };

export function ProductImage({ src, alt = "", ...rest }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      alt={alt}
      src={failed ? PLACEHOLDER : src}
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}
