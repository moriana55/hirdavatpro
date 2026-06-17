"use client";

// Yetkili servis haritası — Mapbox lazy-loaded (next/dynamic ssr:false ile import edilir).
// Token yoksa graceful: harita yerine bilgilendirme gösterir.

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import type { ServiceCenter } from "@/lib/warranty/service-centers";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

export default function ServisHaritasi({ centers }: { centers: ServiceCenter[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    // Mapbox CSS CDN ekle.
    const link = document.createElement("link");
    link.href = "https://api.mapbox.com/mapbox-gl-js/v3.1.2/mapbox-gl.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      try { document.head.removeChild(link); } catch { /* ignore */ }
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !TOKEN || centers.length === 0) return;
    mapboxgl.accessToken = TOKEN;

    const first = centers[0];
    try {
      const map = new mapboxgl.Map({
        container: containerRef.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [first.lng, first.lat],
        zoom: 5.2,
        attributionControl: false,
      });
      mapRef.current = map;

      for (const c of centers) {
        new mapboxgl.Marker({ color: "#A43700" })
          .setLngLat([c.lng, c.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 18 }).setHTML(
              `<strong>${c.name}</strong><br/>${c.district}, ${c.city}<br/>${c.phone}`
            )
          )
          .addTo(map);
      }
    } catch (err) {
      console.error("ServisHaritasi init error:", err);
    }

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [centers]);

  if (!TOKEN) {
    return (
      <div className="rounded-xl border border-border-subtle bg-surface-container-low p-6 text-center">
        <span className="material-symbols-outlined text-[32px] text-secondary mb-2">map</span>
        <p className="text-secondary font-body-sm">
          Harita için Mapbox anahtarı (NEXT_PUBLIC_MAPBOX_TOKEN) tanımlı değil. Servis listesi aşağıda metin olarak gösterilir.
        </p>
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-[340px] rounded-xl overflow-hidden border border-border-subtle" />;
}
