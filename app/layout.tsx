import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "@/app/globals.css";
import site from "@/content/site.json";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollObserver from "@/components/ScrollObserver";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: site.seo.title,
  description: site.seo.description,
  keywords: site.seo.keywords,
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    images: [{ url: site.seo.openGraphImage }],
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${playfair.variable} font-[family-name:var(--font-sans)]`}>
        <ScrollObserver />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
