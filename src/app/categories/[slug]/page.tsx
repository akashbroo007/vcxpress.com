import Link from 'next/link'
import {notFound} from 'next/navigation'

import {sanityFetch} from '@/lib/sanity.client'
import {CATEGORY_BY_SLUG_WITH_ARTICLES_QUERY} from '@/lib/sanity.queries'
import LiveCategoryArticles from '@/components/LiveCategoryArticles'

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

type PageProps = {
  params: Promise<{slug: string}>
}

export default async function CategoryDetailPage({params}: PageProps) {
  const {slug} = await params

  const category = await sanityFetch<CategoryDetail | null>(
    CATEGORY_BY_SLUG_WITH_ARTICLES_QUERY,
    {slug},
    {revalidate: 300, useCdn: false, tags: ['articles', 'categories', `category:${slug}`]},
  )

  if (!category) notFound()

  return (
    <main className="theme-home bg-background-light dark:bg-background-dark text-text-main font-display antialiased min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <nav className="text-sm text-text-subtle dark:text-gray-400 font-mono uppercase tracking-wide">
          <Link className="hover:text-primary transition-colors" href="/categories">
            Categories
          </Link>
          <span className="mx-2 text-text-main/30 dark:text-white/30">/</span>
          <span className="text-text-main dark:text-white">{category.name}</span>
        </nav>

        <div className="mt-6 flex flex-col gap-3">
          <div className="w-10 h-[3px] bg-primary"></div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-text-main dark:text-white">{category.name}</h1>
          {category.description ? (
            <p className="text-text-subtle dark:text-gray-400 max-w-2xl leading-relaxed">{category.description}</p>
          ) : null}
        </div>

        <LiveCategoryArticles initialCategory={category} />
      </div>
    </main>
  )
}
