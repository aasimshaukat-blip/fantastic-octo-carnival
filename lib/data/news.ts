export type NewsPost = {
  slug: string;
  title: string;
  category: "Company News" | "Project Updates" | "Industry Insights" | "Press Releases";
  date: string;
  excerpt: string;
  body: string[];
  gradient: string;
};

export const newsCategories = [
  "Company News",
  "Project Updates",
  "Industry Insights",
  "Press Releases",
] as const;

export const news: NewsPost[] = [
  {
    slug: "jebel-dhannah-delivery",
    title: "ACE Contracting Delivers Jebel Dhannah Premium Camp Ahead of Schedule",
    category: "Project Updates",
    date: "2026-05-18",
    excerpt:
      "The 700-person premium facility at Jebel Dhannah has been handed over to TJN JV with a best-in-class snag record and full client commissioning sign-off.",
    body: [
      "ACE Contracting has completed handover of the Jebel Dhannah Premium Camp, a 700-person high-finish accommodation facility delivered for TJN JV in support of ADNOC operations in the Al Dhafra region.",
      "The project was delivered through ACE's integrated EPC model, with interior fit-out executed by the group's specialist fit-out division and furniture manufactured in-house through Eastwood Furniture Factory — guaranteeing finish consistency across every room.",
      "The handover continues ACE Contracting's record of first-time commissioning passes and reinforces the company's position as a trusted delivery partner on ADNOC-tier programmes.",
    ],
    gradient: "from-navy-800 to-accent-800",
  },
  {
    slug: "mafraq-design-build-award",
    title: "ACE Contracting Awarded Mafraq Industrial Area Design & Build Contract",
    category: "Press Releases",
    date: "2026-01-22",
    excerpt:
      "A private developer consortium has awarded ACE Contracting the AED 47.3M turnkey design-and-build contract for a 992-resident G+2 accommodation block in Mafraq Industrial Area.",
    body: [
      "ACE Contracting has been awarded the design-and-build contract for the Mafraq Industrial Area Accommodation project — a G+2 reinforced-concrete residential block housing 992 residents in Abu Dhabi's peri-urban industrial corridor.",
      "The 14-month turnkey programme covers full structural design to UAE Building Code with seismic compliance, complete MEP infrastructure, and ground-floor common facilities including dining, gym, clinic, and prayer rooms.",
      "The award reflects ACE's growing reputation for cost-certain turnkey delivery and adds to an active portfolio that spans the Habshan, Ruwais, and Asab value chains.",
    ],
    gradient: "from-steel-700 to-navy-800",
  },
  {
    slug: "habshan-phase-one-milestone",
    title: "Habshan Phase 1 Reaches Structural Completion Milestone",
    category: "Project Updates",
    date: "2025-11-09",
    excerpt:
      "Phase 1 of the Habshan workers' accommodation campus has reached structural completion, keeping the two-wave commissioning programme on track for October 2026.",
    body: [
      "ACE Contracting has achieved structural completion on Phase 1 of the Habshan Workers Accommodation campus, delivered for TJN JV in support of ADNOC Gas Processing operations.",
      "The milestone covers all Phase 1 cabin structures, the 1,500-seat central dining hall, and primary MEP plant rooms. MEP first-fix is progressing in parallel, with the project's MBR sewage-treatment plant and N+1 fire-pump systems entering installation.",
      "Phase 1 remains on programme for October 2026 handover, with Phase 2 following in February 2027 under the project's two-wave commissioning model.",
    ],
    gradient: "from-navy-900 to-steel-700",
  },
  {
    slug: "adnoc-hse-recognition",
    title: "ACE Contracting Receives ADNOC 100% HSE Rating",
    category: "Company News",
    date: "2024-12-02",
    excerpt:
      "ADNOC HSE has awarded ACE Contracting a 100% HSE rating on the Habshan Phase 1 camp — the second such recognition across the company's project portfolio.",
    body: [
      "ACE Contracting has been awarded a 100% HSE rating by ADNOC HSE for its performance on the Habshan Phase 1 camp project, recognising exemplary safety management across all audited categories.",
      "The recognition follows ACE's Zero-LTI milestone award on the Asab TCF/TSF programme, and reflects a safety system built on ring-fenced HSE budgets, independent reporting lines, enforced stop-work authority, and 40+ hours of training per worker each year.",
      "Since 2016, ACE Contracting has recorded zero fatalities across more than 18 million man-hours worked.",
    ],
    gradient: "from-accent-800 to-navy-900",
  },
  {
    slug: "icv-gold-tier",
    title: "ACE Contracting Achieves ICV Gold Tier Ranking",
    category: "Company News",
    date: "2024-06-15",
    excerpt:
      "The company's In-Country Value certification has reached Gold tier, underlining its commitment to UAE local content, Emiratisation, and regional supply chains.",
    body: [
      "ACE Contracting has achieved Gold tier ranking under ADNOC's In-Country Value (ICV) programme, recognising the company's contribution to the UAE economy through local procurement, Emiratisation, and investment in regional infrastructure.",
      "ACE commits to over 55% ICV on project spend, sources the majority of materials and services from UAE vendors, and delivers all equipment maintenance and operator training locally.",
      "The Gold tier ranking strengthens ACE's position on ADNOC and government tenders where local content is a key evaluation criterion.",
    ],
    gradient: "from-navy-700 to-accent-900",
  },
  {
    slug: "uae-construction-outlook",
    title: "UAE Energy & Industrial Construction: Outlook for the Decade Ahead",
    category: "Industry Insights",
    date: "2026-03-04",
    excerpt:
      "From LNG expansion at Ruwais to national rail and industrial diversification, the UAE's project pipeline is reshaping demand for integrated EPC delivery.",
    body: [
      "The UAE's energy and industrial construction market is entering a sustained growth cycle. ADNOC's Ruwais LNG expansion, the Hail & Ghasha offshore development, and continued investment in gas processing capacity at Habshan and Asab are generating multi-year demand for EPC contractors with proven ADNOC-tier credentials.",
      "Beyond oil and gas, the national infrastructure agenda — rail, industrial zones, and utility modernisation — favours contractors who can self-perform across civil, mechanical, and electromechanical trades while meeting rising In-Country Value thresholds.",
      "ACE Contracting's view is that the winners in this cycle will be regionally anchored contractors with integrated supply chains, directly employed workforces, and demonstrable zero-harm safety records — the exact model ACE has built in the Al Dhafra region over the past decade.",
    ],
    gradient: "from-steel-800 to-navy-700",
  },
];

export function getPost(slug: string): NewsPost | undefined {
  return news.find((n) => n.slug === slug);
}
