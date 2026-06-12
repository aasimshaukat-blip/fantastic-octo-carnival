import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  BadgeCheck,
  Clock,
  MapPin,
  Cpu,
  Quote,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import StatCounter from "@/components/StatCounter";
import ServiceIcon from "@/components/ServiceIcon";
import ProjectCard from "@/components/ProjectCard";
import ClientsCarousel from "@/components/ClientsCarousel";
import CTASection from "@/components/CTASection";
import { company } from "@/lib/data/company";
import { services } from "@/lib/data/services";
import { featuredProjects } from "@/lib/data/projects";
import { testimonials } from "@/lib/data/clients";

const whyChoose = [
  {
    icon: Users,
    title: "Experienced EPC Team",
    text: "Core leadership teams that have delivered ADNOC-tier programmes together for 5+ years — engineers, planners, and tradesmen directly employed.",
  },
  {
    icon: ShieldCheck,
    title: "Strong Safety Culture",
    text: "Zero fatalities across 18M+ man-hours since 2016, with twice-awarded ADNOC 100% HSE ratings and enforced stop-work authority.",
  },
  {
    icon: BadgeCheck,
    title: "Quality Assurance",
    text: "ISO 9001-certified systems delivering 92%+ first-time inspection pass rates and best-in-class snag records at handover.",
  },
  {
    icon: Clock,
    title: "On-Time Delivery",
    text: "Phased commissioning models and owned plant fleets that protect the programme — milestone after milestone, handover after handover.",
  },
  {
    icon: MapPin,
    title: "UAE Market Expertise",
    text: "A decade of delivery in Abu Dhabi and the Al Dhafra region, with established authority relationships and Grade A municipal classification.",
  },
  {
    icon: Cpu,
    title: "Modern Construction Technologies",
    text: "Modular prefabrication, MBR treatment plants, smart metering, and solar-assisted utilities — engineered into every project.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy-950">
        {/* Hero visual: layered gradients + blueprint grid as a stand-in for full-bleed industrial photography */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-800 to-navy-600"
          aria-hidden
        />
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div
          className="absolute -bottom-40 -right-40 h-[34rem] w-[34rem] rounded-full bg-accent-500/25 blur-3xl"
          aria-hidden
        />
        {/* Industrial skyline silhouette */}
        <svg
          className="absolute bottom-0 left-0 w-full text-navy-950"
          viewBox="0 0 1440 180"
          fill="currentColor"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path d="M0 180V120h60V80h20v40h40V60h30v60h50V90h40v30h30V40h12v-20h6v20h12v80h60V70h40v50h40V30h10V10h8v20h10v90h80V80h50v40h40V55h35v65h45V95h55v25h35V50h14V25h7v25h14v70h70V85h45v35h50V60h30v60h60V100h40v20h50V70h30v50h44V90h40v90H0Z" />
        </svg>

        <div className="relative mx-auto w-full max-w-7xl px-4 pb-28 pt-36 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-accent-400/40 bg-accent-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
              UAE-Based EPC Contractor · Since {company.founded}
            </p>
            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Delivering Excellence in{" "}
              <span className="text-accent-400">EPC Construction</span> &amp;
              Oil &amp; Gas Projects
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-steel-200 sm:text-xl">
              {company.description}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 rounded bg-accent-500 px-8 py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-600"
              >
                View Projects
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded border border-white/30 px-8 py-4 text-base font-semibold text-white transition-colors hover:border-accent-400 hover:text-accent-400"
              >
                Contact Us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ COMPANY HIGHLIGHTS ============ */}
      <section className="relative bg-navy-900 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-6">
            {company.stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80} className="text-center">
                <dd className="text-3xl font-extrabold text-white sm:text-4xl">
                  <StatCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    decimals={"decimals" in stat ? (stat.decimals as number) : 0}
                  />
                </dd>
                <dt className="mt-2 text-xs font-medium uppercase tracking-wider text-steel-400 sm:text-sm">
                  {stat.label}
                </dt>
              </Reveal>
            ))}
          </dl>
          <Reveal className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-steel-400">
            Zero fatalities · Zero lost-time injuries · ADNOC 100% HSE rating ·
            ISO 9001 / 14001 / 45001 certified
          </Reveal>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="bg-steel-50 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Our Services"
            title="Integrated EPC Capabilities, One Contractor"
            intro="From design engineering through procurement, construction, and lifetime maintenance — ACE Contracting self-performs the trades that matter."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, i) => (
              <Reveal key={service.slug} delay={(i % 4) * 90}>
                <Link
                  href={`/services#${service.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-steel-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-accent-300 hover:shadow-xl hover:shadow-navy-900/5"
                >
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-navy-900 text-accent-400 transition-colors group-hover:bg-accent-500 group-hover:text-white">
                    <ServiceIcon name={service.icon} />
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-navy-900">
                    {service.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-steel-600">
                    {service.short}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED PROJECTS ============ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Featured Projects"
            title="A Track Record Built on ADNOC-Tier Delivery"
            intro="From the Habshan gas complex to Ruwais LNG, our portfolio spans the UAE's most demanding energy and industrial programmes."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.slug} delay={(i % 4) * 90}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 rounded border-2 border-navy-900 px-7 py-3.5 text-base font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white"
            >
              View All Projects
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ============ WHY CHOOSE ACE ============ */}
      <section className="relative overflow-hidden bg-navy-900 py-24">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Choose ACE"
            title="Engineered for Trust"
            intro="The capabilities, culture, and regional footprint that make ACE Contracting the partner of choice for major clients across the UAE."
            dark
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChoose.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 90}>
                <div className="h-full rounded-xl border border-white/10 bg-white/5 p-7 backdrop-blur transition-colors hover:border-accent-400/40">
                  <item.icon className="h-8 w-8 text-accent-400" aria-hidden />
                  <h3 className="mt-4 text-lg font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-300">
                    {item.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CLIENTS ============ */}
      <section className="bg-steel-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Trusted By"
            title="Clients & Project Partners"
            intro="Organisations we have delivered for across the UAE's energy, industrial, and infrastructure value chains."
          />
        </div>
        <div className="mt-12">
          <ClientsCarousel />
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Testimonials"
            title="What Our Clients Say"
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.author + i} delay={i * 90}>
                <figure className="flex h-full flex-col rounded-xl border border-steel-200 bg-steel-50 p-8">
                  <Quote className="h-8 w-8 text-accent-500" aria-hidden />
                  <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-steel-700">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 border-t border-steel-200 pt-4">
                    <p className="font-bold text-navy-900">{t.author}</p>
                    <p className="text-sm text-steel-500">{t.role}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
