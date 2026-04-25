import {apiJson, rateLimit} from '@/lib/apiSecurity'

import {sanityFetch} from '@/lib/sanity.client'

const SEARCH_QUERY = /* groq */ `
  *[_type == "article" && status == "published" && (
    title match $q ||
    summary match $q ||
    companyName match $q
  )]
  | order(coalesce(publishedDate, publishedAt, _createdAt) desc)[0...20]{
    _id,
    title,
    "slug": slug.current,
    summary,
    companyName,
    "publishedDate": coalesce(publishedDate, publishedAt, _createdAt),
    "category": select(
      defined(categories[0]) => categories[0]->{_id, "name": coalesce(name, title), "slug": slug.current},
      defined(category) => category->{_id, "name": coalesce(name, title), "slug": slug.current},
      null
    )
  }
`

export async function GET(req: Request) {
  const limited = rateLimit(req, {id: 'search', limit: 60, windowMs: 60_000, burst: 120, skipIfBot: true})
  if (limited) return limited

  const url = new URL(req.url)
  const raw = url.searchParams.get('q') ?? ''
  const term = raw.trim()

  if (!term) {
    return apiJson([], {headers: {'Cache-Control': 'no-store, max-age=0'}})
  }

  if (term.length > 200) {
    return apiJson({ok: false, error: 'Invalid request'}, {status: 400, headers: {'Cache-Control': 'no-store, max-age=0'}})
  }

  // GROQ match expects wildcards for partial matching
  const q = `*${term}*`

  const results = await sanityFetch(SEARCH_QUERY, {q}, {cache: 'no-store'})

  return apiJson(results, {headers: {'Cache-Control': 'no-store, max-age=0'}})
}
