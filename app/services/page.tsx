import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ServiceIcon from "@/components/ServiceIcon";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { services } from "@/lib/data/services";
import { company } from "@/lib/data/company";

export const metadata: Metadata = pageMetadata({
  title: "Services — Engineering, Procurement, Construction & Maintenance",
  description:
    "Full-scope EPC services in the UAE: design engineering, procurement, mechanical & civil construction, pipeline installation, structural steel, and plant maintenance.",
  path: "/services",
});

const servicesSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: services.map((s, i) => ({
    "@type": "Service",
    position: i + 1,
    name: s.title,
    description: s.short,
    provider: { "@type": "Organization", name: company.legalName },
    areaServed: "United Arab Emirates",
    url: `${company.url}/services#${s.slug}`,
  })),
};

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={servicesSchema} />
      <PageHero
        eyebrow="Our Services"
        title="Full-Scope EPC, Self-Performed"
        intro="Engineering, procurement, construction, and maintenance — delivered by dedicated in-house divisions with single-point accountability."
      />

      {/* Quick anchor navigation */}
      <nav
        aria-label="Services on this page"
        className="sticky top-18 z-30 border-b border-steel-200 bg-white/95 backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {services.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              className="whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium text-steel-600 transition-colors hover:bg-steel-100 hover:text-navy-900"
            >
              {s.title}
            </a>
          ))}
        </div>
      </nav>

      <div className="bg-white">
        {services.map((service, i) => (
          <section
            key={service.slug}
            id={service.slug}
            className={`scroll-mt-32 py-20 ${i % 2 === 1 ? "bg-steel-50" : "bg-white"}`}
          >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid gap-12 lg:grid-cols-5">
                <Reveal className="lg:col-span-3">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-navy-900 text-accent-400">
                    <ServiceIcon name={service.icon} />
                  </span>
                  <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-navy-900">
                    {service.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-steel-600">
                    {service.overview}
                  </p>

                  <h3 className="mt-8 text-sm font-bold uppercase tracking-wider text-navy-900">
                    Key Capabilities
                  </h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {service.capabilities.map((cap) => (
                      <li key={cap} className="flex items-start gap-2.5 text-sm text-steel-700">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden />
                        {cap}
                      </li>
                    ))}
                  </ul>
                </Reveal>

                <Reveal delay={120} className="lg:col-span-2">
                  <div className="rounded-xl border border-steel-200 bg-white p-7 shadow-sm">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900">
                      Industries Served
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {service.industries.map((ind) => (
                        <span
                          key={ind}
                          className="rounded-full bg-navy-900 px-3.5 py-1.5 text-xs font-semibold text-white"
                        >
                          {ind}
                        </span>
                      ))}
                    </div>

                    <h3 className="mt-7 text-sm font-bold uppercase tracking-wider text-navy-900">
                      Why It Matters
                    </h3>
                    <ul className="mt-3 space-y-3">
                      {service.benefits.map((b) => (
                        <li
                          key={b}
                          className="rounded-lg bg-steel-50 p-4 text-sm leading-relaxed text-steel-700"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>

                    <Link
                      href="/contact"
                      className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded bg-accent-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
                    >
                      Discuss Your Project
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        ))}
      </div>

      <CTASection />
    </>
  );
}
