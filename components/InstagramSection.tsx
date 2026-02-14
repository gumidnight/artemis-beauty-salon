import Link from "next/link";
import site from "@/content/site.json";

export default function InstagramSection() {
  return (
    <section className="reveal-on-scroll mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-20">
      <div className="rounded-3xl border border-border bg-white p-8 shadow-soft md:p-12">
        <div className="mb-5 space-y-2">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">{site.instagram.title}</p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">{site.pages.home.instagramPlaceholderTitle}</h2>
          <p className="text-muted">{site.pages.home.instagramPlaceholderDescription}</p>
        </div>

        {site.instagram.embedUrl ? (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <iframe
              src={site.instagram.embedUrl}
              title={site.instagram.embedTitle}
              className="h-[520px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            />
          </div>
        ) : (
          <p className="text-sm text-muted">{site.instagram.embedFallbackText}</p>
        )}

        <Link
          href={site.instagram.ctaHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex pt-4 text-sm font-semibold text-accent hover:underline"
        >
          {site.instagram.ctaLabel}
        </Link>
      </div>
    </section>
  );
}
