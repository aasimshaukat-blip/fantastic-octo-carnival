import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Building2,
  CalendarRange,
  CircleDollarSign,
  Users,
  CheckCircle2,
  Star,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import ProjectCard from "@/components/ProjectCard";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import { projects, getProject } from "@/lib/data/projects";
import { company } from "@/lib/data/company";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.scope,
    alternates: { canonical: `${company.url}/projects/${project.slug}` },
    openGraph: {
      title: `${project.name} | ${company.name}`,
      description: project.scope,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const related = projects
    .filter(
      (p) =>
        p.slug !== project.slug &&
        p.categories.some((c) => project.categories.includes(c))
    )
    .slice(0, 3);

  const facts = [
    { icon: Building2, label: "Client", value: project.client },
    ...(project.endClient
      ? [{ icon: Building2, label: "End Client", value: project.endClient }]
      : []),
    { icon: MapPin, label: "Location", value: project.location },
    { icon: CalendarRange, label: "Duration", value: project.duration },
    ...(project.value
      ? [{ icon: CircleDollarSign, label: "Contract Value", value: project.value }]
      : []),
    ...(project.capacity
      ? [{ icon: Users, label: "Capacity", value: project.capacity }]
      : []),
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Project",
          name: project.name,
          description: project.scope,
          location: { "@type": "Place", name: project.location },
          provider: { "@type": "Organization", name: company.legalName },
        }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-40">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`}
          role="img"
          aria-label={project.imageAlt}
        />
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy-950/90 to-navy-950/30"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-accent-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All Projects
          </Link>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full bg-accent-500 px-3 py-1 text-xs font-bold text-white">
              {project.status}
            </span>
            {project.categories.map((c) => (
              <span
                key={c}
                className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20"
              >
                {c}
              </span>
            ))}
          </div>
          <h1 className="mt-5 max-w-4xl text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            {project.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-steel-200">
            {project.location} · {project.year}
          </p>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Reveal>
                <h2 className="text-2xl font-extrabold text-navy-900">
                  Project Scope
                </h2>
                <p className="mt-4 text-base leading-relaxed text-steel-600">
                  {project.scope}
                </p>
                <ul className="mt-8 space-y-4">
                  {project.scopeDetails.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-steel-700">
                      <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent-500" aria-hidden />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              {project.highlights && (
                <Reveal className="mt-12">
                  <h2 className="text-2xl font-extrabold text-navy-900">
                    Highlights
                  </h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {project.highlights.map((h) => (
                      <div
                        key={h}
                        className="flex items-start gap-3 rounded-xl border border-steel-200 bg-steel-50 p-5"
                      >
                        <Star className="mt-0.5 h-5 w-5 shrink-0 text-accent-500" aria-hidden />
                        <p className="text-sm leading-relaxed text-steel-700">{h}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>
              )}
            </div>

            <Reveal delay={120}>
              <aside className="rounded-xl border border-steel-200 bg-navy-900 p-7">
                <h2 className="text-sm font-bold uppercase tracking-wider text-accent-400">
                  Project Facts
                </h2>
                <dl className="mt-5 space-y-5">
                  {facts.map((f) => (
                    <div key={f.label} className="flex items-start gap-3">
                      <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-400" aria-hidden />
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-wide text-steel-400">
                          {f.label}
                        </dt>
                        <dd className="mt-0.5 text-sm font-medium text-white">
                          {f.value}
                        </dd>
                      </div>
                    </div>
                  ))}
                </dl>
                <Link
                  href="/contact"
                  className="mt-8 block rounded bg-accent-500 px-5 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-accent-600"
                >
                  Discuss a Similar Project
                </Link>
              </aside>
            </Reveal>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-steel-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-2xl font-extrabold text-navy-900">
                Related Projects
              </h2>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTASection />
    </>
  );
}
