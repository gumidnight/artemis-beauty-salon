import type { Metadata } from "next";
import site from "@/content/site.json";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

export const metadata: Metadata = {
  title: `${site.pages.about.title} | ${site.brand.name}`,
  description: site.pages.about.description
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto w-full max-w-6xl px-4 pb-4 pt-14 md:px-8 md:pt-20">
        <h1 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl">{site.pages.about.title}</h1>
        <p className="mt-4 max-w-3xl text-muted">{site.pages.about.description}</p>
      </section>
      <AboutSection />
      <ContactSection />
    </>
  );
}
