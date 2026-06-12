# ACE Contracting — Corporate Website

A premium, modern corporate website for **ACE Contracting**, a UAE-based EPC
(Engineering, Procurement & Construction) company delivering Oil & Gas,
Industrial, Energy, Infrastructure, and Mechanical Construction projects
across the UAE and GCC.

Built with **Next.js (App Router) + React + Tailwind CSS v4 + TypeScript**.

## Quick Start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Site Architecture

| Route | Page |
|---|---|
| `/` | Home — hero, stats, services, featured projects, why ACE, clients carousel, testimonials, CTA |
| `/about` | Company overview, vision & mission, core values, leadership, certifications & awards |
| `/services` | 8 service sections (engineering, procurement, construction, oil & gas, pipeline, mechanical, civil, maintenance) with anchor navigation |
| `/projects` | Portfolio with sector filtering (Oil & Gas / Industrial / Infrastructure / Mechanical / Civil) |
| `/projects/[slug]` | Detailed project pages (scope, facts, highlights, related projects) |
| `/hse` | HSE policy, safety dashboard, LTIR trend chart, training, QA procedures, environment |
| `/careers` | Why work with ACE, dynamic job listings, online application with CV upload |
| `/news` | Blog-style news with categories (company news, project updates, insights, press releases) |
| `/news/[slug]` | Article pages |
| `/contact` | Contact form, office info, Google Maps embed, social links |
| `/api/contact` | Contact form backend (validation + pluggable delivery) |
| `/api/careers` | Application backend (multipart, CV validation) |
| `/sitemap.xml`, `/robots.txt` | Generated via the Next.js Metadata API |

## Content Management (lightweight CMS)

All content lives in typed data modules under `lib/data/` — edit these to
update the site without touching components:

- `company.ts` — identity, stats, offices, leadership, values, certifications, awards
- `services.ts` — service definitions (capabilities, industries, benefits)
- `projects.ts` — project portfolio (add a project → it appears in listings, filters, detail pages, and the sitemap automatically)
- `news.ts` — news/blog posts
- `jobs.ts` — open positions (drives listings and the application form's position dropdown)
- `clients.ts` — client wordmarks and testimonials

To move to a headless CMS later (Sanity, Contentful, Strapi), replace these
modules with fetchers that return the same typed shapes — every component
consumes the types, not the source.

## Forms Backend

Both API routes validate input server-side and are production-pluggable via
environment variables:

```bash
CONTACT_WEBHOOK_URL=...   # contact submissions → email provider / CRM webhook
CAREERS_WEBHOOK_URL=...   # applications + CV file → ATS / storage webhook
```

Without these set, submissions are accepted and logged server-side (useful in
development). For production, wire to Resend / SendGrid / AWS SES or a CRM.

## Analytics

Set `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` to enable Google Analytics 4
(loaded `afterInteractive`, IP-anonymised). Without it, no analytics scripts load.

## SEO

- Per-page metadata + canonical URLs via the Next.js Metadata API
- JSON-LD schema: `Organization` (sitewide), `Service` list, `Project`, `NewsArticle`, `ContactPage`
- Generated `sitemap.xml` (includes all dynamic project/news routes) and `robots.txt`
- Update the production domain in `lib/data/company.ts` (`company.url`)

## Security

- Security headers in `next.config.mjs` (X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy)
- Server-side validation and size/type limits on all form inputs and CV uploads
- `/api/` disallowed in robots.txt; no secrets in client code

## Design System

- **Colors** (Tailwind theme tokens in `app/globals.css`):
  `navy-*` (deep navy blue), `steel-*` (industrial grey), `accent-*` (orange CTAs), white
- **Type**: Inter via `next/font` (swap display, self-hosted at build)
- **Motion**: scroll-reveal (`components/Reveal.tsx`), animated stat counters,
  marquee client carousel — all respecting `prefers-reduced-motion`
- Sticky navigation with scroll-aware styling; mobile-first responsive layouts

## Imagery

Project and hero visuals currently use branded gradient + blueprint-grid
placeholders (with descriptive `aria-label`s) so the site ships without
licensing risk. To go live with photography, replace the gradient blocks in
`ProjectCard`, `PageHero`, and the home hero with `next/image`. Suggested
shot list:

1. **Home hero** — wide-angle dusk shot of a gas-processing facility or
   large construction site with cranes (Habshan/Ruwais-style landscape)
2. **Services** — engineers reviewing drawings; warehouse/laydown yard;
   steel erection; pipeline welding; excavators on earthworks; maintenance
   technicians on rotating equipment
3. **Projects** — aerial drone shots of each campus/site, progress photos,
   completed facility exteriors
4. **HSE** — toolbox talks, PPE close-ups, training centre sessions
5. **About/Careers** — leadership portraits, multi-national site teams
6. **Client logos** — request usage permission, then replace the wordmark
   carousel in `components/ClientsCarousel.tsx` with logo images

Licensed sources: company photography (preferred), Getty/Shutterstock
industrial collections, or Unsplash+ for placeholders.

## Deployment

Optimised for Vercel (zero config). Also deployable to any Node host:

```bash
npm run build && npm start
```

Set the environment variables above in your hosting provider's dashboard.
