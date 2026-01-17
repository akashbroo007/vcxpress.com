# VC Express – Product Requirements Document (PRD)

## 1. Product Overview

**Product Name:** VC Express\
**Category:** Venture Capital & Startup Funding News Platform\
**Target Users:**

- Startup founders
- Investors & VC analysts
- Journalists
- General readers interested in startup funding

**Core Value Proposition:**\
VC Express delivers **fast, clean, and easy-to-understand VC funding news** without hype, fluff, or paywalls.

---

## 2. Goals & Success Metrics

### Primary Goals

- Ship MVP fast with zero infrastructure cost
- Enable easy content publishing (non-technical)
- Rank on Google for VC funding keywords
- Scale to high traffic without rewriting architecture

### Success Metrics

- Time to publish an article: < 5 minutes
- Google indexing within 24–72 hours
- Page load time < 2 seconds
- Ability to support 100k+ monthly users on free tier

---

## 3. Tech Stack (Finalized)

### Frontend

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (or existing CSS migrated)
- **Rendering:** Static Generation + ISR

### CMS / Backend

- **CMS:** Sanity CMS (acts as database)
- **Query Language:** GROQ
- **Image Handling:** Sanity Image CDN

### Hosting & Infra

- **Hosting:** Vercel (Free tier)
- **Domain:** Custom domain (rekordly.in / vcexpress)
- **SEO:** Google Search Console, sitemap.xml

### Analytics (Later Phase)

- Google Analytics / Plausible

### Mobile-First Requirement

- Mobile is the primary experience
- All layouts must be designed for small screens first
- Desktop layouts are progressive enhancements
- Typography, spacing, and readability must prioritize mobile

---

## 4. Scope Definition

### In-Scope (MVP)

- News publishing system
- Category-based article listing
- SEO-optimized article pages
- Admin dashboard (Sanity Studio)
- Static informational pages

### Out-of-Scope (Future)

- User login
- Comments
- Paid subscriptions
- Newsletter automation
- Community features

---

## 5. Content Architecture (Sanity as Database)

### Document Types

#### 5.1 Article

- title
- slug (auto-generated)
- summary (2–3 lines)
- body (rich text)
- companyName
- fundingAmount
- fundingRound (Seed, Series A, etc.)
- category (reference)
- publishedDate
- sourceURL
- featuredImage
- seoTitle
- seoDescription
- status (draft / published)

#### 5.2 Category

- name
- slug
- description

#### 5.3 Author

- name (VCXpress Team)

---

## 6. Page Types (Live vs Static)

### Static Pages (Built Once)

These pages do NOT change frequently and are statically rendered:

- Home layout shell
- About Us
- Contact
- Privacy Policy
- Terms & Conditions

### Dynamic Pages (CMS-driven)

These pages fetch data from Sanity:

- Homepage article feed
- Category listing pages
- Individual article pages

---

## 7. Frontend Page Breakdown

### 7.1 Homepage (Dynamic)

**Components:**

- Header (Logo, Navigation)
- Latest Funding News section
- Category filters
- Featured article card
- Footer

**Data Source:** Sanity (latest published articles)

**Rendering:** ISR (revalidate every 60 seconds)

---

### 7.2 Article Page (Dynamic)

**URL Structure:**
`/news/[slug]`

**Content:**

- Title
- Summary
- Featured Image
- Article body
- Funding metadata (company, amount, round)
- Source link

**SEO:**

- Server-rendered
- Custom meta title & description

---

### 7.3 Category Page (Dynamic)

**URL Structure:**
`/category/[slug]`

**Content:**

- Category title
- Article list

---

## 8. Design & UI Requirements

### Design Principles

- Clean, minimal, Bloomberg/Finsmes-style
- High readability
- Mobile-first
- No distractions

### Migration Rule (Important)

- **Existing HTML/CSS will be provided**
- AI task is ONLY to:
  - Convert HTML into Next.js components
  - Preserve CSS exactly
  - No redesign unless explicitly requested

---

## 9. SEO Requirements (Critical)

- Static generation for all articles
- XML sitemap auto-generation
- Clean URLs
- Canonical URLs
- OpenGraph tags
- Fast Core Web Vitals

---

## 10. Admin Workflow (Sanity Studio)

1. Admin logs into `/studio`
2. Creates new Article
3. Fills funding details
4. Adds source link
5. Publishes
6. Site updates automatically

No developer involvement required.

---

## 11. Performance & Caching

- ISR to minimize API calls
- Image optimization via Sanity CDN
- Vercel Edge caching

---

## 12. Security & Reliability

- No direct database exposure
- Read-only public APIs
- Admin access protected by Sanity Auth
- HTTPS by default

---

## 13. Scalability Plan

### Phase 1 (Now)

- Sanity Free
- Vercel Free

### Phase 2 (Growth)

- Sanity paid tier
- Edge caching
- Newsletter DB (Supabase)

### Phase 3 (Monetization)

- Ads
- Premium content
- API access

---

## 14. Risks & Mitigations

| Risk        | Mitigation          |
| ----------- | ------------------- |
| CMS lock-in | Sanity export tools |
| API limits  | ISR + caching       |
| SEO delay   | GSC + sitemap       |

---

## 15. Launch Checklist

-

---

## 16. Non-Goals

- Social media platform
- Blogging platform
- Community forum

---

## 17. Final Notes

This PRD is designed to:

- Minimize cost
- Maximize speed
- Avoid rewrites
- Support long-term growth

VC Express is built as a **media-grade, VC-focused, SEO-first product**.

