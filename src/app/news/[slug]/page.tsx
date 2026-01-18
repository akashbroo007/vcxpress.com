import {sanityFetch} from '@/lib/sanity.client'
import {PUBLISHED_ARTICLE_SLUGS_QUERY} from '@/lib/sanity.queries'

export {default, generateMetadata} from '../../articles/[slug]/page'

type SlugRow = {slug: string}

export async function generateStaticParams(): Promise<Array<{slug: string}>> {
  const rows = await sanityFetch<SlugRow[]>(
    PUBLISHED_ARTICLE_SLUGS_QUERY,
    {},
    {revalidate: 3600, useCdn: false, tags: ['articles']},
  )

  return rows
    .map((r) => (typeof r.slug === 'string' ? r.slug.trim() : ''))
    .filter(Boolean)
    .map((slug) => ({slug}))
}
