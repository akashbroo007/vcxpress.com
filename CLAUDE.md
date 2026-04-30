# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server (after build)
npm run lint         # Run ESLint
```

## Architecture Overview

VCXPRESS is a Next.js App Router application with Sanity CMS for content management and Firebase for newsletter subscriptions.

### Core Architecture Patterns

**Server-Side Rendering with ISR:**
- Most pages use Server Components with Incremental Static Regeneration (ISR)
- Content fetched via `sanityFetch()` from `src/lib/sanity.client.ts`
- Default revalidation: 5 minutes (300s) for article lists
- CDN always enabled via Sanity client configuration

**Client-Side Real-Time Updates:**
- Live feeds use SWR hooks from `src/lib/sanity.swr.ts`
- `useSanityQuery()` provides automatic polling (60s production, 30s dev)
- `HomepageLiveFeed` component demonstrates SSR hydration + SWR pattern

**API Security:**
- All API routes use `apiJson()` for consistent JSON responses with security headers
- Rate limiting via `rateLimit()` from `src/lib/apiSecurity.ts`
- Turnstile captcha verification for forms (subscribe, contact)
- Strict JSON body parsing with size limits

### Key Libraries & Patterns

**Sanity Integration:**
- `sanityFetch()` - Server-side data fetching with caching/revalidation
- `useSanityQuery()` - Client-side SWR hooks for real-time updates
- GROQ queries defined in `src/lib/sanity.queries.ts`
- Image optimization via `safeSanityImageUrl()` from `src/lib/sanity/image.ts`

**Form Handling:**
- `NewsletterForm` - Email subscription with Turnstile captcha
- `ContactForm` - Contact form with spam protection (honeypot, captcha)
- Both use `verifyTurnstile()` for Cloudflare Turnstile verification

**Theme System:**
- `ThemeProvider` - Client component with localStorage persistence
- Dark mode via Tailwind `dark:` classes
- Font variables: `--font-mono` (IBM Plex Mono), `--font-body` (Lexend Deca)

## Important File Locations

**Configuration:**
- `next.config.ts` - Next.js config with CSP headers, image domains, turbopack root
- `src/sanity/` - Sanity Studio configuration and schema types
- `src/lib/sanity.client.ts` - Sanity client with CDN and caching

**API Routes:**
- `src/app/api/subscribe/route.ts` - Newsletter subscription (Firebase)
- `src/app/api/contact/route.ts` - Contact form (Resend email)
- `src/app/api/revalidate/route.ts` - ISR webhook for Sanity updates
- `src/app/api/search/route.ts` - Article search (GROQ)

**Security & Utilities:**
- `src/lib/apiSecurity.ts` - Rate limiting, JSON parsing, security headers
- `src/lib/turnstile.ts` - Cloudflare Turnstile verification
- `src/lib/firebaseAdmin.ts` - Firebase Admin SDK for newsletter

**Components:**
- `src/components/HomepageLiveFeed.tsx` - Live feed with SWR
- `src/components/NewsletterForm.tsx` - Subscription form
- `src/components/TurnstileWidget.tsx` - Captcha widget
- `src/components/ThemeProvider.tsx` - Dark mode provider

## Environment Variables

**Required for Sanity:**
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`

**Required for Firebase (newsletter):**
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

**Required for Contact Form:**
- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

**Required for Turnstile:**
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- `TURNSTILE_SECRET_KEY`

**Optional:**
- `CONTACT_AUTOREPLY_ENABLED` - Enable auto-reply for contact form
- `REVALIDATE_SECRET` - Secret for `/api/revalidate` webhook
- `NEXT_PUBLIC_SITE_URL` - Canonical URL for metadata

## Content Management

**Sanity Studio:** Access at `/studio` when running dev server

**Schema Types:**
- `post` - Articles/news items
- `category` - Content categories
- `author` - Article authors

**Content Fetching:**
- Use `sanityFetch()` for Server Components
- Use `useSanityQuery()` for Client Components
- GROQ queries in `src/lib/sanity.queries.ts`

**Revalidation:**
- ISR revalidates every 5 minutes by default
- Webhook at `/api/revalidate` triggers on-demand updates
- Configure webhook in Sanity dashboard with `REVALIDATE_SECRET`

## Security Considerations

**API Routes:**
- Always use `apiJson()` for responses
- Apply `rateLimit()` to prevent abuse
- Use `readJsonBody()` with size limits
- Validate with `isPlainObject()` and `hasOnlyAllowedKeys()`

**Forms:**
- Turnstile captcha required for all public forms
- Contact form includes honeypot field (`company_website`)
- Email validation with regex and length limits

**CSP Headers:**
- Configured in `next.config.ts`
- Allows Cloudflare Turnstile, Sanity CDN, Google Fonts
- Blocks inline scripts except where necessary

## Common Patterns

**Adding a new API route:**
```typescript
import {apiJson, rateLimit, readJsonBody} from '@/lib/apiSecurity'

export async function POST(req: Request) {
  const limited = rateLimit(req, {id: 'route-name', limit: 10, windowMs: 60_000})
  if (limited) return limited

  const parsed = await readJsonBody(req)
  if (!parsed.ok) return parsed.response

  // Process request...
  return apiJson({ok: true})
}
```

**Fetching content in Server Component:**
```typescript
import {sanityFetch} from '@/lib/sanity.client'
import {ARTICLE_QUERY} from '@/lib/sanity.queries'

const article = await sanityFetch(ARTICLE_QUERY, {slug}, {
  revalidate: 300,
  tags: ['articles', `article:${slug}`]
})
```

**Real-time updates in Client Component:**
```typescript
import {useSanityQuery} from '@/lib/sanity.swr'

const {data, error, isLoading} = useSanityQuery(ARTICLE_QUERY, {slug}, {
  refreshInterval: 60000
})
```

## Troubleshooting

**Sanity not configured:**
- Check `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`
- Dataset name must match regex: `/^~?[a-z0-9][a-z0-9_-]{0,63}$/`

**API rate limiting:**
- Check `src/lib/apiSecurity.ts` for current limits
- Rate limits are IP-based with burst capacity

**Turnstile errors:**
- Verify `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`
- Check browser console for widget initialization errors

**Build errors:**
- Clear `.next` directory: `rm -rf .next`
- Check TypeScript types in API routes
- Verify all environment variables are set
