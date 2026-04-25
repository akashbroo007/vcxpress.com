import {apiJson, rateLimit} from '@/lib/apiSecurity'

import {sanityFetch} from '@/lib/sanity.client'
import {ARTICLES_LIST_QUERY} from '@/lib/sanity.queries'

export async function GET(req: Request) {
  const limited = rateLimit(req, {id: 'articles', limit: 30, windowMs: 60_000, burst: 80, skipIfBot: true})
  if (limited) return limited

  const articles = await sanityFetch(ARTICLES_LIST_QUERY, {}, {cache: 'no-store'})

  return apiJson(articles, {headers: {'Cache-Control': 'no-store, max-age=0'}})
}
