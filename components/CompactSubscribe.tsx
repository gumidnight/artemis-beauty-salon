"use client";

import { FormEvent, useState } from "react";
import site from "@/content/site.json";

export default function CompactSubscribe() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);

    const normalized = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
      setMessage({ type: "error", text: site.newsletter.invalidEmailMessage });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized })
      });

      if (!response.ok) {
        throw new Error("subscribe_failed");
      }

      setEmail("");
      setMessage({ type: "success", text: site.newsletter.successMessage });
    } catch {
      setMessage({ type: "error", text: site.newsletter.errorMessage });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-5 rounded-2xl border border-border/80 bg-white/70 p-4">
      <p className="text-xs font-semibold tracking-[0.14em] uppercase text-accent">{site.newsletter.title}</p>
      <form className="mt-3 flex flex-col gap-2 sm:flex-row" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={site.newsletter.emailPlaceholder}
          className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm outline-none transition focus:border-accent"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {site.newsletter.submitLabel}
        </button>
      </form>
      {message && <p className={`mt-2 text-xs ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>{message.text}</p>}
    </div>
  );
}
