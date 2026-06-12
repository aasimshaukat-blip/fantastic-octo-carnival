import Reveal from "@/components/Reveal";

export default function PageHero({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 pb-20 pt-40">
      <div
        className="absolute inset-0 bg-gradient-to-br from-navy-950 via-navy-800 to-navy-700"
        aria-hidden
      />
      <div className="bg-grid absolute inset-0" aria-hidden />
      <div
        className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl"
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-400">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 text-lg leading-relaxed text-steel-300">
              {intro}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
