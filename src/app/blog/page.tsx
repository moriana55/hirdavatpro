import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog/posts";
import { Clock, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Hırdavat Rehberleri — Alet Seçim & Kullanım Kılavuzları",
  description: "Matkap nasıl seçilir, avuç taşlama alırken dikkat edilmesi gerekenler, kaynak makinesi rehberi ve daha fazlası. Atölye ve şantiye için pratik bilgiler.",
  alternates: { canonical: "https://hirdavatpro.com/blog" },
  openGraph: {
    title: "Hırdavat Rehberleri",
    description: "Atölye ve şantiye kararlarını kolaylaştıran teknik alet rehberleri.",
    url: "https://hirdavatpro.com/blog",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

type BlogCard = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  coverImage: string | null;
  readTime: string;
};

export default async function BlogPage() {
  // Birleşim: DB-tabanlı CMS yazıları + dosya-tabanlı statik rehberler, slug'a göre tekilleştir
  const dbPosts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, slug: true, excerpt: true, category: true, coverImage: true, readTime: true, createdAt: true },
  });

  const seen = new Set(dbPosts.map(p => p.slug));
  const filePosts: BlogCard[] = getAllPosts()
    .filter(p => !seen.has(p.slug))
    .map(p => ({
      id: p.slug,
      title: p.title,
      slug: p.slug,
      excerpt: p.excerpt,
      category: p.category,
      coverImage: null,
      readTime: p.readTime,
    }));

  const posts: BlogCard[] = [...dbPosts, ...filePosts];

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
      <p className="text-[12px] font-semibold uppercase tracking-wider text-[var(--muted-faint)] mb-1">Alet Seçim & Kullanım</p>
      <h1 className="font-heading text-[36px] font-bold text-[var(--foreground)] md:text-[44px]">
        Rehberler
      </h1>
      <p className="mt-3 text-[15px] text-[var(--muted)] max-w-lg">
        Alet seçimi, kullanım ipuçları ve teknik bilgiler. Atölye ve şantiye kararlarını kolaylaştıran pratik rehberler.
      </p>

      {posts.length === 0 ? (
        <div className="mt-16 text-center py-16 text-[var(--muted)]">
          <p className="text-lg font-medium mb-2">Henüz yayınlanmış rehber yok</p>
          <p className="text-sm">Yakında ekleniyor.</p>
        </div>
      ) : (
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {posts.map(g => (
            <Link
              key={g.id}
              href={`/blog/${g.slug}`}
              className="card-hover p-0 flex flex-col decoration-none overflow-hidden"
            >
              {g.coverImage && (
                <div className="w-full h-44 overflow-hidden">
                  <img src={g.coverImage} alt={g.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge badge-accent">{g.category}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[var(--muted-faint)]">
                    <Clock className="size-3" />
                    {g.readTime}
                  </span>
                </div>
                <h2 className="text-[17px] font-semibold text-[var(--foreground)]">{g.title}</h2>
                {g.excerpt && (
                  <p className="mt-2.5 text-[13px] text-[var(--muted)] leading-relaxed flex-1">{g.excerpt}</p>
                )}
                <div className="mt-5 pt-4 border-t border-[var(--border-subtle)]">
                  <span className="text-[12px] font-semibold text-primary hover:text-primary/80 uppercase tracking-wider decoration-none flex items-center gap-1">
                    Okumaya Devam Et →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-12 card p-8 text-center">
        <p className="text-[15px] text-[var(--muted)]">
          Karşılaştırmalar için{" "}
          <Link href="/karsilastirma" className="inline-flex items-center gap-1 text-[var(--accent)] font-semibold hover:text-[var(--accent-hover)] transition-colors">
            buraya göz atın
            <ArrowRight className="size-3.5" />
          </Link>
        </p>
      </div>
    </div>
  );
}
