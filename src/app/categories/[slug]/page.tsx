import Link from 'next/link'
import {notFound} from 'next/navigation'

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

type PageProps = {
  params: Promise<{slug: string}>
  searchParams?: Promise<{page?: string}>
}

export default async function CategoryDetailPage({params, searchParams}: PageProps) {
  const {slug} = await params
  const sp = await searchParams
  const currentPage = Math.max(1, Number.parseInt(sp?.page ?? '1', 10) || 1)
  const articlesPerPage = 12

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

        {(() => {
          const totalPages = Math.max(1, Math.ceil(category.articles.length / articlesPerPage))
          const safePage = Math.min(currentPage, totalPages)
          const startIndex = (safePage - 1) * articlesPerPage
          const endIndex = startIndex + articlesPerPage
          const paginatedArticles = category.articles.slice(startIndex, endIndex)

          return (
            <section className="mt-10">
              <div className="flex items-center justify-between pb-4 border-b border-black dark:border-white">
                <div className="flex flex-col gap-1">
                  <div className="w-8 h-[3px] bg-primary mb-1"></div>
                  <h2 className="font-serif text-2xl font-bold text-text-main dark:text-white">Latest in {category.name}</h2>
                </div>
              </div>

              {paginatedArticles.length === 0 ? (
                <div className="mt-6 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 text-text-main/70 dark:text-white/70">
                  No articles in this category yet.
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedArticles.map((a) => (
                    <Link
                      key={a._id}
                      className="group rounded-xl border border-black/10 dark:border-white/10 bg-surface-light dark:bg-surface-dark p-6 hover:border-primary/40 dark:hover:border-primary/40 hover:shadow-sm transition-all"
                      href={`/news/${a.slug}`}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-xs font-bold text-primary uppercase tracking-widest font-mono">
                          {a.publishedDate
                            ? new Date(a.publishedDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})
                            : ''}
                        </div>
                        <span className="material-symbols-outlined text-text-main/40 dark:text-white/40 group-hover:text-primary transition-colors">
                          arrow_forward
                        </span>
                      </div>
                      <h3 className="mt-3 font-serif text-xl font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">
                        {a.title}
                      </h3>
                      <p className="mt-2 text-sm text-text-subtle dark:text-gray-400 leading-relaxed line-clamp-3">{a.summary}</p>
                    </Link>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6 pt-6 border-t border-black/10 dark:border-white/10">
                  {safePage > 1 && (
                    <Link
                      href={`/categories/${encodeURIComponent(category.slug)}?page=${safePage - 1}`}
                      className="px-3 py-1.5 text-sm font-mono text-text-main hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  {Array.from({length: totalPages}, (_, i) => i + 1).map((pageNum) => (
                    <Link
                      key={pageNum}
                      href={`/categories/${encodeURIComponent(category.slug)}?page=${pageNum}`}
                      className={`px-3 py-1.5 text-sm font-mono transition-colors ${
                        pageNum === safePage
                          ? 'bg-[#1a1a2e] text-white rounded-sm'
                          : 'text-text-main hover:text-gray-700 dark:text-white dark:hover:text-gray-300'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  ))}
                  {safePage < totalPages && (
                    <Link
                      href={`/categories/${encodeURIComponent(category.slug)}?page=${safePage + 1}`}
                      className="px-3 py-1.5 text-sm font-mono text-text-main hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </section>
          )
        })()}
      </div>
    </main>
  )
}
