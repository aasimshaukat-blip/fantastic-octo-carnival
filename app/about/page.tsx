import type { Metadata } from "next";
import { Eye, Target, Award, Building2 } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import CTASection from "@/components/CTASection";
import { pageMetadata } from "@/lib/seo";
import { company } from "@/lib/data/company";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description:
    "ACE Contracting is a UAE-based EPC contractor founded in 2016, part of the Cheriyan Holdings group, delivering oil & gas, industrial, energy, and infrastructure projects across the Emirates.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="A Decade of Engineering Excellence in the UAE"
        intro="Founded in 2016, ACE Contracting has grown into one of the Al Dhafra region's most trusted EPC contractors — the construction flagship of the Cheriyan Holdings group."
      />

      {/* Company overview */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500">
                Company Overview
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
                Accurate. Cost-Effective. Excellent.
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-steel-600">
                <p>
                  ACE Contracting was founded in {company.founded} with a simple
                  ethos — our name stands for{" "}
                  <strong className="text-navy-900">
                    Accurate, Cost-effective, and Excellent
                  </strong>{" "}
                  execution of industrial construction. Today we deliver
                  engineering, procurement, construction, and maintenance
                  solutions across the UAE&apos;s oil &amp; gas, energy,
                  industrial, and infrastructure sectors.
                </p>
                <p>
                  As the EPC flagship of the {company.group} group, ACE operates
                  through dedicated divisions — EPC, Civil, Electromechanical,
                  Steel Structures, and Fit-Out — supported by group affiliates
                  in manufacturing, facilities management, and logistics. This
                  vertical integration gives our clients a self-contained
                  delivery ecosystem that de-risks even the most complex
                  interfaces.
                </p>
                <p>
                  From our headquarters in Musaffah, Abu Dhabi, and our regional
                  base in Fujairah, we have delivered projects for ADNOC-tier
                  clients across the Habshan, Asab, Ruwais LNG, and Ghayathi
                  value chains — earning ADNOC 100% HSE ratings, ICV Gold tier
                  ranking, and a zero-fatality record across more than 18
                  million man-hours.
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { value: "2016", label: "Established in the UAE" },
                  { value: "795+", label: "Direct workforce" },
                  { value: "140+", label: "Vetted subcontractors" },
                  { value: "200+", label: "Owned plant & equipment units" },
                  { value: "AED 270M", label: "Annual turnover (2025)" },
                  { value: "60%+", label: "Revenue from repeat clients" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl border border-steel-200 bg-steel-50 p-6"
                  >
                    <p className="text-2xl font-extrabold text-navy-900">
                      {s.value}
                    </p>
                    <p className="mt-1 text-sm text-steel-600">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="relative overflow-hidden bg-navy-900 py-24">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-xl border border-white/10 bg-white/5 p-10">
                <Eye className="h-10 w-10 text-accent-400" aria-hidden />
                <h2 className="mt-5 text-2xl font-extrabold text-white">
                  Our Vision
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-steel-300">
                  To become the preferred EPC contractor in the Middle East,
                  delivering sustainable and innovative engineering solutions.
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="h-full rounded-xl border border-white/10 bg-white/5 p-10">
                <Target className="h-10 w-10 text-accent-400" aria-hidden />
                <h2 className="mt-5 text-2xl font-extrabold text-white">
                  Our Mission
                </h2>
                <p className="mt-4 text-lg leading-relaxed text-steel-300">
                  Deliver safe, quality-driven, and cost-effective EPC projects
                  that exceed client expectations.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Core values */}
      <section className="bg-steel-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Core Values"
            title="The Principles Behind Every Project"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {company.values.map((v, i) => (
              <Reveal key={v.title} delay={(i % 3) * 90}>
                <div className="h-full rounded-xl border border-steel-200 bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent-500/10 text-sm font-extrabold text-accent-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-navy-900">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-600">
                    {v.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Leadership"
            title="The Team Behind the Track Record"
            intro="A leadership group that has delivered together across multiple ADNOC-tier project cycles — bringing proven chemistry to every new programme."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {company.leadership.map((person, i) => (
              <Reveal key={person.name} delay={(i % 3) * 90}>
                <div className="h-full rounded-xl border border-steel-200 bg-steel-50 p-7">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-navy-900 text-xl font-extrabold text-accent-400">
                    {person.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-navy-900">
                    {person.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-accent-600">
                    {person.role}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-steel-600">
                    {person.bio}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & awards */}
      <section className="bg-steel-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2">
            <Reveal>
              <h2 className="flex items-center gap-3 text-2xl font-extrabold text-navy-900">
                <Building2 className="h-7 w-7 text-accent-500" aria-hidden />
                Certifications &amp; Registrations
              </h2>
              <ul className="mt-7 space-y-4">
                {company.certifications.map((c) => (
                  <li
                    key={c.name}
                    className="rounded-lg border border-steel-200 bg-white p-5"
                  >
                    <p className="font-bold text-navy-900">{c.name}</p>
                    <p className="mt-1 text-sm text-steel-600">{c.scope}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="flex items-center gap-3 text-2xl font-extrabold text-navy-900">
                <Award className="h-7 w-7 text-accent-500" aria-hidden />
                Recognition &amp; Awards
              </h2>
              <ul className="mt-7 space-y-4">
                {company.awards.map((a) => (
                  <li
                    key={a.title}
                    className="flex items-start gap-4 rounded-lg border border-steel-200 bg-white p-5"
                  >
                    <span className="rounded bg-navy-900 px-2.5 py-1 text-xs font-bold text-accent-400">
                      {a.year}
                    </span>
                    <div>
                      <p className="font-bold text-navy-900">{a.title}</p>
                      <p className="mt-0.5 text-sm text-steel-500">{a.by}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
