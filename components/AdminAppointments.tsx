"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import site from "@/content/site.json";

type AppointmentStatus = "pending" | "confirmed" | "cancelled";

type Appointment = {
  id: string;
  name: string;
  surname: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  status: AppointmentStatus;
  createdAt: string;
};

type ViewMode = "calendar" | "list";

type ManualFormState = {
  name: string;
  surname: string;
  phone: string;
  date: string;
  time: string;
  service: string;
};

const initialManualForm: ManualFormState = {
  name: "",
  surname: "",
  phone: "",
  date: "",
  time: "",
  service: ""
};

function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateKey(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

function getMonthDaysGrid(monthDate: Date): Array<Date | null> {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const mondayStartIndex = (firstDay.getDay() + 6) % 7;
  const result: Array<Date | null> = [];

  for (let i = 0; i < mondayStartIndex; i += 1) {
    result.push(null);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    result.push(new Date(year, month, day));
  }

  while (result.length % 7 !== 0) {
    result.push(null);
  }

  return result;
}

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [draftStatuses, setDraftStatuses] = useState<Record<string, AppointmentStatus>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<string>(toDateKey(new Date()));
  const [manualForm, setManualForm] = useState<ManualFormState>(initialManualForm);
  const [manualSubmitting, setManualSubmitting] = useState(false);
  const [manualMessage, setManualMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const appointmentsByDate = useMemo(() => {
    return appointments.reduce<Record<string, Appointment[]>>((acc, appointment) => {
      if (!acc[appointment.date]) {
        acc[appointment.date] = [];
      }
      acc[appointment.date].push(appointment);
      return acc;
    }, {});
  }, [appointments]);

  const selectedDateAppointments = useMemo(() => {
    const current = appointmentsByDate[selectedDate] ?? [];
    return [...current].sort((a, b) => (a.time < b.time ? -1 : 1));
  }, [appointmentsByDate, selectedDate]);

  const monthDays = useMemo(() => getMonthDaysGrid(currentMonth), [currentMonth]);
  const services = useMemo(() => site.services.map((item) => item.title), []);

  const monthLabel = useMemo(() => {
    return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(currentMonth);
  }, [currentMonth]);

  const selectedDateLabel = useMemo(() => {
    const parsed = parseDateKey(selectedDate);
    return new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(parsed);
  }, [selectedDate]);

  const loadAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/appointments", { cache: "no-store" });
      if (!response.ok) {
        if (response.status === 401) {
          setError(site.adminPanel.unauthorizedError);
          setAppointments([]);
          return;
        }
        throw new Error("load_failed");
      }

      const data = (await response.json()) as { appointments: Appointment[] };
      setAppointments(data.appointments);
      setDraftStatuses(
        Object.fromEntries(data.appointments.map((appointment) => [appointment.id, appointment.status])) as Record<
          string,
          AppointmentStatus
        >
      );
    } catch {
      setError(site.adminPanel.loadError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAppointments();
  }, [loadAppointments]);

  async function updateStatus(id: string, status: AppointmentStatus) {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError(site.adminPanel.unauthorizedError);
          return;
        }
        throw new Error("update_failed");
      }

      await loadAppointments();
    } catch {
      setError(site.adminPanel.manageError);
    }
  }

  async function removeAppointment(id: string) {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError(site.adminPanel.unauthorizedError);
          return;
        }
        throw new Error("delete_failed");
      }

      await loadAppointments();
    } catch {
      setError(site.adminPanel.manageError);
    }
  }

  async function handleManualSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setManualMessage(null);

    const requiredFields = [manualForm.name, manualForm.surname, manualForm.phone, manualForm.date, manualForm.time, manualForm.service];
    if (requiredFields.some((value) => value.trim().length === 0)) {
      setManualMessage({ type: "error", text: site.adminPanel.manualValidationError });
      return;
    }

    setManualSubmitting(true);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(manualForm)
      });

      if (!response.ok) {
        if (response.status === 409) {
          setManualMessage({ type: "error", text: site.appointmentForm.slotUnavailableError });
          return;
        }
        throw new Error("manual_create_failed");
      }

      setManualMessage({ type: "success", text: site.adminPanel.manualSuccessMessage });
      setManualForm(initialManualForm);
      setSelectedDate(manualForm.date);
      setCurrentMonth(new Date(parseDateKey(manualForm.date).getFullYear(), parseDateKey(manualForm.date).getMonth(), 1));
      await loadAppointments();
    } catch {
      setManualMessage({ type: "error", text: site.adminPanel.manualErrorMessage });
    } finally {
      setManualSubmitting(false);
    }
  }

  function renderAppointmentCard(appointment: Appointment) {
    return (
      <article key={appointment.id} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
        <div className="grid gap-3 text-sm md:grid-cols-3">
          <p>
            <span className="font-semibold">{site.appointmentForm.fields.name}: </span>
            {appointment.name}
          </p>
          <p>
            <span className="font-semibold">{site.appointmentForm.fields.surname}: </span>
            {appointment.surname}
          </p>
          <p>
            <span className="font-semibold">{site.appointmentForm.fields.phone}: </span>
            {appointment.phone}
          </p>
          <p>
            <span className="font-semibold">{site.appointmentForm.fields.service}: </span>
            {appointment.service}
          </p>
          <p>
            <span className="font-semibold">{site.appointmentForm.fields.date}: </span>
            {appointment.date}
          </p>
          <p>
            <span className="font-semibold">{site.appointmentForm.fields.time}: </span>
            {appointment.time}
          </p>
          <p>
            <span className="font-semibold">{site.adminPanel.createdLabel}: </span>
            {new Date(appointment.createdAt).toLocaleString()}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold" htmlFor={`status-${appointment.id}`}>
            {site.adminPanel.statusLabel}
          </label>
          <select
            id={`status-${appointment.id}`}
            value={draftStatuses[appointment.id] ?? appointment.status}
            onChange={(event) =>
              setDraftStatuses((prev) => ({ ...prev, [appointment.id]: event.target.value as AppointmentStatus }))
            }
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="pending">{site.adminPanel.statuses.pending}</option>
            <option value="confirmed">{site.adminPanel.statuses.confirmed}</option>
            <option value="cancelled">{site.adminPanel.statuses.cancelled}</option>
          </select>

          <button
            type="button"
            onClick={() => void updateStatus(appointment.id, draftStatuses[appointment.id] ?? appointment.status)}
            className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:border-accent"
          >
            {site.adminPanel.updateLabel}
          </button>

          <button
            type="button"
            onClick={() => void removeAppointment(appointment.id)}
            className="rounded-full border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
          >
            {site.adminPanel.deleteLabel}
          </button>
        </div>
      </article>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12">
      <div className="mb-6 rounded-2xl border border-border bg-white p-4 shadow-soft md:p-6">
        <div className="mb-4 space-y-1">
          <p className="font-[family-name:var(--font-display)] text-2xl">{site.adminPanel.manualSectionTitle}</p>
          <p className="text-sm text-muted">{site.adminPanel.manualSectionSubtitle}</p>
        </div>

        <form className="grid gap-3 md:grid-cols-3" onSubmit={handleManualSubmit}>
          <input
            value={manualForm.name}
            onChange={(event) => setManualForm((prev) => ({ ...prev, name: event.target.value }))}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent"
            placeholder={site.appointmentForm.fields.name}
            required
          />
          <input
            value={manualForm.surname}
            onChange={(event) => setManualForm((prev) => ({ ...prev, surname: event.target.value }))}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent"
            placeholder={site.appointmentForm.fields.surname}
            required
          />
          <input
            value={manualForm.phone}
            onChange={(event) => setManualForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent"
            placeholder={site.appointmentForm.fields.phone}
            required
          />
          <select
            value={manualForm.service}
            onChange={(event) => setManualForm((prev) => ({ ...prev, service: event.target.value }))}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent"
            required
          >
            <option value="">{site.appointmentForm.servicePlaceholder}</option>
            {services.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
          <input
            value={manualForm.date}
            onChange={(event) => setManualForm((prev) => ({ ...prev, date: event.target.value }))}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent"
            type="date"
            required
          />
          <select
            value={manualForm.time}
            onChange={(event) => setManualForm((prev) => ({ ...prev, time: event.target.value }))}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition focus:border-accent"
            required
          >
            <option value="">{site.appointmentForm.timePlaceholder}</option>
            {site.appointmentForm.timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={manualSubmitting}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:border-accent disabled:opacity-60"
            >
              {site.adminPanel.manualCreateLabel}
            </button>
          </div>
        </form>

        {manualMessage && (
          <p className={`mt-3 text-sm ${manualMessage.type === "success" ? "text-green-700" : "text-red-700"}`}>
            {manualMessage.text}
          </p>
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              viewMode === "calendar" ? "border-accent text-accent" : "border-border"
            }`}
          >
            {site.adminPanel.calendarViewLabel}
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              viewMode === "list" ? "border-accent text-accent" : "border-border"
            }`}
          >
            {site.adminPanel.listViewLabel}
          </button>
        </div>

        <button
          type="button"
          onClick={() => void loadAppointments()}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:border-accent"
        >
          {site.adminPanel.refreshLabel}
        </button>
      </div>

      {loading && <p className="text-sm text-muted">{site.adminPanel.loadingLabel}</p>}
      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {!loading && appointments.length === 0 && <p className="text-sm text-muted">{site.adminPanel.emptyLabel}</p>}

      {!loading && viewMode === "calendar" && appointments.length > 0 && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-4 shadow-soft md:p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                className="rounded-full border border-border px-3 py-1.5 text-sm font-semibold transition hover:border-accent"
                aria-label={site.adminPanel.monthPreviousLabel}
              >
                {"<"}
              </button>
              <p className="font-[family-name:var(--font-display)] text-2xl">{monthLabel}</p>
              <button
                type="button"
                onClick={() => setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                className="rounded-full border border-border px-3 py-1.5 text-sm font-semibold transition hover:border-accent"
                aria-label={site.adminPanel.monthNextLabel}
              >
                {">"}
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {site.adminPanel.weekdays.map((day) => (
                <p key={day} className="text-center text-xs font-semibold uppercase text-muted">
                  {day}
                </p>
              ))}

              {monthDays.map((day, index) => {
                if (!day) {
                  return <div key={`empty-${index}`} className="h-24 rounded-lg border border-transparent" />;
                }

                const dateKey = toDateKey(day);
                const count = appointmentsByDate[dateKey]?.length ?? 0;
                const isSelected = selectedDate === dateKey;

                return (
                  <button
                    key={dateKey}
                    type="button"
                    onClick={() => setSelectedDate(dateKey)}
                    className={`h-24 rounded-lg border p-2 text-left transition ${
                      isSelected ? "border-accent bg-surface" : "border-border hover:border-accent/70"
                    }`}
                  >
                    <p className="text-xs font-semibold">{day.getDate()}</p>
                    <p className="mt-2 text-xs text-muted">
                      {count} {site.adminPanel.appointmentCountLabel}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold">
              {site.adminPanel.selectedDateLabel}: <span className="font-normal">{selectedDateLabel}</span>
            </p>
            <p className="text-sm font-semibold">{site.adminPanel.appointmentsForDateLabel}</p>

            {selectedDateAppointments.length === 0 ? (
              <p className="text-sm text-muted">{site.adminPanel.noAppointmentsForDate}</p>
            ) : (
              <div className="space-y-4">{selectedDateAppointments.map((appointment) => renderAppointmentCard(appointment))}</div>
            )}
          </div>
        </div>
      )}

      {!loading && viewMode === "list" && appointments.length > 0 && (
        <div className="space-y-4">{appointments.map((appointment) => renderAppointmentCard(appointment))}</div>
      )}
    </section>
  );
}
