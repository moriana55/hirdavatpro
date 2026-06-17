import { prisma } from "@/lib/db";

export interface B2BQuoteItem {
  query: string; // kullanıcının girdiği SKU/isim
  productId?: string;
  brand?: string;
  model?: string;
  qty: number;
}

export async function createQuote(data: {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  taxNumber?: string;
  items: B2BQuoteItem[];
  note?: string;
}) {
  return prisma.b2BQuote.create({
    data: {
      companyName: data.companyName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      taxNumber: data.taxNumber,
      items: data.items as any,
      note: data.note ?? "",
    },
  });
}
