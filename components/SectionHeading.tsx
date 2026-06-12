import Reveal from "@/components/Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  dark = false,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  dark?: boolean;
  align?: "center" | "left";
}) {
  return (
    <Reveal
      className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent-500">
        {eyebrow}
      </p>
      <h2
        className={`mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl ${
          dark ? "text-white" : "text-navy-900"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-4 text-base leading-relaxed sm:text-lg ${
            dark ? "text-steel-300" : "text-steel-600"
          }`}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
