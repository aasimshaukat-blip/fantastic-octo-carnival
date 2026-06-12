import type { Metadata } from "next";
import { TrendingUp, GraduationCap, Gift, ShieldCheck, MapPin, Briefcase, Clock } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import ApplicationForm from "@/components/ApplicationForm";
import { pageMetadata } from "@/lib/seo";
import { jobs } from "@/lib/data/jobs";

export const metadata: Metadata = pageMetadata({
  title: "Careers — Build Your Future With ACE",
  description:
    "Join ACE Contracting's growing EPC team in the UAE. Open positions in project management, HSE, QA/QC, MEP engineering, planning, and procurement.",
  path: "/careers",
});

const whyWork = [
  {
    icon: TrendingUp,
    title: "Career Growth",
    text: "A fast-growing contractor with an expanding project pipeline — meaning real progression into senior site and corporate roles.",
  },
  {
    icon: GraduationCap,
    title: "Professional Development",
    text: "Sponsored certifications (PMP, NEBOSH, ISO lead auditor) and 40+ hours of structured training per employee each year.",
  },
  {
    icon: Gift,
    title: "Competitive Benefits",
    text: "Market-leading packages with on-time payroll through WPS, full medical coverage, and annual flight allowances.",
  },
  {
    icon: ShieldCheck,
    title: "Safety Culture",
    text: "Work for a zero-fatality contractor where every person holds stop-work authority and welfare is independently audited.",
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build the UAE's Energy Future With Us"
        intro="Join a team that has delivered 18 million safe man-hours across the region's most demanding EPC programmes."
      />

      {/* Why work with ACE */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Why Work With ACE"
            title="More Than a Job Site"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyWork.map((w, i) => (
              <Reveal key={w.title} delay={(i % 4) * 90}>
                <div className="h-full rounded-xl border border-steel-200 bg-steel-50 p-7">
                  <w.icon className="h-8 w-8 text-accent-500" aria-hidden />
                  <h3 className="mt-4 text-base font-bold text-navy-900">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-steel-600">{w.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Open positions */}
      <section className="bg-steel-50 py-24" id="open-positions">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Open Positions"
            title="Current Opportunities"
            intro="We hire directly — no contractor-of-contractor arrangements, no recruitment fees charged to any candidate, ever."
          />
          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            {jobs.map((job, i) => (
              <Reveal key={job.slug} delay={(i % 2) * 90}>
                <article className="h-full rounded-xl border border-steel-200 bg-white p-7">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-navy-900">{job.title}</h3>
                      <p className="mt-1 text-sm font-semibold text-accent-600">
                        {job.department}
                      </p>
                    </div>
                    <span className="rounded-full bg-navy-900 px-3 py-1 text-xs font-bold text-white">
                      {job.type}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-steel-500">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" aria-hidden />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-3.5 w-3.5" aria-hidden />
                      {job.experience}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      Immediate start
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-steel-600">
                    {job.summary}
                  </p>
                  <ul className="mt-4 list-inside list-disc space-y-1.5 text-sm text-steel-600">
                    {job.responsibilities.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                  <a
                    href="#apply"
                    className="mt-6 inline-block rounded bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
                  >
                    Apply Now
                  </a>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="bg-white py-24" id="apply">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Apply Online"
            title="Submit Your Application"
            intro="Upload your CV and our HR team will review your profile against current and upcoming requirements."
          />
          <Reveal className="mt-12">
            <ApplicationForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
