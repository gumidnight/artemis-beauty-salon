import Link from "next/link";
import site from "@/content/site.json";

export default function Footer() {
  return (
    <footer className="reveal-on-scroll border-t border-border bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-8">
        <div className="space-y-2">
          <p className="font-[family-name:var(--font-display)] text-2xl">{site.brand.name}</p>
          <p className="text-sm text-muted">{site.brand.tagline}</p>
        </div>

        <div className="space-y-2 text-sm text-muted">
          <p>{site.contact.address}</p>
          <p>{site.contact.phone}</p>
          <p>{site.contact.email}</p>
          <p>{site.contact.hours}</p>
          <Link
            href={site.mapSection.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition hover:border-accent hover:text-accent"
          >
            {site.mapSection.ctaLabel}
          </Link>
        </div>

        <div className="space-y-3 text-sm">
          <Link className="flex items-center gap-2 text-muted transition hover:text-accent" href={site.social.instagram.href}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5Zm9.5 2a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
            </svg>
            {site.social.instagram.label}
          </Link>
          <Link className="flex items-center gap-2 text-muted transition hover:text-accent" href={site.social.facebook.href}>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
              <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.5-1.5h1.7V4.9c-.8-.1-1.6-.2-2.4-.2-2.4 0-4 1.5-4 4.2V11H8v3h2.3v8h3.2Z" />
            </svg>
            {site.social.facebook.label}
          </Link>
        </div>
      </div>

      <div className="border-t border-border/70 px-4 py-4 text-center text-xs text-muted md:px-8">
        <p>
          {new Date().getFullYear()} {site.brand.name} {site.footer.rights}
        </p>
      </div>
    </footer>
  );
}
