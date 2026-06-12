import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/data/projects";

const statusStyles: Record<Project["status"], string> = {
  Completed: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
  "Under Construction": "bg-accent-500/15 text-accent-300 ring-accent-400/30",
  Operational: "bg-sky-500/15 text-sky-300 ring-sky-400/30",
  Awarded: "bg-violet-500/15 text-violet-300 ring-violet-400/30",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex min-h-[22rem] flex-col justify-end overflow-hidden rounded-xl"
    >
      {/* Project visual — gradient placeholder standing in for site photography */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${project.gradient} transition-transform duration-500 group-hover:scale-105`}
        role="img"
        aria-label={project.imageAlt}
      />
      <div className="bg-grid absolute inset-0 opacity-60" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-t from-navy-950/95 via-navy-950/40 to-transparent"
        aria-hidden
      />

      <div className="relative p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${statusStyles[project.status]}`}
          >
            {project.status}
          </span>
          {project.categories.slice(0, 2).map((c) => (
            <span
              key={c}
              className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-white/85 ring-1 ring-white/15"
            >
              {c}
            </span>
          ))}
        </div>
        <h3 className="text-lg font-bold leading-snug text-white">
          {project.name}
        </h3>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-steel-300">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {project.location}
        </p>
        <p className="mt-1 text-sm text-steel-400">
          {project.client}
          {project.capacity ? ` · ${project.capacity}` : ""}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-400 transition-colors group-hover:text-accent-300">
          View Project
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
