import type { Metadata } from "next";
import site from "@/content/site.json";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import InstagramSection from "@/components/InstagramSection";

export const metadata: Metadata = {
  title: site.seo.title,
  description: site.seo.description
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesGrid />
      <AboutSection />
      <InstagramSection />
      <ContactSection />
    </>
  );
}
