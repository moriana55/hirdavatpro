import { prisma } from "@/lib/db";

export async function createLead(data: {
  email: string;
  source?: string;
  context?: string;
  consent: boolean;
}) {
  return prisma.lead.create({
    data: {
      email: data.email,
      source: (data.source ?? "comparison").slice(0, 40),
      context: (data.context ?? "").slice(0, 300),
      consent: data.consent,
    },
  });
}

// Basit e-posta doğrulama (zod yok).
export function isValidEmail(value: string): boolean {
  if (typeof value !== "string") return false;
  const v = value.trim();
  if (v.length < 5 || v.length > 120) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
