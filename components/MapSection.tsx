import Link from "next/link";
import site from "@/content/site.json";

export default function MapSection() {
  return (
    <section className="border-t border-border bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="space-y-1">
          <p className="font-[family-name:var(--font-display)] text-2xl">{site.mapSection.title}</p>
          <p className="text-sm text-muted">{site.mapSection.description}</p>
          <p className="text-sm text-muted">{site.contact.address}</p>
        </div>

        <Link
          href={site.mapSection.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit rounded-full border border-foreground px-5 py-2 text-sm font-semibold transition hover:bg-foreground hover:text-white"
        >
          {site.mapSection.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
