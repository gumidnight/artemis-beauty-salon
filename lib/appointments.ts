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

async function getKV() {
  // @ts-ignore - KV binding will be available at runtime on Cloudflare
  return typeof APPOINTMENTS_KV !== 'undefined' ? APPOINTMENTS_KV : null;
}

async function getAppointments(): Promise<Appointment[]> {
  const kv = await getKV();
  if (!kv) {
    console.warn('KV not available, using empty array');
    return [];
  }
  
  const data = await kv.get('appointments', { type: 'json' });
  return data || [];
}

async function saveAppointments(appointments: Appointment[]): Promise<void> {
  const kv = await getKV();
  if (!kv) {
    console.warn('KV not available, cannot save');
    return;
  }
  
  await kv.put('appointments', JSON.stringify(appointments));
}

function generateId(): string {
  return crypto.randomUUID();
}

export async function createAppointment(input: AppointmentInput): Promise<Appointment> {
  const appointments = await getAppointments();
  
  const appointment: Appointment = {
    id: generateId(),
    ...input,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  
  appointments.push(appointment);
  await saveAppointments(appointments);
  
  return appointment;
}

export async function getAllAppointments(): Promise<Appointment[]> {
  return await getAppointments();
}

export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const appointments = await getAppointments();
  return appointments.find(a => a.id === id) || null;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<Appointment | null> {
  const appointments = await getAppointments();
  const index = appointments.findIndex(a => a.id === id);
  
  if (index === -1) return null;
  
  appointments[index].status = status;
  await saveAppointments(appointments);
  
  return appointments[index];
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const appointments = await getAppointments();
  const filtered = appointments.filter(a => a.id !== id);
  
  if (filtered.length === appointments.length) return false;
  
  await saveAppointments(filtered);
  return true;
}

export function isAppointmentStatus(value: string): value is AppointmentStatus {
  return ["pending", "confirmed", "cancelled"].includes(value);
}
