import type { Metadata, Viewport } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "@/app/globals.css";
import site from "@/content/site.json";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollObserver from "@/components/ScrollObserver";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://artemisbeautysalon.com";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  name: "Beauty Salon Artemis",
  url: "https://artemisbeautysalon.com",
  telephone: "+35799309380",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Rizokarpasou 23A",
    addressLocality: "Ypsonas",
    addressRegion: "Limassol",
    addressCountry: "CY"
  },
  areaServed: "Limassol",
  priceRange: "$$"
};

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Beauty Salon Artemis | Nail Salon & Spa in Ypsonas Limassol",
  description:
    "Beauty Salon Artemis offers professional nail services, spa treatments, face treatments, and beauty services in Ypsonas Limassol. Book your appointment today.",
  keywords: site.seo.keywords,
  authors: [{ name: "Beauty Salon Artemis" }],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: "/"
  },
  icons: {
    icon: [
      { url: "/logo/logo.png", type: "image/png" },
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [{ url: "/logo/logo.png" }, { url: "/apple-touch-icon.png" }]
  },
  openGraph: {
    title: "Beauty Salon Artemis | Nail Salon & Spa in Ypsonas Limassol",
    description:
      "Beauty Salon Artemis offers professional nail services, spa treatments, face treatments, and beauty services in Ypsonas Limassol. Book your appointment today.",
    url: "https://artemisbeautysalon.com",
    images: [{ url: site.seo.openGraphImage }],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Beauty Salon Artemis | Nail Salon & Spa in Ypsonas Limassol",
    description:
      "Beauty Salon Artemis offers professional nail services, spa treatments, face treatments, and beauty services in Ypsonas Limassol. Book your appointment today.",
    images: [site.seo.openGraphImage]
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
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
