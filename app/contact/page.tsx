import type { Metadata } from "next";
import site from "@/content/site.json";
import ContactSection from "@/components/ContactSection";
import AppointmentSection from "@/components/AppointmentSection";

export const metadata: Metadata = {
  title: `${site.pages.contact.title} | ${site.brand.name}`,
  description: site.pages.contact.description
};

export default function ContactPage() {
  return (
    <>
      <AppointmentSection />
      <ContactSection />
    </>
  );
}
