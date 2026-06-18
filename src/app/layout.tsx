import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";

const heading = Inter({
  variable: "--font-sans-heading",
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const body = Inter({
  variable: "--font-sans-body",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-ui",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://hirdavatpro.com/#website",
      url: "https://hirdavatpro.com",
      name: "HırdavatPro",
      description: "Türkiye'nin en kapsamlı hırdavat karşılaştırma ve teknik alet rehber sitesi.",
      inLanguage: "tr-TR",
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: "https://hirdavatpro.com/arama?q={search_term_string}" },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://hirdavatpro.com/#organization",
      name: "HırdavatPro",
      url: "https://hirdavatpro.com",
      logo: {
        "@type": "ImageObject",
        url: "https://hirdavatpro.com/opengraph-image",
        width: 1200,
        height: 630,
      },
      sameAs: [],
    },
  ],
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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)]">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
