import { NextRequest, NextResponse } from "next/server";
import { findServiceCenters, SERVICE_CENTERS } from "@/lib/warranty/service-centers";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const brand = url.searchParams.get("brand") || undefined;
  const city = url.searchParams.get("city") || undefined;
  const matched = brand || city ? findServiceCenters({ brand, city }) : SERVICE_CENTERS;
  return NextResponse.json({ centers: matched });
}
