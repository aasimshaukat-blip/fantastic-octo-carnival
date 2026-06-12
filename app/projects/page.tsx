import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import CTASection from "@/components/CTASection";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Projects — Oil & Gas, Industrial & Infrastructure Portfolio",
  description:
    "Explore ACE Contracting's project portfolio: EPC works across the Habshan gas complex, Ruwais LNG, Asab field, Etihad Rail, and major industrial programmes in the UAE.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Projects"
        title="Delivered Where It Matters Most"
        intro="EPC programmes across the UAE's most demanding sites — ADNOC gas complexes, LNG mega-projects, national infrastructure, and industrial facilities."
      />
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ProjectsExplorer />
        </div>
      </section>
      <CTASection />
    </>
  );
}
