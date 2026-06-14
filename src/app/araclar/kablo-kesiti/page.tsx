import type { Metadata } from "next";
import { KabloKesitiTool } from "./KabloKesitiTool";

export const metadata: Metadata = {
  title: "Kablo Kesiti Hesaplayıcı — Doğru Kablo Seçimi",
  description: "Akım, kablo uzunluğu ve izin verilen gerilim düşüşüne göre minimum bakır veya alüminyum kablo kesitini anında hesaplayın. IEC 60364 tabanlı.",
  alternates: { canonical: "https://hirdavatpro.com/araclar/kablo-kesiti" },
};

export default function KabloKesitiPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 md:px-6 md:py-20">
      <KabloKesitiTool />
    </div>
  );
}
