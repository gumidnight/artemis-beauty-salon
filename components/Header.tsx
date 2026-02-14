"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import site from "@/content/site.json";
import Logo from "@/components/Logo";

export default function Header() {
  const pathname = usePathname();
  const [animatingHref, setAnimatingHref] = useState<string | null>(null);

  useEffect(() => {
    if (!animatingHref) {
      return;
    }

    const timeout = window.setTimeout(() => setAnimatingHref(null), 700);
    return () => window.clearTimeout(timeout);
  }, [animatingHref]);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === href;
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/98 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-8 md:py-5">
        <Logo />
        <nav aria-label={site.navigation.ariaLabel}>
          <ul className="flex items-center gap-2 text-sm md:gap-9 md:text-lg">
            {site.navigation.menu.map((item) => (
              <li key={item.href}>
                <Link
                  className="relative inline-flex px-1.5 py-1 font-semibold transition hover:text-accent md:px-3 md:py-1.5"
                  href={item.href}
                  onClick={() => setAnimatingHref(item.href)}
                >
                  <span>{item.name}</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 120 44"
                    preserveAspectRatio="none"
                    className={`nav-scribble pointer-events-none absolute -inset-1 md:-inset-2 h-[calc(100%+0.5rem)] w-[calc(100%+0.5rem)] md:h-[calc(100%+1rem)] md:w-[calc(100%+1rem)] ${
                      animatingHref === item.href ? "animate-scribble" : ""
                    } ${isActive(item.href) ? "active-scribble" : ""}`}
                  >
                    <path d="M9 24c0-10 16-18 50-18 38 0 56 9 56 20 0 10-20 17-56 17C23 43 7 34 9 24Z" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
