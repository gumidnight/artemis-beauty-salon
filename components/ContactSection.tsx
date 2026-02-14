import Link from "next/link";
import site from "@/content/site.json";
import CompactSubscribe from "@/components/CompactSubscribe";

export default function ContactSection() {
  return (
    <section className="reveal-on-scroll mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-20">
      <div className="rounded-3xl border border-border bg-surface p-8 md:p-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold tracking-tight">
              <Link href="/contact" className="transition hover:text-accent hover:underline">
                {site.contactSection.title}
              </Link>
            </h2>
            <p className="text-muted">{site.contactSection.subtitle}</p>
            <CompactSubscribe />
          </div>

          <div className="space-y-2 text-sm">
            <p>{site.contact.address}</p>
            <p>{site.contact.phone}</p>
            <p>{site.contact.email}</p>
            <p>{site.contact.hours}</p>
            <Link className="inline-flex pt-3 font-semibold text-accent hover:underline" href="/contact">
              {site.hero.primaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
