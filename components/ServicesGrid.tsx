import site from "@/content/site.json";
import ServiceCard from "@/components/ServiceCard";

export default function ServicesGrid() {
  return (
    <section className="reveal-on-scroll mx-auto w-full max-w-6xl px-4 py-16 md:px-8 md:py-20">
      <div className="mb-10 space-y-3">
        <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{site.servicesSection.title}</h2>
        <p className="text-muted">{site.servicesSection.subtitle}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {site.services.map((service) => (
          <ServiceCard key={service.title} service={service} />
        ))}
      </div>
    </section>
  );
}
