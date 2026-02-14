"use client";

import { FormEvent, useState } from "react";
import site from "@/content/site.json";

export default function NewsletterSection() {
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
        headers: {
          "Content-Type": "application/json"
        },
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
    <section className="reveal-on-scroll mx-auto w-full max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <div className="rounded-3xl border border-border bg-surface p-6 shadow-soft md:p-10">
        <div className="mb-5 space-y-2">
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">{site.newsletter.title}</h2>
          <p className="text-muted">{site.newsletter.subtitle}</p>
        </div>

        <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="newsletter-email">
            {site.newsletter.emailLabel}
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={site.newsletter.emailPlaceholder}
            className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-accent"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {site.newsletter.submitLabel}
          </button>
        </form>

        {message && <p className={`mt-4 text-sm ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>{message.text}</p>}
      </div>
    </section>
  );
}
