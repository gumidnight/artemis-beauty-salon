import Image from "next/image";
import Link from "next/link";
import site from "@/content/site.json";

export default function AboutSection() {
  return (
    <section className="reveal-on-scroll bg-surface">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:px-8 md:py-20">
        <div className="relative h-[30rem] overflow-hidden rounded-3xl border border-border md:h-[38rem]">
          <Image
            src={site.about.image}
            alt={site.about.title}
            fill
            className="object-cover object-[center_18%]"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 text-accent/70">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current">
              <path d="M12 2l2.3 5.7L20 10l-5.7 2.3L12 18l-2.3-5.7L4 10l5.7-2.3L12 2z" />
            </svg>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-2.5 w-2.5 fill-current">
              <path d="M12 2l2.3 5.7L20 10l-5.7 2.3L12 18l-2.3-5.7L4 10l5.7-2.3L12 2z" />
            </svg>
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3 w-3 fill-current">
              <path d="M12 2l2.3 5.7L20 10l-5.7 2.3L12 18l-2.3-5.7L4 10l5.7-2.3L12 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            <Link href="/about" className="transition hover:text-accent hover:underline">
              {site.about.title}
            </Link>
          </h2>
          <div className="space-y-1">
            <p className="font-[family-name:var(--font-display)] text-2xl">{site.about.name}</p>
            <p className="text-sm font-semibold tracking-[0.12em] uppercase text-accent">{site.about.role}</p>
          </div>
          <p className="leading-relaxed text-muted">{site.about.description}</p>
        </div>
      </div>
    </section>
  );
}
