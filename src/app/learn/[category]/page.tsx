import Link from 'next/link'
import {notFound} from 'next/navigation'

import {sanityFetch} from '@/lib/sanity.client'
import {LEARN_CATEGORIES_LIST_QUERY, LEARN_CATEGORY_ARTICLES_QUERY} from '@/lib/sanity.queries'

type LearnCategory = {
  _id: string
  title: string
  slug: string
  description?: string | null
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

type PageProps = {
  params: Promise<{category: string}>
}

export default async function LearnCategoryPage({params}: PageProps) {
  const {category} = await params

  const categories = await sanityFetch<LearnCategory[]>(
    LEARN_CATEGORIES_LIST_QUERY,
    {},
    {revalidate: 300, useCdn: false, tags: ['learn']},
  )

  const meta = categories.find((c) => c.slug === category)
  if (!meta) notFound()

  const items = await sanityFetch<LearnListItem[]>(
    LEARN_CATEGORY_ARTICLES_QUERY,
    {categorySlug: category},
    {revalidate: 300, useCdn: false, tags: ['learn', `learn:${category}`]},
  )

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
        <div className="mb-10">
          <Link className="text-sm font-mono text-primary hover:opacity-80" href="/learn">
            ← Back to Learn
          </Link>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-gray-900 dark:text-white">{meta.title}</h1>
          <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 font-serif italic">{meta.description || ''}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((a) => (
            <Link
              key={a._id}
              href={`/learn/${category}/${a.slug}`}
              className="rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/5 p-5 hover:bg-white dark:hover:bg-white/10 transition-colors"
            >
              <h3 className="font-serif font-bold text-xl text-gray-900 dark:text-white">{a.title}</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{a.summary}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
