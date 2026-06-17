import { prisma } from "@/lib/db";

export interface Craftsman {
  id: string;
  name: string;
  city: string;
  trades: string[];
  phone: string;
  email?: string;
  about: string;
  rating: number;
  jobsDone: number;
  verified: boolean;
  createdAt: string;
}

// Meslek (trade) tanımları — directory filtreleri ve başvuru formu paylaşır.
export const TRADES: { key: string; label: string }[] = [
  { key: "elektrik", label: "Elektrikçi" },
  { key: "tesisat", label: "Tesisatçı / Su Tesisatı" },
  { key: "boya", label: "Boyacı / Badanacı" },
  { key: "fayans", label: "Fayans / Seramik Ustası" },
  { key: "marangoz", label: "Marangoz / Mobilyacı" },
  { key: "kaynak", label: "Kaynakçı / Demir Doğrama" },
  { key: "klima", label: "Klima / Soğutma Teknisyeni" },
  { key: "alci", label: "Alçı / Sıva Ustası" },
  { key: "cati", label: "Çatı / Yalıtım Ustası" },
  { key: "tadilat", label: "Genel Tadilat / İnşaat" },
  { key: "bahce", label: "Bahçe / Peyzaj" },
  { key: "cam", label: "Cam / PVC Doğrama" },
];

export const TRADE_LABELS: Record<string, string> = Object.fromEntries(
  TRADES.map((t) => [t.key, t.label])
);

// Türkiye'nin yoğun şehirleri — filtre dropdown'u için.
export const CITIES = [
  "İstanbul",
  "Ankara",
  "İzmir",
  "Bursa",
  "Antalya",
  "Adana",
  "Konya",
  "Gaziantep",
  "Kayseri",
  "Mersin",
];

function toCraftsman(row: any): Craftsman {
  return {
    id: row.id,
    name: row.name,
    city: row.city,
    trades: row.trades ?? [],
    phone: row.phone,
    email: row.email ?? undefined,
    about: row.about ?? "",
    rating: typeof row.rating === "number" ? row.rating : Number(row.rating) || 0,
    jobsDone: row.jobsDone ?? 0,
    verified: !!row.verified,
    createdAt:
      row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
  };
}

export async function getCraftsmen(filter?: {
  city?: string;
  trade?: string;
}): Promise<Craftsman[]> {
  const where: any = { verified: true };
  if (filter?.city) where.city = filter.city;
  if (filter?.trade) where.trades = { has: filter.trade };
  const rows = await prisma.craftsman.findMany({
    where,
    orderBy: [{ rating: "desc" }, { jobsDone: "desc" }],
  });
  return rows.map(toCraftsman);
}

export async function createApplication(data: {
  name: string;
  city: string;
  trades: string[];
  phone: string;
  email?: string;
  about?: string;
}) {
  return prisma.craftsmanApplication.create({
    data: {
      name: data.name,
      city: data.city,
      trades: data.trades,
      phone: data.phone,
      email: data.email,
      about: data.about ?? "",
    },
  });
}
