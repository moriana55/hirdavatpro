import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

/** Cabinet / Satoshi hissi: temiz grotesk + teknik mono */
const heading = IBM_Plex_Sans({
  variable: "--font-sans-heading",
  subsets: ["latin"],
  weight: ["500", "600"],
});

const body = IBM_Plex_Sans({
  variable: "--font-sans-body",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono-ui",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Hırdavat Pro — Endüstriyel Alet Karşılaştırma & Seçim Araçları",
    template: "%s | Hırdavat Pro",
  },
  description:
    "Türkiye'nin en kapsamlı hırdavat karşılaştırma sitesi. Matkap, taşlama, testere, kaynak makinesi, el aleti ve daha fazlası — teknik spec bazlı tarafsız karşılaştırmalar.",
  metadataBase: new URL("https://hirdavatpro.com"),
  keywords: [
    "hırdavat karşılaştırma", "matkap karşılaştırma", "bosch vs makita",
    "dewalt vs milwaukee", "avuç taşlama karşılaştırma", "kaynak makinesi karşılaştırma",
    "en iyi matkap", "en iyi avuç taşlama", "alet karşılaştırma",
    "hırdavat pro", "endüstriyel alet", "şantiye ekipmanı",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Hırdavat Pro",
    title: "Hırdavat Pro — Endüstriyel Alet Karşılaştırma",
    description: "Teknik spec bazlı, tarafsız hırdavat karşılaştırmaları. Bosch, Makita, DeWalt, Milwaukee, Stihl ve daha fazlası.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hırdavat Pro",
    description: "Endüstriyel alet karşılaştırma & seçim araçları",
  },
  alternates: {
    canonical: "https://hirdavatpro.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${heading.variable} ${body.variable} ${mono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
