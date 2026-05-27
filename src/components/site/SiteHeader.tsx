import Link from "next/link";
import { Search, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/karsilastirma", label: "Karşılaştırmalar" },
  { href: "/blog", label: "Rehberler" },
  { href: "/araclar", label: "Araçlar" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <Link href="/" className="group flex items-center gap-2 shrink-0">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-zinc-300 bg-zinc-100 transition group-hover:border-orange-500/40">
            <Wrench className="size-4 text-orange-600" aria-hidden />
          </span>
          <span className="font-heading text-sm font-semibold tracking-tight text-zinc-900 md:text-base">
            Hırdavat<span className="text-orange-600">Pro</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-1 text-[12px] font-medium md:gap-2 md:text-sm">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-2.5 py-1.5 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 md:px-3",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/arama"
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-zinc-400 hover:border-zinc-300 hover:text-zinc-600 transition"
          >
            <Search className="size-3.5" />
            <span className="hidden text-[11px] font-semibold md:inline">Ara</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
