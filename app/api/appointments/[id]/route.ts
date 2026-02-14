import { NextRequest, NextResponse } from "next/server";
import { deleteAppointment, isAppointmentStatus, updateAppointmentStatus } from "@/lib/appointments";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const payload = await request.json();

  if (!payload || typeof payload.status !== "string" || !isAppointmentStatus(payload.status)) {
    return NextResponse.json({ error: "INVALID_STATUS" }, { status: 400 });
  }

  const updated = await updateAppointmentStatus(params.id, payload.status);

  if (!updated) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ appointment: updated });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value)) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const deleted = await deleteAppointment(params.id);

  if (!deleted) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
