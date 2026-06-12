"use client";

import { useState } from "react";
import {
  projects,
  projectCategories,
  type ProjectCategory,
} from "@/lib/data/projects";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectsExplorer() {
  const [filter, setFilter] = useState<ProjectCategory | "All">("All");

  const visible =
    filter === "All"
      ? projects
      : projects.filter((p) => p.categories.includes(filter));

  return (
    <div>
      <div
        className="flex flex-wrap justify-center gap-2"
        role="group"
        aria-label="Filter projects by sector"
      >
        {(["All", ...projectCategories] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            aria-pressed={filter === cat}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
              filter === cat
                ? "bg-accent-500 text-white"
                : "bg-steel-100 text-steel-700 hover:bg-steel-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-steel-500" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        {filter !== "All" ? ` in ${filter}` : ""}
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </div>
  );
}
