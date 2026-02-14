import type { Metadata } from "next";
import Image from "next/image";
import site from "@/content/site.json";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: `${site.pages.services.title} | ${site.brand.name}`,
  description: site.pages.services.description
};

export default function ServicesPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 pb-4 pt-14 md:px-8 md:pt-20">
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl">{site.pages.services.title}</h1>
        <p className="mt-4 max-w-3xl text-muted">{site.pages.services.description}</p>
      </section>

      <section className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 md:px-8 md:py-12">
        {site.services.map((service) => (
          <article key={service.title} className="rounded-3xl border border-border bg-white p-5 shadow-soft md:p-8">
            <div className="overflow-hidden rounded-2xl border border-border bg-surface p-3 md:p-4">
              <Image
                src={service.image}
                alt={service.title}
                width={1600}
                height={1200}
                className="h-auto w-full object-contain"
                sizes="100vw"
              />
            </div>
            <div className="mt-5 space-y-2">
              <h2 className="text-2xl font-semibold">{service.title}</h2>
              <p className="text-muted">{service.description}</p>
            </div>
          </article>
        ))}
      </section>

      <ContactSection />
    </>
  );
}
