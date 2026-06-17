import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "hirdavat2026";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    if (password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ success: true });
      
      // Set secure HTTP-only cookie valid for 7 days
      response.cookies.set("hirdavatpro_admin_token", ADMIN_PASSWORD, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Geçersiz şifre!" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Sistem hatası!" }, { status: 500 });
  }
}
