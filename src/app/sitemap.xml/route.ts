import {sanityFetch} from '@/lib/sanity.client'
import {CATEGORY_SLUGS_QUERY, PUBLISHED_ARTICLE_SLUGS_QUERY} from '@/lib/sanity.queries'

type SlugRow = {slug: string}

function xmlEscape(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function buildUrlset(urls: string[]): string {
  const body = urls
    .map((url) => `  <url><loc>${xmlEscape(url)}</loc></url>`)
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
}

export async function GET(): Promise<Response> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const [articleRows, categoryRows] = await Promise.all([
    sanityFetch<SlugRow[]>(PUBLISHED_ARTICLE_SLUGS_QUERY, {}, {revalidate: 3600, useCdn: false, tags: ['articles']}),
    sanityFetch<SlugRow[]>(CATEGORY_SLUGS_QUERY, {}, {revalidate: 3600, useCdn: false, tags: ['categories']}),
  ])

  const staticPaths = ['/', '/about', '/contact', '/privacy', '/terms']

  const urls = new Set<string>()

  for (const p of staticPaths) urls.add(new URL(p, siteUrl).toString())

  for (const row of articleRows) {
    const slug = typeof row.slug === 'string' ? row.slug.trim() : ''
    if (!slug) continue
    urls.add(new URL(`/news/${slug}`, siteUrl).toString())
  }

  for (const row of categoryRows) {
    const slug = typeof row.slug === 'string' ? row.slug.trim() : ''
    if (!slug) continue
    urls.add(new URL(`/category/${slug}`, siteUrl).toString())
  }

  const xml = buildUrlset(Array.from(urls))

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
    },
  })
}
