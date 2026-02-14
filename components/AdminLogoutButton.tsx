"use client";

import { useRouter } from "next/navigation";
import site from "@/content/site.json";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      className="rounded-full border border-border px-4 py-2 text-sm font-semibold transition hover:border-accent"
    >
      {site.adminAuth.logoutLabel}
    </button>
  );
}
