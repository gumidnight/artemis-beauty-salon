"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import site from "@/content/site.json";

type FormState = {
  name: string;
  surname: string;
  phone: string;
  date: string;
  time: string;
  service: string;
};

const initialState: FormState = {
  name: "",
  surname: "",
  phone: "",
  date: "",
  time: "",
  service: ""
};

export default function AppointmentSection() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const services = useMemo(() => site.services.map((item) => item.title), []);
  const timeSlots = useMemo(() => site.appointmentForm.timeSlots, []);

  useEffect(() => {
    if (!form.date) {
      setBookedTimes([]);
      return;
    }

    const controller = new AbortController();

    async function loadAvailability() {
      setLoadingAvailability(true);

      try {
        const response = await fetch(`/api/appointments?date=${encodeURIComponent(form.date)}`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error("availability_failed");
        }

        const data = (await response.json()) as { date: string; bookedTimes: string[] };
        setBookedTimes(data.bookedTimes);
      } catch {
        if (!controller.signal.aborted) {
          setBookedTimes([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingAvailability(false);
        }
      }
    }

    void loadAvailability();
    return () => controller.abort();
  }, [form.date]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const requiredFields = [form.name, form.surname, form.phone, form.date, form.time, form.service];
    if (requiredFields.some((value) => value.trim().length === 0)) {
      setMessage({ type: "error", text: site.appointmentForm.validationError });
      return;
    }

    if (bookedTimes.includes(form.time)) {
      setMessage({ type: "error", text: site.appointmentForm.slotUnavailableError });
      return;
    }

    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        if (response.status === 409) {
          setMessage({ type: "error", text: site.appointmentForm.slotUnavailableError });
          return;
        }
        throw new Error("request_failed");
      }

      setForm(initialState);
      setMessage({ type: "success", text: site.appointmentForm.successMessage });
    } catch {
      setMessage({ type: "error", text: site.appointmentForm.errorMessage });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="reveal-on-scroll mx-auto w-full max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <div className="rounded-3xl border border-border bg-white p-6 shadow-soft md:p-10">
        <div className="mb-6 space-y-2">
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">{site.appointmentForm.title}</h2>
          <p className="text-muted">{site.appointmentForm.subtitle}</p>
        </div>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <label className="text-sm">
            <span className="mb-2 block font-semibold">{site.appointmentForm.fields.name}</span>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-accent"
              type="text"
              name="name"
              required
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block font-semibold">{site.appointmentForm.fields.surname}</span>
            <input
              value={form.surname}
              onChange={(event) => setForm((prev) => ({ ...prev, surname: event.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-accent"
              type="text"
              name="surname"
              required
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block font-semibold">{site.appointmentForm.fields.phone}</span>
            <input
              value={form.phone}
              onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-accent"
              type="tel"
              name="phone"
              required
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block font-semibold">{site.appointmentForm.fields.service}</span>
            <select
              value={form.service}
              onChange={(event) => setForm((prev) => ({ ...prev, service: event.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-accent"
              name="service"
              required
            >
              <option value="">{site.appointmentForm.servicePlaceholder}</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-2 block font-semibold">{site.appointmentForm.fields.date}</span>
            <input
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value, time: "" }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-accent"
              type="date"
              name="date"
              required
            />
          </label>

          <label className="text-sm">
            <span className="mb-2 block font-semibold">{site.appointmentForm.fields.time}</span>
            <select
              value={form.time}
              onChange={(event) => setForm((prev) => ({ ...prev, time: event.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-accent"
              name="time"
              required
              disabled={!form.date || loadingAvailability}
            >
              <option value="">{site.appointmentForm.timePlaceholder}</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot} disabled={bookedTimes.includes(slot)}>
                  {slot} {bookedTimes.includes(slot) ? `(${site.appointmentForm.availabilityBookedLabel})` : ""}
                </option>
              ))}
            </select>
          </label>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {site.appointmentForm.submitLabel}
            </button>
          </div>
        </form>

        <div className="mt-5 rounded-2xl border border-border bg-surface p-4">
          <p className="text-sm font-semibold">{site.appointmentForm.availabilityLabel}</p>
          {!form.date && <p className="mt-2 text-sm text-muted">{site.appointmentForm.selectDateToViewAvailability}</p>}
          {form.date && (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5">
              {timeSlots.map((slot) => {
                const isBooked = bookedTimes.includes(slot);
                return (
                  <span
                    key={slot}
                    className={`rounded-lg px-3 py-2 text-center text-xs font-semibold ${
                      isBooked ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {slot} · {isBooked ? site.appointmentForm.availabilityBookedLabel : site.appointmentForm.availabilityOpenLabel}
                  </span>
                );
              })}
            </div>
          )}
        </div>

        {message && (
          <p className={`mt-4 text-sm ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>{message.text}</p>
        )}
      </div>
    </section>
  );
}
