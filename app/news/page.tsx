import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import CTASection from "@/components/CTASection";
import { pageMetadata } from "@/lib/seo";
import { news } from "@/lib/data/news";

export const metadata: Metadata = pageMetadata({
  title: "News & Media",
  description:
    "Company news, project updates, industry insights, and press releases from ACE Contracting — UAE EPC contractor.",
  path: "/news",
});

const categoryColors: Record<string, string> = {
  "Company News": "bg-navy-900 text-white",
  "Project Updates": "bg-accent-500 text-white",
  "Industry Insights": "bg-steel-600 text-white",
  "Press Releases": "bg-navy-600 text-white",
};

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function NewsPage() {
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date));
  const [lead, ...rest] = sorted;

  return (
    <>
      <PageHero
        eyebrow="News & Media"
        title="The Latest From ACE Contracting"
        intro="Project milestones, company announcements, and our perspective on the UAE's energy and industrial construction market."
      />

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Lead story */}
          <Reveal>
            <Link
              href={`/news/${lead.slug}`}
              className="group grid overflow-hidden rounded-xl border border-steel-200 lg:grid-cols-2"
            >
              <div
                className={`relative min-h-64 bg-gradient-to-br ${lead.gradient}`}
                aria-hidden
              >
                <div className="bg-grid absolute inset-0" />
              </div>
              <div className="flex flex-col justify-center p-8 lg:p-12">
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${categoryColors[lead.category]}`}
                  >
                    {lead.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-steel-500">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                    {formatDate(lead.date)}
                  </span>
                </div>
                <h2 className="mt-4 text-2xl font-extrabold leading-snug text-navy-900 transition-colors group-hover:text-accent-600 sm:text-3xl">
                  {lead.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-steel-600">
                  {lead.excerpt}
                </p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-600">
                  Read Story
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </div>
            </Link>
          </Reveal>

          {/* Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 90}>
                <Link
                  href={`/news/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-steel-200 bg-white transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`relative h-40 bg-gradient-to-br ${post.gradient}`}
                    aria-hidden
                  >
                    <div className="bg-grid absolute inset-0" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${categoryColors[post.category]}`}
                      >
                        {post.category}
                      </span>
                      <span className="text-xs text-steel-500">
                        {formatDate(post.date)}
                      </span>
                    </div>
                    <h3 className="mt-3 flex-1 text-lg font-bold leading-snug text-navy-900 transition-colors group-hover:text-accent-600">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-steel-600">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
