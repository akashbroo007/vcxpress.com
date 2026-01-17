import Link from 'next/link'

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

type SearchResult = {
  _id: string
  title: string
  slug: string
  summary: string
  companyName: string
  publishedDate: string
  category?: {
    _id: string
    name: string
    slug: string
  } | null
}

type PageProps = {
  searchParams: Promise<{q?: string}>
}

export default async function SearchPage({searchParams}: PageProps) {
  const {q} = await searchParams
  const term = (q ?? '').trim()

  const results = term
    ? await sanityFetch<SearchResult[]>(SEARCH_QUERY, {q: `*${term}*`}, {revalidate: 30, useCdn: false, tags: ['articles']})
    : []

  return (
    <main className="bg-background-light dark:bg-background-dark text-text-main font-display antialiased min-h-screen">
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between gap-4 border-b border-black/10 dark:border-white/10 pb-6">
          <div className="flex flex-col gap-2">
            <h1 className="font-serif text-3xl md:text-4xl font-black tracking-tight text-text-main dark:text-white">Search</h1>
            <p className="text-sm text-text-subtle dark:text-gray-400">
              {term ? (
                <>
                  Showing results for <span className="font-mono font-bold">{term}</span>
                </>
              ) : (
                'Type a search term in the navbar.'
              )}
            </p>
          </div>
        </div>

        {term && results.length === 0 ? (
          <div className="mt-10 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 text-text-main/70 dark:text-white/70">
            No results.
          </div>
        ) : null}

        <div className="mt-8 flex flex-col gap-6">
          {results.map((r) => (
            <Link
              key={r._id}
              className="group rounded-xl border border-black/10 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-6 hover:border-primary/40 dark:hover:border-primary/40 hover:shadow-sm transition-all"
              href={`/news/${r.slug}`}
            >
              <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-wide text-text-subtle dark:text-gray-400">
                <span className="text-primary font-bold">{r.category?.name ?? ''}</span>
                <span className="text-text-main/30 dark:text-white/30">{r.category?.name ? '|' : ''}</span>
                <span>{r.publishedDate ? new Date(r.publishedDate).toLocaleDateString() : ''}</span>
              </div>
              <h2 className="mt-3 font-serif text-2xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">
                {r.title}
              </h2>
              <p className="mt-2 text-text-subtle dark:text-gray-400 leading-relaxed line-clamp-3">{r.summary}</p>
              <div className="mt-4 text-xs font-mono uppercase tracking-wide text-text-subtle dark:text-gray-400">{r.companyName}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
