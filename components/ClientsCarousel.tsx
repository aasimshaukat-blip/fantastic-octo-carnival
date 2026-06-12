import { clients } from "@/lib/data/clients";

/**
 * Continuous marquee of client wordmarks. The track is duplicated so the
 * -50% translate loop is seamless; the duplicate is aria-hidden.
 */
export default function ClientsCarousel() {
  const Track = ({ hidden = false }: { hidden?: boolean }) => (
    <ul
      className="flex shrink-0 items-center gap-4 pr-4"
      aria-hidden={hidden || undefined}
    >
      {clients.map((c) => (
        <li
          key={c.name}
          className="flex h-20 w-44 shrink-0 flex-col items-center justify-center rounded-lg border border-steel-200 bg-white px-4 text-center"
        >
          <span className="text-sm font-bold tracking-wide text-navy-800">
            {c.name}
          </span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-steel-400">
            {c.sector}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="marquee-mask overflow-hidden">
      <div className="animate-marquee flex w-max">
        <Track />
        <Track hidden />
      </div>
    </div>
  );
}
