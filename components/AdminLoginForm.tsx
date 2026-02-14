"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import site from "@/content/site.json";

export default function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        setError(site.adminAuth.errorMessage);
        return;
      }

      router.refresh();
    } catch {
      setError(site.adminAuth.errorMessage);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-md px-4 py-10 md:px-8">
      <div className="rounded-3xl border border-border bg-white p-6 shadow-soft md:p-8">
        <div className="mb-5 space-y-2">
          <h2 className="font-[family-name:var(--font-display)] text-3xl">{site.adminAuth.title}</h2>
          <p className="text-sm text-muted">{site.adminAuth.subtitle}</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="text-sm">
            <span className="mb-2 block font-semibold">{site.adminAuth.passwordLabel}</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={site.adminAuth.passwordPlaceholder}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-accent"
              required
            />
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {site.adminAuth.submitLabel}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}
      </div>
    </section>
  );
}
