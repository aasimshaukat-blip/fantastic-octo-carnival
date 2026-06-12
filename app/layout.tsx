import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import JsonLd from "@/components/JsonLd";
import { company } from "@/lib/data/company";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: `${company.name} | EPC, Oil & Gas, Industrial & Infrastructure Contractor — UAE`,
    template: `%s | ${company.name}`,
  },
  description: company.description,
  keywords: [
    "EPC contractor UAE",
    "oil and gas construction Abu Dhabi",
    "industrial construction UAE",
    "pipeline construction GCC",
    "mechanical construction",
    "ADNOC approved contractor",
    "engineering procurement construction",
  ],
  openGraph: {
    title: company.tagline,
    description: company.description,
    url: company.url,
    siteName: company.name,
    locale: "en_AE",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: company.legalName,
  url: company.url,
  email: company.email,
  telephone: company.phone,
  foundingDate: String(company.founded),
  description: company.description,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Musaffah Industrial Area",
    addressLocality: "Abu Dhabi",
    addressCountry: "AE",
  },
  sameAs: [
    company.social.linkedin,
    company.social.instagram,
    company.social.facebook,
  ],
  knowsAbout: [
    "Engineering Procurement Construction",
    "Oil & Gas Construction",
    "Industrial Construction",
    "Pipeline Construction",
    "Infrastructure",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <JsonLd data={organizationSchema} />
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
