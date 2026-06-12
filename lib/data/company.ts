export const company = {
  name: "ACE Contracting",
  legalName: "ACE Contracting LLC",
  tagline: "Delivering Excellence in EPC Construction & Oil & Gas Projects",
  description:
    "ACE Contracting provides engineering, procurement, construction, and maintenance solutions for the energy, industrial, and infrastructure sectors across the UAE.",
  founded: 2016,
  group: "Cheriyan Holdings (UAE)",
  url: "https://www.acecontracting.ae",
  email: "info@acecontracting.ae",
  phone: "+971 2 555 0426",
  phoneSecondary: "+971 9 222 8100",
  offices: [
    {
      name: "Corporate HQ — Abu Dhabi",
      address: "Musaffah Industrial Area, Abu Dhabi, United Arab Emirates",
      phone: "+971 2 555 0426",
      mapQuery: "Musaffah Industrial Area, Abu Dhabi, UAE",
    },
    {
      name: "Regional Office — Fujairah",
      address: "Al Hayl Industrial Area, Fujairah, United Arab Emirates",
      phone: "+971 9 222 8100",
      mapQuery: "Al Hayl Industrial Area, Fujairah, UAE",
    },
  ],
  workingHours: "Saturday – Thursday, 8:00 AM – 6:00 PM (GST)",
  social: {
    linkedin: "https://www.linkedin.com/company/ace-contracting-uae",
    instagram: "https://www.instagram.com/acecontracting.uae",
    facebook: "https://www.facebook.com/acecontracting.uae",
  },
  stats: [
    { label: "Years of Experience", value: 10, suffix: "+" },
    { label: "Projects Delivered", value: 16, suffix: "+" },
    { label: "Active Projects", value: 5, suffix: "" },
    { label: "Skilled Workforce at Peak", value: 1500, suffix: "+" },
    { label: "Safe Man-Hours", value: 18, suffix: "M+" },
    { label: "Client Satisfaction", value: 4.6, suffix: "/5", decimals: 1 },
  ],
  certifications: [
    {
      name: "ISO 9001:2015",
      scope: "Quality Management System — Construction, EPC, Fit-out",
    },
    {
      name: "ISO 14001:2015",
      scope: "Environmental Management System — Construction, EPC",
    },
    {
      name: "ISO 45001:2018",
      scope: "Occupational Health & Safety Management System",
    },
    {
      name: "ADNOC Vendor Listed (AVL)",
      scope: "Approved EPC & labour accommodation contractor",
    },
    {
      name: "ICV Certified",
      scope: "ADNOC In-Country Value programme — strong rating",
    },
    {
      name: "Civil Defence Contractor",
      scope: "Fire & life-safety works — Abu Dhabi Civil Defence",
    },
  ],
  awards: [
    { year: 2024, title: "ADNOC 100% HSE Rating — Habshan Phase 1 Camp", by: "ADNOC HSE" },
    { year: 2024, title: "Zero-LTI Milestone — Asab TCF/TSF", by: "ADNOC" },
    { year: 2023, title: "ICV Gold Tier Ranking", by: "ADNOC" },
    { year: 2023, title: "Outstanding Contractor of the Year — Al Dhafra Region", by: "Industry Association" },
    { year: 2022, title: "ISO 45001 First Certification", by: "Accredited Certification Body" },
  ],
  leadership: [
    {
      name: "Saji Cheriyan",
      role: "Principal, Cheriyan Holdings",
      bio: "Founder and principal of the Cheriyan Holdings group, providing executive sponsorship and strategic direction across the group's EPC, manufacturing, real estate, and logistics businesses.",
    },
    {
      name: "Sachin Saji Cheriyan",
      role: "General Manager & Al Dhafra Regional Manager — EPC Division",
      bio: "12+ years across EPC delivery, camp operations, and ADNOC contracting. MBA and engineering graduate leading ACE's Al Dhafra regional operations and major-project execution.",
    },
    {
      name: "Aasim Shaukat",
      role: "Senior Project Manager — EPC Division",
      bio: "14+ years in EPC, pipeline, and camp construction for ADNOC-tier clients. M.Tech Mechanical Engineer and PMP-certified, leading multi-disciplinary delivery teams across the Al Dhafra region.",
    },
    {
      name: "Imran Ahmed",
      role: "Project Manager",
      bio: "14+ years in EPC civil works and MEP integration. PMP-certified civil engineer with full-time site leadership on major accommodation and infrastructure programmes.",
    },
    {
      name: "Ali Al-Habashi",
      role: "Construction Manager — Civil & Structural",
      bio: "18+ years of civil EPC experience across the UAE, KSA, and Oman, leading structural, earthworks, and infrastructure construction on ADNOC-tier projects.",
    },
    {
      name: "Siddharth Menon",
      role: "MEP Lead — HVAC, Electrical, Plumbing & Fire",
      bio: "14+ years of MEP design and installation on ADNOC camp and industrial projects, leading multi-trade electromechanical teams from design through commissioning.",
    },
  ],
  values: [
    {
      title: "Safety",
      text: "Zero fatalities and a zero-LTI culture across 18M+ man-hours. Safety is a structural commitment — ring-fenced budgets, stop-work authority, and independent HSE reporting lines.",
    },
    {
      title: "Integrity",
      text: "Transparent, ethical business conduct aligned with UAE law, FCPA, and UK Bribery Act standards — with zero tolerance for compromise.",
    },
    {
      title: "Quality",
      text: "ISO 9001-certified delivery with first-time inspection pass rates above 92% and rework rates under 0.8% of in-place value.",
    },
    {
      title: "Innovation",
      text: "Modern construction technologies — modular prefabrication, MBR treatment systems, smart metering, and solar-assisted utilities.",
    },
    {
      title: "Sustainability",
      text: "Environmental responsibility built into every project: grey-water recycling, energy-efficient MEP design, and ISO 14001-certified environmental management.",
    },
    {
      title: "Teamwork",
      text: "Core leadership teams that have delivered together for 5+ years, backed by the integrated capabilities of the Cheriyan Holdings group.",
    },
  ],
};

export type Company = typeof company;
