import Link from "next/link";
import site from "@/content/site.json";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(rgba(12, 12, 10, 0.5), rgba(12, 12, 10, 0.4)), url(${site.hero.backgroundImage})` }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[72vh] w-full max-w-6xl flex-col justify-center px-4 py-20 md:px-8">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl">{site.hero.title}</h1>
          <p className="text-lg leading-relaxed text-white/85 md:text-xl">{site.hero.subtitle}</p>
          <div className="flex flex-wrap gap-4">
            <Link
              href={site.hero.primaryCta.href}
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-stone-900 transition hover:bg-white/90"
            >
              {site.hero.primaryCta.label}
            </Link>
            <Link
              href={site.hero.secondaryCta.href}
              className="rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
            >
              {site.hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
