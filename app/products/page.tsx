import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import site from "@/content/site.json";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: `${site.pages.products.title} | ${site.brand.name}`,
  description: site.pages.products.description
};

export default function ProductsPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 pb-4 pt-14 md:px-8 md:pt-20">
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl">{site.pages.products.title}</h1>
        <p className="mt-4 max-w-3xl text-muted">{site.products.description}</p>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <div className="rounded-3xl border border-border bg-white p-5 shadow-soft md:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">{site.products.title}</h2>
            <Link
              href={site.products.affiliateUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
            >
              {site.products.shopCtaLabel}
            </Link>
          </div>

          <Link
            href={site.products.affiliateUrl}
            target="_blank"
            rel="noreferrer"
            className="group block overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <Image
              src={site.products.showcaseImage}
              alt={site.products.showcaseImageAlt}
              width={1600}
              height={900}
              loading="lazy"
              className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              sizes="100vw"
            />
          </Link>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">{site.products.showcaseCaption}</p>
            <Link href={site.products.shopUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-accent hover:underline">
              {site.products.shopCtaLabel}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-8 md:px-8 md:pb-12">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative h-16 w-48 overflow-hidden md:h-20 md:w-56">
            <Image src={site.products.partnerLogo} alt={site.products.partnerLogoAlt} fill loading="lazy" className="object-contain" sizes="224px" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold">{site.products.partnerTitle}</p>
            <p className="max-w-2xl text-sm text-muted">{site.products.partnerDescription}</p>
          </div>
        </div>
      </section>

      <ContactSection />
    </>
  );
}
