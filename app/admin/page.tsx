export const runtime = 'edge';



import type { Metadata } from "next";
import { cookies } from "next/headers";
import site from "@/content/site.json";
import AdminAppointments from "@/components/AdminAppointments";
import AdminLoginForm from "@/components/AdminLoginForm";
import AdminLogoutButton from "@/components/AdminLogoutButton";
import { ADMIN_SESSION_COOKIE, isValidAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${site.pages.admin.title} | ${site.brand.name}`,
  description: site.pages.admin.description,
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  const sessionCookie = cookies().get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = isValidAdminSession(sessionCookie);

  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 pb-4 pt-14 md:px-8 md:pt-20">
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl">{site.pages.admin.title}</h1>
        <p className="mt-4 max-w-3xl text-muted">{site.pages.admin.description}</p>
      </section>
      {isAuthenticated ? (
        <>
          <section className="mx-auto flex w-full max-w-6xl justify-end px-4 md:px-8">
            <AdminLogoutButton />
          </section>
          <AdminAppointments />
        </>
      ) : (
        <AdminLoginForm />
      )}
    </>
  );
}
