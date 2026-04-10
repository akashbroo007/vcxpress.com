import Link from 'next/link'

import {sanityFetch} from '@/lib/sanity.client'
import {CATEGORIES_PAGED_QUERY} from '@/lib/sanity.queries'

type CategoryListItem = {
  _id: string
  name: string
  slug: string
  description?: string | null
}

type PagedCategories = {
  total: number
  items: CategoryListItem[]
}

type PageProps = {
  searchParams: Promise<{page?: string}>
}

const getCompactPages = (current: number, totalPages: number) => {
  const set = new Set<number>()

  set.add(1)
  set.add(totalPages)

  for (let i = current - 2; i <= current + 2; i += 1) {
    if (i >= 1 && i <= totalPages) set.add(i)
  }

  // Keep first/last neighborhoods visible
  for (let i = 1; i <= 2; i += 1) {
    set.add(i)
    set.add(totalPages - (i - 1))
  }

  return Array.from(set).sort((a, b) => a - b)
}

export default async function CategoriesPage({searchParams}: PageProps) {
  const {page} = await searchParams
  const pageSize = 15
  const currentPage = Math.max(1, Number.parseInt(page ?? '1', 10) || 1)
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize

  const data = await sanityFetch<PagedCategories>(
    CATEGORIES_PAGED_QUERY,
    {start, end},
    {revalidate: 300, useCdn: false, tags: ['categories']},
  )

  const categories = Array.isArray(data?.items) ? data.items : []
  const total = typeof data?.total === 'number' ? data.total : 0
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const prevPage = safePage > 1 ? safePage - 1 : null
  const nextPage = safePage < totalPages ? safePage + 1 : null
  const compactPages = getCompactPages(safePage, totalPages)

  return (
    <main className="theme-home bg-background-light dark:bg-background-dark text-text-main font-display antialiased min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col gap-2 mb-10">
          <div className="w-10 h-[2px] bg-gray-300"></div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-main dark:text-white">Categories</h1>
          <p className="text-text-subtle dark:text-gray-400 max-w-2xl">
            Browse all topics. Any category you create in Studio will automatically appear here.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 text-text-main/70 dark:text-white/70">
            No categories yet.
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((c) => (
                <Link
                  key={c._id}
                  className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark p-6 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-sm transition-all"
                  href={`/categories/${c.slug}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">
                        {c.slug}
                      </div>
                      <h2 className="mt-2 font-serif text-xl font-semibold text-text-main dark:text-white group-hover:text-primary transition-colors">
                        {c.name}
                      </h2>
                    </div>
                    <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors">
                      arrow_forward
                    </span>
                  </div>
                  {c.description ? (
                    <p className="mt-3 text-sm text-text-subtle dark:text-gray-400 leading-relaxed line-clamp-3">{c.description}</p>
                  ) : (
                    <p className="mt-3 text-sm text-text-subtle dark:text-gray-400 leading-relaxed">
                      View latest articles in this category.
                    </p>
                  )}
                </Link>
              ))}
            </div>

            {totalPages > 1 ? (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-xs font-mono uppercase tracking-wide text-text-subtle dark:text-gray-400">
                  Page {safePage} of {totalPages}
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    className={`px-3 py-2 rounded border border-gray-200 dark:border-gray-700 text-sm font-mono transition-colors ${
                      prevPage
                        ? 'bg-surface-light dark:bg-surface-dark hover:border-gray-400'
                        : 'opacity-40 pointer-events-none'
                    }`}
                    href={prevPage ? `/categories?page=${prevPage}` : '/categories'}
                  >
                    Prev
                  </Link>

                  {compactPages.map((p, idx) => {
                    const prev = idx > 0 ? compactPages[idx - 1] : null
                    const active = p === safePage

                    return (
                      <div key={p} className="flex items-center gap-2">
                        {prev !== null && p - prev > 1 ? (
                          <span className="px-1 text-text-subtle dark:text-gray-400 font-mono">…</span>
                        ) : null}
                        <Link
                          className={`h-10 w-10 inline-flex items-center justify-center rounded border text-sm font-mono transition-colors ${
                            active
                              ? 'border-[#1a1a2e] bg-[#1a1a2e] text-white'
                              : 'border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark hover:border-gray-400'
                          }`}
                          href={`/categories?page=${p}`}
                        >
                          {p}
                        </Link>
                      </div>
                    )
                  })}

                  <Link
                    className={`px-3 py-2 rounded border border-gray-200 dark:border-gray-700 text-sm font-mono transition-colors ${
                      nextPage
                        ? 'bg-surface-light dark:bg-surface-dark hover:border-gray-400'
                        : 'opacity-40 pointer-events-none'
                    }`}
                    href={nextPage ? `/categories?page=${nextPage}` : '/categories'}
                  >
                    Next
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </main>
  )
}
