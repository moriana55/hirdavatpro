import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "HırdavatPro — Endüstriyel Alet Karşılaştırma";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #1c1917 100%)",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(251,146,60,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(251,146,60,0.04) 1px,transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-120px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(251,146,60,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Category badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "rgba(251,146,60,0.15)",
              border: "1px solid rgba(251,146,60,0.4)",
              borderRadius: "6px",
              padding: "6px 14px",
              color: "#fb923c",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            ENDÜSTRİYEL ANALİZ
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 800,
            color: "#ffffff",
            lineHeight: 1.05,
            marginBottom: "24px",
            maxWidth: "800px",
          }}
        >
          Hırdavat
          <span style={{ color: "#fb923c" }}>Pro</span>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "24px",
            color: "#a1a1aa",
            fontWeight: 400,
            marginBottom: "48px",
            maxWidth: "700px",
            lineHeight: 1.4,
          }}
        >
          Teknik spec bazlı, tarafsız alet karşılaştırmaları. Bosch, Makita, DeWalt, Milwaukee ve daha fazlası.
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#22c55e",
            }}
          />
          <div style={{ color: "#71717a", fontSize: "16px", fontWeight: 500 }}>
            hirdavatpro.com
          </div>
        </div>
      </div>
    ),
    size
  );
}
