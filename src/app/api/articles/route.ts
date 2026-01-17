import {NextResponse} from 'next/server'

import {sanityFetch} from '@/lib/sanity.client'
import {ARTICLES_LIST_QUERY} from '@/lib/sanity.queries'

export async function GET() {
  const articles = await sanityFetch(ARTICLES_LIST_QUERY, {}, {cache: 'no-store', useCdn: false})

  return NextResponse.json(articles, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
