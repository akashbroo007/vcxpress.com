# VCXPRESS

Internal documentation for the **VCXPRESS** web application.

VCXPRESS is a news + analysis site powered by **Next.js App Router** and **Sanity CMS**, with newsletter subscription and contact flows.

## Tech Stack

- **Framework**: Next.js (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Sanity + Sanity Studio (served at `/studio`)
- **Email provider**: Resend (contact form)
- **Database**: Supabase (newsletter subscribers)

## Repository Structure (high-level)

- `src/app/`
  - App Router routes (pages)
  - `src/app/api/*` API routes
  - `src/app/robots.txt/route.ts` and `src/app/sitemap.xml/route.ts`
- `src/components/`
  - Shared UI components (navbar/footer, lists, forms)
- `src/lib/`
  - `sanity.client.ts`: `sanityFetch` wrapper
  - `sanity/image.ts`: image URL helpers
  - `apiSecurity.ts`: rate limiting, safe JSON responses, strict body parsing
- `src/sanity/`
  - Sanity Studio config + env helpers

## Prerequisites

- Node.js (recommended: latest LTS)
- npm
- Access to:
  - Sanity project + dataset
  - Supabase project (newsletter table)
  - Resend account (contact email)

## Local Development

1. Install dependencies

```bash
npm install
```

2. Create `.env.local`

This repo does not include an `.env.example`. Create `.env.local` in the project root.

3. Start the dev server

```bash
npm run dev
```

App runs at:

- `http://localhost:3000`
- Sanity Studio: `http://localhost:3000/studio`

## Environment Variables

**Do not commit secrets.** Use `.env.local` for local development and your deployment provider’s env var settings for production.

### Public (safe to expose)

- `NEXT_PUBLIC_SITE_URL`
  - Canonical site URL used for metadata (e.g. `https://vcxpress.com`)
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
  - Sanity project id
- `NEXT_PUBLIC_SANITY_DATASET`
  - Sanity dataset name (must be a valid dataset name)
- `NEXT_PUBLIC_SANITY_API_VERSION` (optional)
  - Sanity API version used by Studio env helper (defaults to `2026-01-14`)

### Server-only (secrets)

- `SUPABASE_URL`
  - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`
  - Supabase service role key (server-only; required for subscribe/unsubscribe)
- `RESEND_API_KEY`
  - Resend API key (server-only; required for contact form)
- `CONTACT_TO_EMAIL`
  - Destination email that receives contact form submissions
- `CONTACT_FROM_EMAIL`
  - Verified sender identity configured in Resend
- `CONTACT_AUTOREPLY_ENABLED` (optional)
  - `true/false` toggle for contact auto-reply behavior
- `REVALIDATE_SECRET`
  - Secret for `/api/revalidate` webhook authentication

## Scripts

- `npm run dev`
  - Start Next.js dev server
- `npm run build`
  - Production build
- `npm run start`
  - Start production server (after build)
- `npm run lint`
  - ESLint

## Content & Sanity

- Studio is served at `/studio`.
- News and Learn content is fetched via GROQ queries in `src/lib/sanity.queries.ts` using `sanityFetch`.
- If Sanity isn’t configured, the app will throw with a clear error indicating which env vars are missing.

## API Routes

All API routes return JSON via `apiJson` (adds baseline security headers) and are protected with IP-based rate limiting.

- `POST /api/subscribe`
  - Adds/reactivates an email in Supabase `subscribers`
  - Requires `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

- `POST /api/unsubscribe`
  - Deactivates an email in Supabase `subscribers`
  - Requires `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

- `POST /api/contact`
  - Sends a contact email via Resend
  - Requires `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`
  - Optional: `CONTACT_AUTOREPLY_ENABLED`

- `POST /api/revalidate`
  - Revalidates tags/paths (used by CMS webhooks)
  - Requires `REVALIDATE_SECRET`
  - Auth: `x-revalidate-secret` header OR `?secret=` query param

## Security Notes (API)

- Shared helper: `src/lib/apiSecurity.ts`
  - IP-based token-bucket rate limiting
  - Strict JSON body parsing with size limits
  - Plain-object checks + allowlist key validation (for endpoints that accept form data)
  - Consistent JSON responses + baseline security headers

## SEO / Indexing

- `robots.txt` route: `src/app/robots.txt/route.ts`
- `sitemap.xml` route: `src/app/sitemap.xml/route.ts`
- Canonical URL and social metadata depend on `NEXT_PUBLIC_SITE_URL`

## Deployment

Typical flow:

1. Set production env vars (see above)
2. Deploy (Vercel or equivalent)
3. Confirm:
   - `/sitemap.xml` and `/robots.txt` resolve
   - `/studio` works against the correct dataset
   - `/api/revalidate` is configured in Sanity webhook settings

See `LAUNCH_CHECKLIST.md` for go-live validation.

## Troubleshooting

- **Sanity not configured**
  - Ensure `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` are set.

- **Subscribe/Unsubscribe returns 500**
  - Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set.

- **Contact form returns “Contact delivery is not configured”**
  - Ensure `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` are set.

- **429 Too many requests**
  - You may be rate limited during testing; see `src/lib/apiSecurity.ts` for current limits.
