import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/x9k4-sys/", "/api/"],
      },
    ],
    sitemap: "https://hirdavatpro.com/sitemap.xml",
  };
}
