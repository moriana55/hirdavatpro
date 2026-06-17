import { prisma } from "@/lib/db";

// Kayıtlı proje öğesi — proje sihirbazı çıktısının kalıcı hali.
export interface SavedProjectItem {
  category: string;
  categoryLabel: string;
  rol: "alet" | "sarf" | "guvenlik";
  neden: string;
  productId?: string;
  brand?: string;
  model?: string;
  priceRange?: string;
}

export interface SavedProject {
  id: string;
  ownerKey: string;
  name: string;
  desc: string;
  items: SavedProjectItem[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

function toProject(row: any): SavedProject {
  return {
    id: row.id,
    ownerKey: row.ownerKey,
    name: row.name,
    desc: row.desc,
    items: (typeof row.items === "string" ? JSON.parse(row.items) : row.items) || [],
    notes: row.notes,
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
    updatedAt: row.updatedAt instanceof Date ? row.updatedAt.toISOString() : row.updatedAt,
  };
}

export async function listProjects(ownerKey: string): Promise<SavedProject[]> {
  const rows = await prisma.project.findMany({
    where: { ownerKey },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toProject);
}

export async function getProject(id: string, ownerKey: string): Promise<SavedProject | undefined> {
  const row = await prisma.project.findUnique({ where: { id } });
  if (!row || row.ownerKey !== ownerKey) return undefined;
  return toProject(row);
}

export async function createProject(input: {
  ownerKey: string;
  name: string;
  desc: string;
  items: SavedProjectItem[];
  notes?: string;
}): Promise<SavedProject> {
  const row = await prisma.project.create({
    data: {
      ownerKey: input.ownerKey,
      name: input.name,
      desc: input.desc,
      items: input.items as any,
      notes: input.notes || "",
    },
  });
  return toProject(row);
}

export async function deleteProject(id: string, ownerKey: string): Promise<boolean> {
  const row = await prisma.project.findUnique({ where: { id } });
  if (!row || row.ownerKey !== ownerKey) return false;
  await prisma.project.delete({ where: { id } });
  return true;
}
