export const runtime = 'edge';



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

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (date) {
    try {
      const bookedTimes = await getBookedTimesForDate(date);
      return NextResponse.json({ date, bookedTimes });
    } catch (error) {
      console.error("Failed to load booked times", error);
      return NextResponse.json({ error: "READ_FAILED" }, { status: 500 });
    }
  }

  const isAuthenticated = isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
  if (!isAuthenticated) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const appointments = await readAppointments();
    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Failed to load appointments", error);
    return NextResponse.json({ error: "READ_FAILED" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const payload = await request.json();

  if (!isValidAppointmentInput(payload)) {
    return NextResponse.json({ error: "INVALID_PAYLOAD" }, { status: 400 });
  }

  if (!site.appointmentForm.timeSlots.includes(payload.time.trim())) {
    return NextResponse.json({ error: "INVALID_TIME_SLOT" }, { status: 400 });
  }

  let isAvailable = false;
  try {
    isAvailable = await isTimeSlotAvailable(payload.date.trim(), payload.time.trim());
  } catch (error) {
    console.error("Failed to check slot availability", error);
    return NextResponse.json({ error: "READ_FAILED" }, { status: 500 });
  }

  if (!isAvailable) {
    return NextResponse.json({ error: "SLOT_UNAVAILABLE" }, { status: 409 });
  }

  try {
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
  } catch (error) {
    console.error("Failed to create appointment", error);
    return NextResponse.json({ error: "WRITE_FAILED" }, { status: 500 });
  }
}
