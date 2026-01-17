import {NextResponse} from 'next/server'

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

  const category = await sanityFetch<CategoryDetail | null>(
    CATEGORY_BY_SLUG_WITH_ARTICLES_QUERY,
    {slug},
    {cache: 'no-store', useCdn: false},
  )

  return NextResponse.json(category, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
