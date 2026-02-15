import Image from "next/image";
import Link from "next/link";

type Service = {
  title: string;
  description: string;
  image: string;
};

type ServiceCardProps = {
  service: Service;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-white shadow-soft">
      <div className="relative h-60 w-full overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          loading="lazy"
          className="object-cover object-[65%_center] transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="space-y-3 p-6">
        <h3 className="text-xl font-semibold">
          <Link href="/services" className="transition hover:text-accent hover:underline">
            {service.title}
          </Link>
        </h3>
        <p className="text-sm leading-relaxed text-muted">{service.description}</p>
      </div>
    </article>
  );
}
