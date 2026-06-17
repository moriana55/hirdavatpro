import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Tüm admin sayfaları için server-side oturum guard'ı (proxy'ye ek savunma katmanı).
// Giriş sayfası (x9k4-sys/auth) hariç tutulur.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "";

  if (!pathname.startsWith("/x9k4-sys/auth")) {
    const authed = await isAuthenticated();
    if (!authed) redirect("/x9k4-sys/auth");
  }

  return <>{children}</>;
}
