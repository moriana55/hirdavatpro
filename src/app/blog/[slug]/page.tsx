import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog/posts";
import { Clock, Tag, ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const title = `${post.title} | Hırdavat Pro Rehber`;
  return {
    title,
    description: post.excerpt,
    alternates: { canonical: `https://hirdavatpro.com/blog/${post.slug}` },
    openGraph: {
      title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);

  return (
    <article className="mx-auto max-w-3xl px-4 py-14 md:px-6 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.publishedAt,
            publisher: {
              "@type": "Organization",
              name: "Hırdavat Pro",
              url: "https://hirdavatpro.com",
            },
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="mb-10 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">
        <Link href="/" className="transition hover:text-orange-600/90">Ana sayfa</Link>
        <span className="text-zinc-400">/</span>
        <Link href="/blog" className="transition hover:text-orange-600/90">Rehberler</Link>
        <span className="text-zinc-400">/</span>
        <span className="text-orange-600/90 truncate max-w-[200px]">{post.title}</span>
      </nav>

      {/* Header */}
      <header className="border-b border-zinc-200 pb-10 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded border border-orange-200 bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1">
            <Tag className="size-3" />
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-zinc-400">
            <Clock className="size-3" />
            {post.readTime} okuma
          </span>
        </div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl">
          {post.title}
        </h1>
        <p className="text-sm leading-relaxed text-zinc-500 max-w-xl">
          {post.excerpt}
        </p>
      </header>

      {/* Content */}
      <div className="mt-10 space-y-10">
        {post.sections.map((section, i) => (
          <section key={i}>
            {section.heading && (
              <h2 className="mb-4 font-heading text-lg font-semibold text-zinc-800">
                {section.heading}
              </h2>
            )}
            <div className="prose-sm prose-zinc max-w-none">
              {section.body.split("\n\n").map((para, j) => {
                if (para.startsWith("| ")) {
                  const rows = para.trim().split("\n").filter(r => !r.match(/^\|[-| ]+\|$/));
                  return (
                    <div key={j} className="overflow-x-auto mt-4 mb-4 rounded-lg border border-zinc-200">
                      <table className="w-full text-sm">
                        {rows.map((row, ri) => {
                          const cells = row.split("|").filter(c => c.trim() !== "");
                          return ri === 0 ? (
                            <thead key={ri}>
                              <tr className="border-b border-zinc-200 bg-zinc-50">
                                {cells.map((cell, ci) => (
                                  <th key={ci} className="px-4 py-2 text-left text-xs font-semibold text-zinc-600">
                                    {cell.trim()}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                          ) : (
                            <tbody key={ri}>
                              <tr className="border-b border-zinc-100 last:border-0">
                                {cells.map((cell, ci) => (
                                  <td key={ci} className="px-4 py-2 text-xs text-zinc-600">
                                    {cell.trim()}
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          );
                        })}
                      </table>
                    </div>
                  );
                }

                if (para.startsWith("- ") || para.startsWith("1. ")) {
                  const items = para.trim().split("\n");
                  const isOrdered = items[0].match(/^\d+\. /);
                  const Tag = isOrdered ? "ol" : "ul";
                  return (
                    <Tag key={j} className={`mt-3 mb-3 space-y-1.5 pl-5 ${isOrdered ? "list-decimal" : "list-disc"}`}>
                      {items.map((item, ii) => {
                        const text = item.replace(/^[-\d]+[.)]\s/, "");
                        const parts = text.split(/(\*\*[^*]+\*\*)/g);
                        return (
                          <li key={ii} className="text-sm text-zinc-600 leading-relaxed">
                            {parts.map((part, pi) =>
                              part.startsWith("**") && part.endsWith("**")
                                ? <strong key={pi} className="font-semibold text-zinc-800">{part.slice(2, -2)}</strong>
                                : part
                            )}
                          </li>
                        );
                      })}
                    </Tag>
                  );
                }

                const parts = para.split(/(\*\*[^*]+\*\*)/g);
                const hasFormatting = parts.some(p => p.startsWith("**") && p.endsWith("**"));
                return (
                  <p key={j} className="text-sm text-zinc-600 leading-relaxed mt-3 mb-3">
                    {hasFormatting
                      ? parts.map((part, pi) =>
                          part.startsWith("**") && part.endsWith("**")
                            ? <strong key={pi} className="font-semibold text-zinc-800">{part.slice(2, -2)}</strong>
                            : part
                        )
                      : para}
                  </p>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Related */}
      {related.length > 0 && (
        <aside className="mt-16 border-t border-zinc-200 pt-10">
          <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400 mb-6">
            İlgili Rehberler
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {related.map(r => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition hover:border-zinc-300 hover:bg-zinc-100"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600/80">
                  {r.category}
                </span>
                <p className="mt-1.5 text-sm font-semibold text-zinc-800 group-hover:text-orange-600 transition">
                  {r.title}
                </p>
                <p className="mt-1 text-xs text-zinc-400">{r.readTime} okuma</p>
              </Link>
            ))}
          </div>
        </aside>
      )}

      {/* Back */}
      <div className="mt-12">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition hover:text-orange-600"
        >
          <ArrowLeft className="size-4" />
          Tüm Rehberler
        </Link>
      </div>
    </article>
  );
}
