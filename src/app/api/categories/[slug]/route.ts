import {apiJson, rateLimit} from '@/lib/apiSecurity'

import {sanityFetch} from '@/lib/sanity.client'
import {CATEGORY_BY_SLUG_WITH_ARTICLES_QUERY} from '@/lib/sanity.queries'

type CategoryDetail = {
  _id: string
  name: string
  slug: string
  description?: string | null
  articles: Array<{
    _id: string
    title: string
    slug: string
    summary: string
    publishedDate: string
    companyName: string
    fundingAmount: string
    fundingRound: string
  }>
}

export async function GET(_req: Request, ctx: {params: Promise<{slug: string}>}) {
  const {slug} = await ctx.params

  if (typeof slug !== 'string' || !slug || slug.length > 200) {
    return apiJson({ok: false, error: 'Invalid request'}, {status: 400})
  }

  const limited = rateLimit(_req, {id: 'category', limit: 30, windowMs: 60_000, burst: 80, skipIfBot: true})
  if (limited) return limited

  const category = await sanityFetch<CategoryDetail | null>(
    CATEGORY_BY_SLUG_WITH_ARTICLES_QUERY,
    {slug},
    {cache: 'no-store', useCdn: false},
  )

  return apiJson(category, {headers: {'Cache-Control': 'no-store, max-age=0'}})
}
