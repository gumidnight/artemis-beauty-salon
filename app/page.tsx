import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import InstagramSection from "@/components/InstagramSection";

export const metadata: Metadata = {
  title: "Beauty Salon Artemis | Nail Salon & Spa in Ypsonas Limassol",
  description:
    "Beauty Salon Artemis offers professional nail services, spa treatments, face treatments, and beauty services in Ypsonas Limassol. Book your appointment today."
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
