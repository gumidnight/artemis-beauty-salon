import Image from "next/image";
import Link from "next/link";
import site from "@/content/site.json";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 md:gap-3" aria-label={site.brand.name}>
      <Image
        src={site.brand.logo}
        alt={site.brand.name}
        width={84}
        height={84}
        className="h-12 w-12 object-contain md:h-[5.25rem] md:w-[5.25rem]"
        priority
      />
      <div className="hidden md:block">
        <p className="text-base font-semibold tracking-[0.16em] uppercase text-foreground">{site.brand.name}</p>
        <p className="text-sm text-muted">{site.brand.tagline}</p>
      </div>
    </Link>
  );
}
