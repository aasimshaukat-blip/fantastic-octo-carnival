import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/Reveal";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-navy-900">
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div
        className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent-500/20 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal className="flex flex-col items-center text-center">
          <h2 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Let&apos;s Build the Future Together
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-steel-300">
            Partner with a UAE-based EPC contractor trusted on ADNOC-tier
            programmes — engineered for safety, built for performance,
            delivered on time.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded bg-accent-500 px-7 py-3.5 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-accent-600"
            >
              Start a Conversation
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center rounded border border-white/25 px-7 py-3.5 text-base font-semibold text-white transition-colors hover:border-accent-400 hover:text-accent-400"
            >
              Explore Our Projects
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
