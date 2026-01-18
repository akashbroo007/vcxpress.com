# VCXpress — Launch Checklist (PRD Section 15)

## Domain & Hosting
- [ ] Vercel project connected
- [ ] Custom domain connected (e.g. `rekordly.in` / `vcexpress`)
- [ ] HTTPS active on primary domain
- [ ] Primary domain set as the canonical domain (no duplicate domains indexing)

## Environment Variables
- [ ] `NEXT_PUBLIC_SITE_URL` set to the production canonical URL (e.g. `https://yourdomain.com`)
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` set
- [ ] `NEXT_PUBLIC_SANITY_DATASET` set to the production dataset
- [ ] Any newsletter env vars verified (if applicable)

## Sitemap & Robots
- [ ] `https://yourdomain.com/sitemap.xml` loads as valid XML
- [ ] `https://yourdomain.com/robots.txt` loads and references the sitemap
- [ ] Sitemap submitted in Google Search Console
- [ ] Google Search Console shows no sitemap fetch/parse errors

## SEO Validation
- [ ] Canonical URL correct on:
  - [ ] `/news/[slug]`
  - [ ] `/category/[slug]`
  - [ ] key static pages
- [ ] OpenGraph preview verified (title/description/image) for a sample article
- [ ] X/Twitter card preview verified for a sample article
- [ ] No accidental `noindex` present on production pages

## Performance
- [ ] Lighthouse run on production:
  - [ ] Performance
  - [ ] SEO
  - [ ] Best Practices
  - [ ] Accessibility
- [ ] Core Web Vitals acceptable for at least homepage + one article

## Content Ops / Sanity
- [ ] `/studio` access confirmed
- [ ] Publishing workflow verified (draft → published)
- [ ] Sanity dataset locked down (permissions reviewed)
- [ ] Confirm Studio uses production dataset (not dev/test)

## Analytics (Later Phase — but readiness check)
- [ ] Analytics plan decided (GA / Plausible)
- [ ] If not installed, note who/when installs it

## Backup / Recovery
- [ ] Sanity export/backup approach documented (who runs exports + frequency)
- [ ] Basic incident plan (how to roll back deployment / revert content)
