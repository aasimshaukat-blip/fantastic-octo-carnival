export type Job = {
  slug: string;
  title: string;
  department: string;
  location: string;
  type: "Full-time" | "Contract";
  experience: string;
  summary: string;
  responsibilities: string[];
};

export const jobs: Job[] = [
  {
    slug: "senior-project-manager",
    title: "Senior Project Manager — EPC",
    department: "Project Management",
    location: "Abu Dhabi (Al Dhafra sites)",
    type: "Full-time",
    experience: "12+ years",
    summary:
      "Lead end-to-end delivery of major EPC programmes for ADNOC-tier clients, with full accountability for safety, schedule, cost, and quality.",
    responsibilities: [
      "Direct multi-disciplinary project teams across civil, mechanical, and MEP scopes",
      "Own client relationships, progress reporting, and commercial performance",
      "Champion HSE leadership with personal accountability for zero-harm outcomes",
      "PMP certification and ADNOC project experience strongly preferred",
    ],
  },
  {
    slug: "senior-hse-officer",
    title: "Senior HSE Officer",
    department: "Health, Safety & Environment",
    location: "Al Dhafra Region, Abu Dhabi",
    type: "Full-time",
    experience: "8+ years",
    summary:
      "Drive ACE's zero-LTI safety culture on site — leading inspections, training, and incident-prevention programmes across major EPC projects.",
    responsibilities: [
      "Lead site HSE teams, toolbox talks, and behavioural safety programmes",
      "Manage permit-to-work systems and contractor HSE compliance",
      "NEBOSH IGC required; IOSH, OSHA 30-hr, and H2S certifications preferred",
      "Experience on ADNOC or CICPA-controlled sites is a strong advantage",
    ],
  },
  {
    slug: "qaqc-engineer-civil",
    title: "QA/QC Engineer — Civil",
    department: "Quality",
    location: "Abu Dhabi",
    type: "Full-time",
    experience: "6+ years",
    summary:
      "Manage inspection and test plans, material approvals, and non-conformance processes across civil and structural works.",
    responsibilities: [
      "Implement project quality plans and ITPs with defined hold and witness points",
      "Conduct in-process inspections and manage NCR close-out",
      "ISO 9001 lead auditor qualification preferred",
      "Civil engineering degree with UAE site experience required",
    ],
  },
  {
    slug: "mep-engineer",
    title: "MEP Engineer",
    department: "Electromechanical",
    location: "Abu Dhabi / Fujairah",
    type: "Full-time",
    experience: "6+ years",
    summary:
      "Deliver HVAC, electrical, plumbing, and fire-protection installations from design coordination through testing and commissioning.",
    responsibilities: [
      "Coordinate MEP design, shop drawings, and authority approvals",
      "Supervise installation teams and specialist subcontractors",
      "Lead pre-commissioning and commissioning activities",
      "Experience with ADDC, Civil Defence, and ADNOC standards preferred",
    ],
  },
  {
    slug: "planning-engineer",
    title: "Planning Engineer (Primavera P6)",
    department: "Project Controls",
    location: "Abu Dhabi",
    type: "Full-time",
    experience: "5+ years",
    summary:
      "Build and maintain integrated project schedules, progress measurement systems, and earned-value reporting for major EPC programmes.",
    responsibilities: [
      "Develop and maintain P6 schedules with full logic and resource loading",
      "Produce look-aheads, progress S-curves, and delay analyses",
      "Support claims and extension-of-time submissions",
      "EPC or large-scale construction background required",
    ],
  },
  {
    slug: "procurement-officer",
    title: "Procurement Officer",
    department: "Supply Chain",
    location: "Abu Dhabi",
    type: "Full-time",
    experience: "4+ years",
    summary:
      "Source materials and services across our vendor network, supporting ICV targets and project schedules with disciplined expediting.",
    responsibilities: [
      "Process RFQs, technical-commercial evaluations, and purchase orders",
      "Expedite deliveries and manage vendor performance",
      "Support ICV reporting and local-content optimisation",
      "Construction materials experience in the UAE market required",
    ],
  },
];
