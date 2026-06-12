import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, Linkedin, Instagram, Facebook } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo";
import { company } from "@/lib/data/company";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    "Contact ACE Contracting — UAE EPC contractor. Head office in Musaffah Industrial Area, Abu Dhabi, with a regional office in Fujairah. Request a proposal or pre-qualification pack.",
  path: "/contact",
});

const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: `Contact ${company.name}`,
  url: `${company.url}/contact`,
  mainEntity: {
    "@type": "Organization",
    name: company.legalName,
    email: company.email,
    telephone: company.phone,
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={contactSchema} />
      <PageHero
        eyebrow="Contact Us"
        title="Let's Discuss Your Next Project"
        intro="Whether you need a turnkey EPC partner, a pre-qualification pack, or a rapid mobilisation quote — our team responds within one business day."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-5">
            {/* Form */}
            <Reveal className="lg:col-span-3">
              <h2 className="text-2xl font-extrabold text-navy-900">
                Send Us a Message
              </h2>
              <p className="mt-2 text-sm text-steel-600">
                Fields marked * are required.
              </p>
              <div className="mt-8">
                <ContactForm />
              </div>
            </Reveal>

            {/* Office info */}
            <Reveal delay={120} className="lg:col-span-2">
              <div className="space-y-6">
                {company.offices.map((office) => (
                  <div
                    key={office.name}
                    className="rounded-xl border border-steel-200 bg-steel-50 p-7"
                  >
                    <h3 className="text-lg font-bold text-navy-900">
                      {office.name}
                    </h3>
                    <ul className="mt-4 space-y-3 text-sm text-steel-700">
                      <li className="flex gap-3">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden />
                        {office.address}
                      </li>
                      <li className="flex gap-3">
                        <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden />
                        <a
                          href={`tel:${office.phone.replace(/\s/g, "")}`}
                          className="hover:text-accent-600"
                        >
                          {office.phone}
                        </a>
                      </li>
                    </ul>
                  </div>
                ))}

                <div className="rounded-xl border border-steel-200 bg-steel-50 p-7">
                  <h3 className="text-lg font-bold text-navy-900">
                    General Enquiries
                  </h3>
                  <ul className="mt-4 space-y-3 text-sm text-steel-700">
                    <li className="flex gap-3">
                      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden />
                      <a href={`mailto:${company.email}`} className="hover:text-accent-600">
                        {company.email}
                      </a>
                    </li>
                    <li className="flex gap-3">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden />
                      {company.workingHours}
                    </li>
                  </ul>
                  <div className="mt-5 flex gap-3">
                    <a
                      href={company.social.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                      className="rounded bg-navy-900 p-2.5 text-white transition-colors hover:bg-accent-500"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a
                      href={company.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Instagram"
                      className="rounded bg-navy-900 p-2.5 text-white transition-colors hover:bg-accent-500"
                    >
                      <Instagram className="h-4 w-4" />
                    </a>
                    <a
                      href={company.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Facebook"
                      className="rounded bg-navy-900 p-2.5 text-white transition-colors hover:bg-accent-500"
                    >
                      <Facebook className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-steel-50 pb-0">
        <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-2xl font-extrabold text-navy-900">Find Us</h2>
            <div className="mt-6 overflow-hidden rounded-xl border border-steel-200">
              <iframe
                title="ACE Contracting head office location — Musaffah Industrial Area, Abu Dhabi"
                src={`https://www.google.com/maps?q=${encodeURIComponent(company.offices[0].mapQuery)}&output=embed`}
                width="100%"
                height="420"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
