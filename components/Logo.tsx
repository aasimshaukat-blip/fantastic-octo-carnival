export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg
        width="38"
        height="38"
        viewBox="0 0 38 38"
        fill="none"
        aria-hidden
        className="shrink-0"
      >
        <rect width="38" height="38" rx="6" fill="#f95d16" />
        <path d="M9 28 19 8l10 20h-5.4L19 18.6 14.4 28H9Z" fill="#fff" />
        <rect x="15" y="25" width="8" height="3" fill="#0b1830" />
      </svg>
      <span className="leading-tight">
        <span
          className={`block text-lg font-extrabold tracking-wide ${
            dark ? "text-navy-900" : "text-white"
          }`}
        >
          ACE <span className="text-accent-500">CONTRACTING</span>
        </span>
        <span
          className={`block text-[10px] font-medium uppercase tracking-[0.22em] ${
            dark ? "text-steel-500" : "text-white/60"
          }`}
        >
          EPC · Oil &amp; Gas · Industrial
        </span>
      </span>
    </span>
  );
}
