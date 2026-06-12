import type { Metadata } from "next";
import {
  ShieldCheck,
  GraduationCap,
  Leaf,
  ClipboardCheck,
  HeartPulse,
  OctagonAlert,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import StatCounter from "@/components/StatCounter";
import CTASection from "@/components/CTASection";
import { pageMetadata } from "@/lib/seo";
import { company } from "@/lib/data/company";

export const metadata: Metadata = pageMetadata({
  title: "Health, Safety & Environment",
  description:
    "ACE Contracting's HSE record: zero fatalities across 18M+ man-hours, ADNOC 100% HSE ratings, ISO 45001 & ISO 14001 certified systems, and 40+ training hours per worker annually.",
  path: "/hse",
});

const headlineStats = [
  { value: 0, suffix: "", label: "Fatalities Since 2016" },
  { value: 18, suffix: "M+", label: "Safe Man-Hours Worked" },
  { value: 0.12, suffix: "", label: "LTIR per 200k Hours", decimals: 2 },
  { value: 100, suffix: "%", label: "Toolbox Talk Coverage" },
  { value: 40, suffix: "+", label: "Training Hours / Worker / Year" },
  { value: 95, suffix: "%+", label: "Safety Audit Closure SLA" },
];

/** Year-by-year LTIR trend from the company's verified safety record. */
const ltirTrend = [
  { year: "2021", manHours: "420k", ltir: 0.48 },
  { year: "2022", manHours: "640k", ltir: 0.31 },
  { year: "2023", manHours: "820k", ltir: 0.0 },
  { year: "2024", manHours: "1.02M", ltir: 0.2 },
  { year: "2025", manHours: "1.10M", ltir: 0.0 },
  { year: "2026", manHours: "250k YTD", ltir: 0.0 },
];

const ADNOC_LTIR_TARGET = 0.2;
const CHART_MAX = 0.6;

const anchors = [
  "Dedicated HSE ring-fenced budget — 3% of contract value, never reallocated",
  "Senior Project Manager personally accountable for HSE outcomes",
  "Independent HSE reporting line — HSE reports outside the construction chain",
  "Stop-work authority enforced, with zero retaliation for stopping work",
  "Leading-indicator focus — proactive near-miss and observation reporting",
  "Worker engagement — every worker empowered as a safety observer",
];

const trainingProgrammes = [
  {
    title: "HSE Induction & Refreshers",
    text: "Mandatory site induction for every worker plus periodic refreshers, delivered in workers' native languages at our Musaffah training centre.",
  },
  {
    title: "Certified Competency Training",
    text: "NEBOSH, IOSH, OSHA 30-hour, H2S awareness, BOSIET, and first-aid instructor programmes for HSE and supervisory staff.",
  },
  {
    title: "Toolbox Talks & Task Briefings",
    text: "100% daily toolbox talk coverage with task-specific risk briefings before every permit-controlled activity.",
  },
  {
    title: "Emergency Response Drills",
    text: "Regular fire, medical, and evacuation drills, including scenario exercises for remote-site and CICPA-controlled environments.",
  },
];

const qaProcedures = [
  "Project Quality Plans issued at project start, aligned with client specifications",
  "Inspection & Test Plans per activity with defined hold, witness, and surveillance points",
  "Material submittals pre-approved with test certificates and manufacturer documentation",
  "First-pour, first-cabin, first-weld workmanship samples approved before production",
  "Independent QA audits by teams separate from production",
  "Formal NCR register with root-cause analysis and preventive action",
];

const environmental = [
  {
    title: "ISO 14001 Environmental Management",
    text: "Certified environmental management system governing waste, emissions, and resource use on every project.",
  },
  {
    title: "Water Stewardship",
    text: "MBR treatment technology producing effluent suitable for reuse, with grey-water recycling covering 100% of landscape irrigation on flagship sites.",
  },
  {
    title: "Energy Efficiency",
    text: "Solar-assisted water heating, LED external lighting, smart metering, and hybrid power strategies that cut operational energy demand.",
  },
  {
    title: "Responsible Waste Management",
    text: "Segregation at source and licensed disposal through approved waste contractors, fully compliant with TADWEER requirements.",
  },
];

export default function HsePage() {
  return (
    <>
      <PageHero
        eyebrow="Health, Safety & Environment"
        title="Zero Harm Is Not a Target. It's the Record."
        intro="Zero fatalities across more than 18 million man-hours since 2016 — built on structural commitments, independent verification, and a culture where every worker has stop-work authority."
      />

      {/* Headline dashboard */}
      <section className="bg-navy-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {headlineStats.map((s, i) => (
              <Reveal key={s.label} delay={i * 80} className="text-center">
                <dd className="text-3xl font-extrabold text-accent-400 sm:text-4xl">
                  <StatCounter
                    value={s.value}
                    suffix={s.suffix}
                    decimals={s.decimals ?? 0}
                  />
                </dd>
                <dt className="mt-2 text-xs font-medium uppercase tracking-wider text-steel-400">
                  {s.label}
                </dt>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* HSE policy */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2">
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500">
                HSE Policy
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-navy-900">
                Safety as a Structural Commitment
              </h2>
              <p className="mt-5 text-base leading-relaxed text-steel-600">
                ACE Contracting&apos;s safety performance is not the product of
                luck — it is engineered through structural commitments embedded
                in how every project is budgeted, organised, and led. Our HSE
                management system is certified to ISO 45001:2018 and aligned
                with ADNOC HSEMS requirements, with performance independently
                verified through quarterly ADNOC HSE inspections and annual
                third-party audits.
              </p>
              <ul className="mt-7 space-y-3.5">
                {anchors.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-sm leading-relaxed text-steel-700">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" aria-hidden />
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* LTIR trend chart */}
            <Reveal delay={120}>
              <div className="rounded-xl border border-steel-200 bg-steel-50 p-7">
                <h3 className="text-lg font-bold text-navy-900">
                  Lost-Time Injury Rate — Year by Year
                </h3>
                <p className="mt-1 text-sm text-steel-500">
                  LTIR per 200,000 man-hours vs ADNOC target (&lt;{" "}
                  {ADNOC_LTIR_TARGET})
                </p>
                <div className="relative mt-8">
                  {/* target line */}
                  <div
                    className="absolute inset-x-0 border-t-2 border-dashed border-accent-500"
                    style={{ bottom: `${(ADNOC_LTIR_TARGET / CHART_MAX) * 160 + 40}px` }}
                    aria-hidden
                  >
                    <span className="absolute -top-5 right-0 text-[11px] font-semibold text-accent-600">
                      ADNOC target {ADNOC_LTIR_TARGET}
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    {ltirTrend.map((d) => (
                      <div key={d.year} className="flex flex-1 flex-col items-center">
                        <span className="mb-1.5 text-xs font-bold text-navy-900">
                          {d.ltir.toFixed(2)}
                        </span>
                        <div
                          className={`w-full max-w-12 rounded-t ${
                            d.ltir <= ADNOC_LTIR_TARGET ? "bg-navy-800" : "bg-steel-400"
                          }`}
                          style={{ height: `${Math.max((d.ltir / CHART_MAX) * 160, 4)}px` }}
                          role="img"
                          aria-label={`${d.year}: LTIR ${d.ltir.toFixed(2)} over ${d.manHours} man-hours`}
                        />
                        <span className="mt-2 text-xs font-semibold text-steel-600">
                          {d.year}
                        </span>
                        <span className="text-[10px] text-steel-400">{d.manHours}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="mt-6 rounded-lg bg-white p-4 text-xs leading-relaxed text-steel-500">
                  Independently verified through quarterly ADNOC HSE inspection
                  reports, annual ISO 45001 surveillance audits, and third-party
                  welfare audits (average score above 92/100).
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Training */}
      <section className="bg-steel-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Training Programs"
            title="Competence Before Mobilisation"
            intro="Over 40 hours of training per worker per year, delivered through our ADNOC-aligned training centre in Musaffah."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trainingProgrammes.map((t, i) => (
              <Reveal key={t.title} delay={(i % 4) * 90}>
                <div className="h-full rounded-xl border border-steel-200 bg-white p-7">
                  <GraduationCap className="h-8 w-8 text-accent-500" aria-hidden />
                  <h3 className="mt-4 text-base font-bold text-navy-900">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-600">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications + QA */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2">
            <Reveal>
              <h2 className="flex items-center gap-3 text-2xl font-extrabold text-navy-900">
                <HeartPulse className="h-7 w-7 text-accent-500" aria-hidden />
                Certifications
              </h2>
              <ul className="mt-7 space-y-4">
                {company.certifications.map((c) => (
                  <li key={c.name} className="rounded-lg border border-steel-200 bg-steel-50 p-5">
                    <p className="font-bold text-navy-900">{c.name}</p>
                    <p className="mt-1 text-sm text-steel-600">{c.scope}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="flex items-center gap-3 text-2xl font-extrabold text-navy-900">
                <ClipboardCheck className="h-7 w-7 text-accent-500" aria-hidden />
                Quality Assurance Procedures
              </h2>
              <ul className="mt-7 space-y-3.5">
                {qaProcedures.map((q) => (
                  <li key={q} className="flex items-start gap-3 rounded-lg border border-steel-200 p-4 text-sm leading-relaxed text-steel-700">
                    <OctagonAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent-500" aria-hidden />
                    {q}
                  </li>
                ))}
              </ul>
              <div className="mt-7 grid grid-cols-3 gap-4">
                {[
                  { v: "92%+", l: "First-time inspection pass" },
                  { v: "<0.8%", l: "Rework rate" },
                  { v: "<5 days", l: "NCR closure SLA" },
                ].map((s) => (
                  <div key={s.l} className="rounded-lg bg-navy-900 p-4 text-center">
                    <p className="text-xl font-extrabold text-accent-400">{s.v}</p>
                    <p className="mt-1 text-[11px] font-medium text-steel-300">{s.l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Environment */}
      <section className="relative overflow-hidden bg-navy-900 py-24">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Environmental Responsibility"
            title="Building Without Compromise"
            intro="ISO 14001-certified environmental management woven into design, construction, and operations."
            dark
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {environmental.map((e, i) => (
              <Reveal key={e.title} delay={(i % 4) * 90}>
                <div className="h-full rounded-xl border border-white/10 bg-white/5 p-7">
                  <Leaf className="h-8 w-8 text-accent-400" aria-hidden />
                  <h3 className="mt-4 text-base font-bold text-white">{e.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-300">{e.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
