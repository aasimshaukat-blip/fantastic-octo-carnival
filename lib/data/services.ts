export type Service = {
  slug: string;
  title: string;
  short: string;
  overview: string;
  capabilities: string[];
  industries: string[];
  benefits: string[];
  icon: string;
};

export const services: Service[] = [
  {
    slug: "engineering",
    title: "Engineering Services",
    short:
      "Design engineering, project planning, and technical consultancy for energy and industrial facilities.",
    overview:
      "Our in-house engineering division delivers full design engineering — civil, structural, mechanical, and electromechanical — alongside Primavera P6-based project planning and technical consultancy. Every design is produced to ADNOC group standards, UAE statutory codes, and international best practice, de-risking projects from the first drawing.",
    capabilities: [
      "Design Engineering — civil, structural, MEP & process utilities",
      "Project Planning & Controls (Primavera P6)",
      "Technical Consultancy & Value Engineering",
      "Authority approvals & regulatory engineering (ADNOC, Civil Defence, Municipality)",
      "Constructability reviews & design optimisation",
    ],
    industries: ["Oil & Gas", "Energy", "Industrial", "Infrastructure"],
    benefits: [
      "ADNOC-standard engineering with no scope dilution",
      "Integrated design-to-construction handover that eliminates interface risk",
      "Value engineering that reduces cost without compromising quality",
    ],
    icon: "DraftingCompass",
  },
  {
    slug: "procurement",
    title: "Procurement Services",
    short:
      "Material sourcing, vendor management, and supply chain solutions backed by group-wide purchasing power.",
    overview:
      "ACE Contracting operates a structured procurement function combining in-house manufacturing through the Cheriyan Holdings group, long-standing strategic vendor partnerships (ABB, Daikin, Johnson Controls, Honeywell), and a vetted panel of 140+ subcontractors. Every vendor passes financial, technical, HSE, and commercial pre-qualification.",
    capabilities: [
      "Strategic material sourcing & bulk purchasing",
      "Vendor pre-qualification & management",
      "Supply chain & logistics solutions across the GCC",
      "Expediting, inspection & material traceability",
      "In-Country Value (ICV) optimisation — 55%+ local spend",
    ],
    industries: ["Oil & Gas", "Industrial", "Infrastructure", "Energy"],
    benefits: [
      "Consolidated group purchasing reduces unit costs",
      "ADNOC-approved vendor network for safety-critical packages",
      "Strong ICV performance supporting client local-content targets",
    ],
    icon: "PackageSearch",
  },
  {
    slug: "construction",
    title: "Construction Services",
    short:
      "Mechanical, civil, and structural construction including pipelines and industrial facilities — delivered turnkey.",
    overview:
      "Construction is the core of ACE Contracting. We self-perform mechanical construction, civil works, structural steel fabrication and erection, pipeline installation, and complete industrial facilities — supported by a dedicated owned plant fleet of 200+ units and a directly employed workforce of skilled tradesmen.",
    capabilities: [
      "Mechanical Construction & equipment installation",
      "Civil Construction — earthworks, roads, concrete structures",
      "Structural Steel Works — fabrication, erection & cladding",
      "Pipeline Installation & associated facilities",
      "Industrial Facilities — turnkey EPC delivery",
      "MEP & utilities — HVAC, power, water, fire & life safety, ICT",
    ],
    industries: ["Oil & Gas", "Industrial", "Infrastructure", "Energy"],
    benefits: [
      "Self-performed critical-path trades — no contractor-of-contractor risk",
      "Owned plant fleet with 95%+ availability on critical equipment",
      "Zero-LTI safety culture across 18M+ man-hours",
    ],
    icon: "HardHat",
  },
  {
    slug: "oil-and-gas",
    title: "Oil & Gas Projects",
    short:
      "EPC works for ADNOC-tier oil & gas facilities across the Al Dhafra region and the wider UAE.",
    overview:
      "ACE Contracting has delivered works across ADNOC's most significant value chains — Habshan, Asab, Ruwais LNG, and the Hail & Ghasha development — under CICPA, ADNOC HSE, and Civil Defence jurisdiction. Our teams hold direct experience with ADNOC standards and security-controlled site protocols.",
    capabilities: [
      "EPC works within live ADNOC gas-processing complexes",
      "CICPA-zone construction & security-compliant delivery",
      "Temporary & permanent facilities for mega-projects",
      "Brownfield works, tie-ins & shutdown support",
      "Fire & life-safety systems to ADNOC standards",
    ],
    industries: ["Oil & Gas", "Energy"],
    benefits: [
      "Proven ADNOC project track record — 100% HSE rating awarded twice",
      "Established relationships across ADNOC Gas, ADNOC Onshore & EPC majors",
      "Fast mobilisation from our Al Dhafra regional base",
    ],
    icon: "Flame",
  },
  {
    slug: "pipeline-construction",
    title: "Pipeline Construction",
    short:
      "Pipeline installation, testing, and associated facilities for energy and utility networks.",
    overview:
      "From utility corridors to process pipework, ACE Contracting delivers pipeline construction with certified welding teams, rigorous NDT regimes, and complete reinstatement. Our experience includes pipeline camp infrastructure for Galfar / CAT Group pipeline programmes and utility networks across major sites.",
    capabilities: [
      "Cross-country & in-plant piping installation",
      "Welding & NDT management (certified procedures)",
      "Hydrotesting, pre-commissioning & commissioning",
      "Trenching, backfill & reinstatement",
      "Utility networks — water, sewerage, firewater, fuel",
    ],
    industries: ["Oil & Gas", "Energy", "Infrastructure"],
    benefits: [
      "Certified welders and traceable quality records",
      "Underground service mapping protocols that protect existing assets",
      "Integrated civil & mechanical execution under one contractor",
    ],
    icon: "Pipette",
  },
  {
    slug: "mechanical-works",
    title: "Mechanical Works",
    short:
      "Equipment installation, steel structures, HVAC, and electromechanical systems for industrial plants.",
    overview:
      "Our Electromechanical and Steel Structures divisions deliver complete mechanical scopes — from structural steel fabrication at our Fujairah yard to HVAC, fire-fighting, and plant equipment installation — with an 18-strong dedicated MEP leadership team.",
    capabilities: [
      "Structural steel fabrication & erection",
      "HVAC systems — ducted split, VRF & central plants",
      "Fire-fighting & fire-alarm systems (N+1 redundancy designs)",
      "Plant & equipment installation and alignment",
      "Low-current systems — ICT, CCTV, access control, PA",
    ],
    industries: ["Industrial", "Oil & Gas", "Energy"],
    benefits: [
      "Own fabrication yard in Fujairah for schedule certainty",
      "Authorised system-integrator partnerships (ABB, Daikin, Honeywell)",
      "Single-point responsibility across all electromechanical trades",
    ],
    icon: "Cog",
  },
  {
    slug: "civil-works",
    title: "Civil Works",
    short:
      "Earthworks, roads, drainage, concrete structures, and complete site infrastructure.",
    overview:
      "ACE's Civil Division self-performs large-scale earthworks, internal road networks, drainage, and reinforced-concrete structures. Recent delivery includes 48,000 m² of earthworks and 4.8 km of internal roads on a single programme, executed to full seismic and municipal compliance.",
    capabilities: [
      "Bulk earthworks — cut, fill & compaction",
      "Roads & pavements — flexible & rigid construction",
      "Reinforced concrete structures (seismic compliant)",
      "Storm-water drainage & utilities corridors",
      "Hard & soft landscaping, external works",
    ],
    industries: ["Infrastructure", "Industrial", "Oil & Gas"],
    benefits: [
      "Grade A / Class 1 municipality contractor classification",
      "Owned earthmoving fleet for programme certainty",
      "First-time-pass record on Civil Defence inspections",
    ],
    icon: "Construction",
  },
  {
    slug: "maintenance",
    title: "Maintenance Services",
    short:
      "Plant maintenance, shutdown services, and asset integrity solutions for operating facilities.",
    overview:
      "Through long-term O&M contracts, ACE Contracting maintains operating facilities at 99.8% utility availability. Our maintenance teams deliver planned preventive maintenance, shutdown and turnaround support, and asset-integrity programmes that keep clients' facilities productive and compliant.",
    capabilities: [
      "Plant & facilities maintenance (O&M contracts)",
      "Shutdown & turnaround services",
      "Asset integrity & reliability solutions",
      "24/7 breakdown response with stocked spares",
      "Facilities management through group affiliates",
    ],
    industries: ["Oil & Gas", "Industrial", "Energy", "Infrastructure"],
    benefits: [
      "99.8% utility availability sustained over 3+ years of operations",
      "Preventive maintenance regimes per OEM specifications",
      "Lifecycle partnership from construction into operations",
    ],
    icon: "Wrench",
  },
];
