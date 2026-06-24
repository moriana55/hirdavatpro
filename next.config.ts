import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: projectRoot,
  },
  webpack: (config) => {
    config.resolve.modules = [
      path.join(projectRoot, "node_modules"),
      "node_modules",
    ];
    return config;
  },
  // Temel güvenlik başlıkları (production). CSP başlangıçta sadece RAPORLU
  // (Content-Security-Policy-Report-Only) olarak ekleniyor: ihlalleri loglar ama
  // canlıyı KIRMAZ. Mapbox (harita), inline script ve Google Material Symbols
  // bilinçli olarak izin listesine alındı. İhlaller temizlendikten sonra
  // "-Report-Only" eki kaldırılıp zorunlu CSP'ye geçilebilir.
  async headers() {
    const cspReportOnly = [
      "default-src 'self'",
      // Next.js + inline runtime + Mapbox GL worker/blob
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: https://api.mapbox.com https://*.mapbox.com",
      // Tailwind/inline stiller + Google Fonts/Material Symbols stil sayfaları
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.mapbox.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      // Mapbox tile/style/events + Neon/analitik vb. dış API'ler
      "connect-src 'self' https://api.mapbox.com https://*.mapbox.com https://events.mapbox.com",
      "worker-src 'self' blob:",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://www.instagram.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: cspReportOnly,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
