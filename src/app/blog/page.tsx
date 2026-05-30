import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog/posts";
import { Clock, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Hırdavat Rehberleri — Alet Seçim & Kullanım Kılavuzları",
  description: "Matkap nasıl seçilir, avuç taşlama alırken dikkat edilmesi gerekenler, kaynak makinesi rehberi ve daha fazlası. Atölye ve şantiye için pratik bilgiler.",
  alternates: { canonical: "https://hirdavatpro.com/blog" },
};

export default function BlogPage() {
  const guides = getAllPosts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-14 md:px-6 md:py-20">
      <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
        Rehber<span className="text-orange-600">ler</span>
      </h1>
      <p className="mt-3 text-sm text-zinc-500 max-w-xl">
        Alet seçimi, kullanım ipuçları ve teknik bilgiler. Atölye ve şantiye kararlarını kolaylaştıran pratik rehberler.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {guides.map(g => (
          <Link
            key={g.slug}
            href={`/blog/${g.slug}`}
            className="group rounded-lg border border-zinc-200 bg-zinc-50 p-6 transition hover:border-zinc-300 hover:bg-zinc-100"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600">
                {g.category}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-zinc-400">
                <Clock className="size-3" />
                {g.readTime}
              </span>
            </div>
            <h2 className="text-base font-semibold text-zinc-800 group-hover:text-orange-600 transition">
              {g.title}
            </h2>
            <p className="mt-2 text-xs text-zinc-500 leading-relaxed">{g.excerpt}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-orange-600/80 group-hover:text-orange-600 transition">
              Okumaya devam et
              <ArrowRight className="size-3" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-zinc-200 bg-zinc-50 p-6 text-center">
        <p className="text-sm text-zinc-500">
          Yeni rehberler ekleniyor. Karşılaştırmalar için{" "}
          <Link href="/karsilastirma" className="text-orange-600 font-medium hover:text-orange-500">
            buraya göz atın →
          </Link>
        </p>
      </div>
    </div>
  );
}
