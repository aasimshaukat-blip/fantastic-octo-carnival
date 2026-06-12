import Link from "next/link";
import { Linkedin, Instagram, Facebook, MapPin, Phone, Mail, Clock } from "lucide-react";
import Logo from "@/components/Logo";
import { company } from "@/lib/data/company";
import { services } from "@/lib/data/services";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/projects", label: "Projects" },
  { href: "/hse", label: "Health, Safety & Environment" },
  { href: "/careers", label: "Careers" },
  { href: "/news", label: "News & Media" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-steel-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-5 text-sm leading-relaxed">
              UAE-based EPC contractor delivering engineering, procurement,
              construction, and maintenance solutions for the oil &amp; gas,
              energy, industrial, and infrastructure sectors since {company.founded}.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={company.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ACE Contracting on LinkedIn"
                className="rounded bg-white/5 p-2.5 transition-colors hover:bg-accent-500 hover:text-white"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={company.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ACE Contracting on Instagram"
                className="rounded bg-white/5 p-2.5 transition-colors hover:bg-accent-500 hover:text-white"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href={company.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="ACE Contracting on Facebook"
                className="rounded bg-white/5 p-2.5 transition-colors hover:bg-accent-500 hover:text-white"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <nav aria-label="Services">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {services.slice(0, 6).map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services#${s.slug}`}
                    className="transition-colors hover:text-accent-400"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="transition-colors hover:text-accent-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Head Office
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden />
                {company.offices[0].address}
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden />
                <a href={`tel:${company.phone.replace(/\s/g, "")}`} className="hover:text-accent-400">
                  {company.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden />
                <a href={`mailto:${company.email}`} className="hover:text-accent-400">
                  {company.email}
                </a>
              </li>
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-400" aria-hidden />
                {company.workingHours}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-steel-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights
            reserved. Part of the {company.group} group.
          </p>
          <p>ISO 9001 · ISO 14001 · ISO 45001 Certified | ADNOC Vendor Listed</p>
        </div>
      </div>
    </footer>
  );
}
