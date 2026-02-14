import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type AppointmentStatus = "pending" | "confirmed" | "cancelled";

export type Appointment = {
  id: string;
  name: string;
  surname: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  service: string;
  status: AppointmentStatus;
  createdAt: string;
};

type AppointmentInput = {
  name: string;
  surname: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  service: string;
};

const dataDir = path.join(process.cwd(), "data");
const dataFile = path.join(dataDir, "appointments.json");

async function ensureStore() {
  await mkdir(dataDir, { recursive: true });

  try {
    await readFile(dataFile, "utf-8");
  } catch {
    await writeFile(dataFile, "[]\n", "utf-8");
  }
}

export async function readAppointments(): Promise<Appointment[]> {
  await ensureStore();
  const raw = await readFile(dataFile, "utf-8");

  try {
    const parsed = JSON.parse(raw) as Appointment[];
    return parsed.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return [];
  }
}

async function writeAppointments(appointments: Appointment[]) {
  await ensureStore();
  await writeFile(dataFile, `${JSON.stringify(appointments, null, 2)}\n`, "utf-8");
}

export async function createAppointment(input: AppointmentInput): Promise<Appointment> {
  const newAppointment: Appointment = {
    id: randomUUID(),
    name: input.name,
    surname: input.surname,
    phone: input.phone,
    email: input.email?.trim() ? input.email.trim() : undefined,
    date: input.date,
    time: input.time,
    service: input.service,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  const appointments = await readAppointments();
  appointments.unshift(newAppointment);
  await writeAppointments(appointments);

  return newAppointment;
}

export async function isTimeSlotAvailable(date: string, time: string): Promise<boolean> {
  const appointments = await readAppointments();

  return !appointments.some(
    (item) => item.date === date && item.time === time && (item.status === "pending" || item.status === "confirmed")
  );
}

export async function getBookedTimesForDate(date: string): Promise<string[]> {
  const appointments = await readAppointments();

  return appointments
    .filter((item) => item.date === date && (item.status === "pending" || item.status === "confirmed"))
    .map((item) => item.time);
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<Appointment | null> {
  const appointments = await readAppointments();
  const index = appointments.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  appointments[index] = {
    ...appointments[index],
    status
  };

  await writeAppointments(appointments);
  return appointments[index];
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const appointments = await readAppointments();
  const filtered = appointments.filter((item) => item.id !== id);

  if (filtered.length === appointments.length) {
    return false;
  }

  await writeAppointments(filtered);
  return true;
}

export function isAppointmentStatus(value: string): value is AppointmentStatus {
  return value === "pending" || value === "confirmed" || value === "cancelled";
}

export function isValidAppointmentInput(payload: unknown): payload is AppointmentInput {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  const candidate = payload as Record<string, unknown>;
  const required = ["name", "surname", "phone", "date", "time", "service"];
  const emailIsValid = candidate.email === undefined || typeof candidate.email === "string";

  return emailIsValid && required.every((key) => typeof candidate[key] === "string" && candidate[key].trim().length > 0);
}
