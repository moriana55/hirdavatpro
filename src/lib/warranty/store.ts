import { prisma } from "@/lib/db";

export interface WarrantyRecord {
  id: string;
  ownerKey: string;
  productLabel: string;
  brand: string;
  serial: string;
  purchaseDate: string; // ISO
  months: number;
  note: string;
  createdAt: string;
}

// Hesaplanan garanti durumu (kayıt + türetilmiş alanlar).
export interface WarrantyComputed extends WarrantyRecord {
  endDate: string; // ISO — garanti bitiş
  daysLeft: number; // bugüne göre kalan gün (negatif = bitmiş)
  status: "active" | "expiring" | "expired";
}

function toRecord(row: any): WarrantyRecord {
  return {
    id: row.id,
    ownerKey: row.ownerKey,
    productLabel: row.productLabel,
    brand: row.brand,
    serial: row.serial,
    purchaseDate: row.purchaseDate instanceof Date ? row.purchaseDate.toISOString() : row.purchaseDate,
    months: row.months,
    note: row.note,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
  };
}

// Garanti bitişi + durum hesaplama. EXPIRING eşiği 30 gün.
export function computeWarranty(rec: WarrantyRecord, now = new Date()): WarrantyComputed {
  const start = new Date(rec.purchaseDate);
  const end = new Date(start);
  end.setMonth(end.getMonth() + rec.months);
  const msLeft = end.getTime() - now.getTime();
  const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
  const status: WarrantyComputed["status"] = daysLeft < 0 ? "expired" : daysLeft <= 30 ? "expiring" : "active";
  return { ...rec, endDate: end.toISOString(), daysLeft, status };
}

export async function listWarranties(ownerKey: string): Promise<WarrantyComputed[]> {
  const rows = await prisma.warrantyRecord.findMany({
    where: { ownerKey },
    orderBy: { purchaseDate: "desc" },
  });
  return rows.map((r: any) => computeWarranty(toRecord(r)));
}

export async function createWarranty(input: {
  ownerKey: string;
  productLabel: string;
  brand?: string;
  serial?: string;
  purchaseDate: Date;
  months: number;
  note?: string;
}): Promise<WarrantyComputed> {
  const row = await prisma.warrantyRecord.create({
    data: {
      ownerKey: input.ownerKey,
      productLabel: input.productLabel,
      brand: input.brand || "",
      serial: input.serial || "",
      purchaseDate: input.purchaseDate,
      months: input.months,
      note: input.note || "",
    },
  });
  return computeWarranty(toRecord(row));
}

export async function deleteWarranty(id: string, ownerKey: string): Promise<boolean> {
  const row = await prisma.warrantyRecord.findUnique({ where: { id } });
  if (!row || row.ownerKey !== ownerKey) return false;
  await prisma.warrantyRecord.delete({ where: { id } });
  return true;
}
