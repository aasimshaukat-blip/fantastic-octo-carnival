export type Client = { name: string; sector: string };

/**
 * Client and end-client organisations from ACE Contracting's project
 * track record. Rendered as styled wordmarks until official logo
 * assets (with usage permission) are supplied.
 */
export const clients: Client[] = [
  { name: "ADNOC Gas", sector: "Oil & Gas" },
  { name: "NMDC Energy", sector: "EPC" },
  { name: "Technip Energies", sector: "EPC" },
  { name: "JGC Corporation", sector: "EPC" },
  { name: "Etihad Rail", sector: "Infrastructure" },
  { name: "Samsung E&I", sector: "Energy" },
  { name: "Descon Engineering", sector: "Industrial" },
  { name: "Galfar", sector: "Pipelines" },
  { name: "CPECC", sector: "Oil & Gas" },
  { name: "SK Engineering", sector: "Energy" },
  { name: "NBTC", sector: "Oil & Gas" },
  { name: "SAFAD", sector: "Fire & Safety" },
];

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "ACE Contracting delivered our facility with zero lost-time injuries and a snag record that was best-in-class for a project of this scale. Their commissioning team's first-time pass rate set the benchmark for our programme.",
    author: "Commissioning Director",
    role: "Tier-1 EPC Joint Venture, Al Dhafra",
  },
  {
    quote:
      "Three years into operations, utility availability has never dropped below 99%. ACE's combination of EPC delivery and long-term operational support is exactly what a remote-site programme needs.",
    author: "Facilities Manager",
    role: "International EPC Contractor, Asab Gas Field",
  },
  {
    quote:
      "From design approval through Civil Defence inspection, every milestone was hit first time. ACE's regional presence in Al Dhafra means issues are resolved in hours, not weeks.",
    author: "Project Director",
    role: "Infrastructure Developer, Abu Dhabi",
  },
];
