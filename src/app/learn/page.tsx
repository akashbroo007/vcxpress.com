import Link from 'next/link'

import {sanityFetch} from '@/lib/sanity.client'
import {LEARN_CATEGORIES_LIST_QUERY, LEARN_LATEST_ARTICLES_QUERY} from '@/lib/sanity.queries'

type LearnCategory = {
  _id: string
  title: string
  slug: string
  description?: string | null
  order?: number | null
}

type LearnListItem = {
  _id: string
  title: string
  slug: string
  summary: string
  category?: {
    _id: string
    title: string
    slug: string
  } | null
}

export default async function LearnHomePage() {
  const [categories, latest] = await Promise.all([
    sanityFetch<LearnCategory[]>(LEARN_CATEGORIES_LIST_QUERY, {}, {revalidate: 300, tags: ['learn']}),
    sanityFetch<LearnListItem[]>(LEARN_LATEST_ARTICLES_QUERY, {}, {revalidate: 300, tags: ['learn']}),
  ])

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white">Learn</h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 font-serif italic">
            Evergreen guides and explainers to help you understand startups, funding, and venture capital.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/learn/${c.slug}`}
              className="group rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-5 hover:bg-white dark:hover:bg-white/10 transition-colors"
            >
              <h3 className="font-serif font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                {c.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{c.description || ''}</p>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">Latest articles</h2>
            <Link className="text-sm font-mono text-primary hover:opacity-80" href="/learn">
              Browse
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {latest.map((a) => (
              <Link
                key={a._id}
                href={a.category?.slug ? `/learn/${a.category.slug}/${a.slug}` : '/learn'}
                className="rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-5 hover:bg-white dark:hover:bg-white/10 transition-colors"
              >
                <div className="text-xs font-mono text-text-subtle dark:text-gray-500 uppercase tracking-widest">
                  {a.category?.title || ''}
                </div>
                <h3 className="mt-2 font-serif font-bold text-xl text-gray-900 dark:text-white">{a.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
