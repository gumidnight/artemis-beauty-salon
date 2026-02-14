import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSessionValue, verifyAdminPassword } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.json();

  if (!payload || typeof payload.password !== "string") {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  if (!verifyAdminPassword(payload.password)) {
    return NextResponse.json({ error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: createAdminSessionValue(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  return response;
}
