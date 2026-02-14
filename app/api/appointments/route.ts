import { NextRequest, NextResponse } from "next/server";
import {
  createAppointment,
  getBookedTimesForDate,
  isTimeSlotAvailable,
  isValidAppointmentInput,
  readAppointments
} from "@/lib/appointments";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-auth";
import site from "@/content/site.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (date) {
    const bookedTimes = await getBookedTimesForDate(date);
    return NextResponse.json({ date, bookedTimes });
  }

  const isAuthenticated = isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  if (!isAuthenticated) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  const appointments = await readAppointments();
  return NextResponse.json({ appointments });
}

export async function POST(request: Request) {
  const payload = await request.json();

  if (!isValidAppointmentInput(payload)) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  if (!site.appointmentForm.timeSlots.includes(payload.time.trim())) {
    return NextResponse.json({ error: "INVALID_TIME_SLOT" }, { status: 400 });
  }

  const isAvailable = await isTimeSlotAvailable(payload.date.trim(), payload.time.trim());

  if (!isAvailable) {
    return NextResponse.json({ error: "SLOT_UNAVAILABLE" }, { status: 409 });
  }

  const appointment = await createAppointment({
    name: payload.name.trim(),
    surname: payload.surname.trim(),
    phone: payload.phone.trim(),
    email: typeof payload.email === "string" ? payload.email.trim() : undefined,
    date: payload.date.trim(),
    time: payload.time.trim(),
    service: payload.service.trim()
  });

  return NextResponse.json({ appointment }, { status: 201 });
}
