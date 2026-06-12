export type ProjectCategory =
  | "Oil & Gas"
  | "Industrial"
  | "Infrastructure"
  | "Mechanical"
  | "Civil";

export type Project = {
  slug: string;
  name: string;
  client: string;
  endClient?: string;
  location: string;
  scope: string;
  scopeDetails: string[];
  duration: string;
  status: "Completed" | "Under Construction" | "Operational" | "Awarded";
  categories: ProjectCategory[];
  value?: string;
  capacity?: string;
  year: string;
  featured: boolean;
  highlights?: string[];
  /** Tailwind gradient classes used for the project visual */
  gradient: string;
  imageAlt: string;
};

export const projectCategories: ProjectCategory[] = [
  "Oil & Gas",
  "Industrial",
  "Infrastructure",
  "Mechanical",
  "Civil",
];

export const projects: Project[] = [
  {
    slug: "habshan-workers-camp",
    name: "Habshan Workers Accommodation — Phase 1 & 2",
    client: "TJN JV (Technip Energies + JGC + NMDC Energy)",
    endClient: "ADNOC Gas Processing",
    location: "Habshan, Al Dhafra Region, Abu Dhabi",
    scope:
      "EPC turnkey delivery of a 4,500-person workers' accommodation campus serving the ADNOC gas-processing complex — full design, civil infrastructure, 412 cabin footprints, central facilities, MEP and utilities, commissioned in two phased waves.",
    scopeDetails: [
      "48,000 m² of earthworks — cut, fill, compaction and sub-grade preparation",
      "412 accommodation cabin footprints across twin-room and G+1 block types",
      "1,500-seat dining hall, recreation centres, clinic, laundry and admin facilities",
      "Complete MEP: hybrid HVAC, MBR sewage treatment, N+1 fire-pump redundancy, campus-wide ICT",
      "4.8 km of internal roads, drainage, 260 parking bays and external works",
      "Two-wave commissioning with integrated testing and client training",
    ],
    duration: "16 months",
    status: "Under Construction",
    categories: ["Oil & Gas", "Industrial", "Civil"],
    value: "AED 56M",
    capacity: "4,500 persons",
    year: "2025–2027",
    featured: true,
    highlights: [
      "Full ADNOC Category-A welfare compliance with no scope dilution",
      "48-hour potable water storage — double the regulatory minimum",
      "Per-cabin smart metering for water and electricity",
    ],
    gradient: "from-navy-900 via-navy-700 to-accent-700",
    imageAlt:
      "Aerial view of a large modular workers accommodation campus under construction in the desert",
  },
  {
    slug: "ruwais-lng-tcf",
    name: "Ruwais LNG — Temporary Camp Facilities Sub-Packages",
    client: "TJN JV / SAFAD",
    endClient: "ADNOC Gas",
    location: "Ruwais / Jebel Dhannah, Al Dhafra, Abu Dhabi",
    scope:
      "Multi-package EPC works on ADNOC's tier-1 Ruwais LNG mega-project — camp EPC, fire-fighting and fire-alarm infrastructure, electrical and street-lighting networks, telecom, CCTV, and specialist fit-outs.",
    scopeDetails: [
      "Camp EPC — supply, installation and commissioning of accommodation and sports facilities",
      "Fire-fighting and fire-alarm systems across the TCF infrastructure package",
      "Electrical distribution, street-lighting and external LED networks",
      "Water, drainage, telecom, CCTV and PA systems",
      "Gym, recreation hall, mess hall and outdoor facility fit-outs",
    ],
    duration: "2025 — ongoing",
    status: "Operational",
    categories: ["Oil & Gas", "Mechanical"],
    value: "AED 157M",
    capacity: "~3,800 persons",
    year: "2025",
    featured: true,
    highlights: [
      "Tier-1 ADNOC mega-project delivered under joint-venture governance",
      "Multi-package coordination across mechanical, electrical and ICT trades",
    ],
    gradient: "from-navy-800 via-steel-700 to-navy-600",
    imageAlt:
      "LNG facility infrastructure with piping and lighting at dusk on the Ruwais coastline",
  },
  {
    slug: "asab-tcf-tsf-camp",
    name: "Asab TCF/TSF Dual Camp",
    client: "Descon Engineering",
    endClient: "ADNOC Onshore",
    location: "Asab Gas Field, Al Dhafra, Abu Dhabi",
    scope:
      "EPC plus long-term O&M of a dual-zone 2,400-person facility inside a CICPA-controlled security perimeter — independent utilities per zone, biometric access control, and shared central services.",
    scopeDetails: [
      "Dual-tenant master plan with CICPA single-entry security zoning",
      "284 cabin footprints including CICPA-hardened construction",
      "Independent genset farms, water storage and sewage treatment per zone",
      "Full security infrastructure — PIDS, 80+ CCTV cameras, biometric + RFID access, UVIS vehicle scanning",
      "Ongoing 24/7 operations and maintenance since 2023",
    ],
    duration: "EPC + 3 years O&M (ongoing)",
    status: "Operational",
    categories: ["Oil & Gas", "Industrial", "Mechanical"],
    value: "AED 32.5M EPC + AED 14.8M/yr O&M",
    capacity: "2,400 persons",
    year: "2023",
    featured: true,
    highlights: [
      "Zero LTI across 36 months of operations",
      "99.8% utility availability over a 3-year average",
      "Client satisfaction score of 4.8 / 5.0",
    ],
    gradient: "from-steel-800 via-navy-700 to-steel-600",
    imageAlt:
      "Secure industrial accommodation facility in the desert gas field with perimeter lighting",
  },
  {
    slug: "ghayathi-camp",
    name: "Ghayathi Accommodation Campus",
    client: "East Ville Real Estate (Cheriyan Holdings)",
    location: "Ghayathi, Al Dhafra, Abu Dhabi",
    scope:
      "Design, build, and operation of a 12,000-person open-market accommodation campus serving the ADNOC supply chain — modular construction with sustainability-led utilities.",
    scopeDetails: [
      "124 prefabricated modular cabin footprints",
      "480-seat dining hall with HACCP-aligned central kitchen",
      "80 kW solar-assisted water heating system",
      "100% landscape irrigation from recycled grey water",
      "On-site medical post with hospital partnership",
    ],
    duration: "Delivered Q3 2024 — operations ongoing",
    status: "Operational",
    categories: ["Infrastructure", "Industrial", "Civil"],
    capacity: "12,000 persons",
    year: "2024",
    featured: true,
    highlights: [
      "100% occupancy sustained since opening",
      "First-time pass on all Civil Defence inspections",
      "Solar-assisted utilities and grey-water recycling",
    ],
    gradient: "from-navy-700 via-accent-800 to-navy-900",
    imageAlt:
      "Modern modular accommodation campus with solar water heating panels",
  },
  {
    slug: "mafraq-industrial-accommodation",
    name: "Mafraq Industrial Area Accommodation",
    client: "Private Developer Consortium",
    location: "Mafraq Industrial Area, Abu Dhabi",
    scope:
      "Design-and-build of a G+2 reinforced-concrete residential block for 992 residents — full seismic compliance, complete MEP infrastructure, and ground-floor common facilities.",
    scopeDetails: [
      "G+2 residential block to UAE Building Code and municipal requirements",
      "Reinforced concrete frame with full seismic compliance (UBC 1997 Zone 2A)",
      "248 bedspaces per floor with ground-floor dining, gym, clinic and prayer rooms",
      "DX-split HVAC, fire-fighting, LV distribution and ICT backbone",
      "248 parking bays, shaded walkways, CCTV and access control",
    ],
    duration: "14 months",
    status: "Under Construction",
    categories: ["Civil", "Infrastructure"],
    value: "AED 47.3M",
    capacity: "992 residents",
    year: "2026–2027",
    featured: false,
    gradient: "from-steel-700 via-steel-600 to-navy-800",
    imageAlt:
      "Multi-storey residential concrete structure under construction with tower crane",
  },
  {
    slug: "jebel-dhannah-camp",
    name: "Jebel Dhannah Premium Camp",
    client: "TJN JV",
    endClient: "ADNOC",
    location: "Jebel Dhannah, Al Dhafra, Abu Dhabi",
    scope:
      "High-specification 700-person accommodation facility delivered to premium finish standards for ADNOC project staff.",
    scopeDetails: [
      "High-quality, high-finish accommodation and amenity buildings",
      "Premium interior fit-out through the group's specialist fit-out division",
      "Complete MEP, ICT and external infrastructure",
    ],
    duration: "Delivered Q2 2026",
    status: "Completed",
    categories: ["Oil & Gas", "Industrial"],
    capacity: "700 persons",
    year: "2026",
    featured: false,
    gradient: "from-navy-800 via-navy-600 to-accent-700",
    imageAlt: "Premium staff accommodation buildings with landscaped surroundings",
  },
  {
    slug: "etihad-rail-package-d",
    name: "Etihad Rail — Package D Camps & Site Offices",
    client: "Etihad Rail",
    location: "Multiple locations, UAE",
    scope:
      "Delivery of 2,500-person camp facilities and eight site office complexes supporting the UAE's national railway programme.",
    scopeDetails: [
      "2,500-person camp facilities across the Package D alignment",
      "Eight fully serviced site office complexes",
      "Rapid-mobilisation modular construction across multiple remote locations",
    ],
    duration: "Delivered 2018",
    status: "Completed",
    categories: ["Infrastructure", "Civil"],
    capacity: "2,500 persons",
    year: "2018",
    featured: false,
    gradient: "from-steel-800 via-navy-800 to-steel-700",
    imageAlt: "Railway infrastructure construction site with modular offices in the desert",
  },
  {
    slug: "mirbah-f3-power-plant",
    name: "Mirbah F3 Power Plant Camp",
    client: "Samsung E&I",
    location: "Mirbah, Fujairah",
    scope:
      "Construction of a 4,500-person facility supporting one of the UAE's major independent power plant programmes on the east coast.",
    scopeDetails: [
      "4,500-person capacity campus supporting power plant construction",
      "Complete civil infrastructure, utilities and central facilities",
      "Delivered for a tier-1 international EPC contractor",
    ],
    duration: "Delivered 2017",
    status: "Completed",
    categories: ["Industrial", "Civil"],
    capacity: "4,500 persons",
    year: "2017",
    featured: false,
    gradient: "from-navy-900 via-steel-700 to-navy-700",
    imageAlt: "Power plant construction site with cooling infrastructure on the coast",
  },
  {
    slug: "galfar-pipeline-camps",
    name: "Galfar / CAT Group Pipeline Programme Camps",
    client: "Galfar / CAT Group",
    location: "Western Region, Abu Dhabi",
    scope:
      "Camp infrastructure and associated civil and mechanical works supporting cross-country pipeline construction programmes.",
    scopeDetails: [
      "Pipeline-spread camp facilities with rapid relocation capability",
      "Water, fuel and power utilities for remote pipeline spreads",
      "Civil and mechanical support works along the pipeline corridor",
    ],
    duration: "Delivered 2021",
    status: "Completed",
    categories: ["Oil & Gas", "Mechanical", "Infrastructure"],
    year: "2021",
    featured: false,
    gradient: "from-accent-900 via-navy-800 to-navy-900",
    imageAlt: "Cross-country pipeline construction in the desert with heavy machinery",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export const featuredProjects = projects.filter((p) => p.featured);
