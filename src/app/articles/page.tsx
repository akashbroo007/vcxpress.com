import Link from 'next/link'
import Image from 'next/image'

import {sanityFetch} from '@/lib/sanity.client'
import {ARTICLES_LIST_QUERY} from '@/lib/sanity.queries'
import NewsletterForm from '@/components/NewsletterForm'
import Pagination from '@/components/Pagination'

import {safeSanityImageUrl} from '@/lib/sanity/image'

type ArticleListItem = {
  _id: string
  title: string
  slug: string
  summary: string
  publishedDate: string
  companyName: string
  fundingAmount: string
  fundingRound: string
  featuredImage?: unknown
  category?: {
    _id: string
    name: string
    slug: string
  } | null
}

const formatTime = (iso: string) => {
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
  } catch {
    return ''
  }
}

export default async function ArticlesPage({searchParams}: {searchParams?: Promise<{page?: string}>}) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params?.page ?? '1', 10))
  const articlesPerPage = 12
  const articles = await sanityFetch<ArticleListItem[]>(ARTICLES_LIST_QUERY, {}, {cache: 'no-store', tags: ['articles']})

  const totalPages = Math.max(1, Math.ceil(articles.length / articlesPerPage))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const paginatedArticles = articles.slice(startIndex, endIndex)

  return (
    <div className="theme-feed bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <main className="lg:col-span-8 flex flex-col gap-8">
            <div className="border-b-2 border-black dark:border-white pb-6 mb-2">
              <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2">Latest News</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-serif italic">
                Real-time updates from the world of business, finance, and technology.
              </p>
            </div>

            <div className="flex flex-col">
              {paginatedArticles.length === 0 ? (
                <div className="py-8">
                  <p className="text-gray-600 dark:text-gray-400">No articles yet.</p>
                </div>
              ) : (
                paginatedArticles.map((a) => (
                  <Link key={a._id} className="group block" href={`/news/${a.slug}`}>
                    <article className="flex flex-col sm:flex-row gap-6 py-8 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors -mx-4 px-4 rounded-lg">
                      <div className="sm:w-28 shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-1">
                        <time className="text-gray-900 dark:text-white font-medium text-lg leading-none">{formatTime(a.publishedDate)}</time>
                        <span className="text-gray-600 text-[11px] font-semibold tracking-wider uppercase bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                          {a.category?.name ?? 'Funding'}
                        </span>
                      </div>

                      <div className="flex-1 flex flex-col gap-3">
                        <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                          {a.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">{a.summary}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs font-semibold text-gray-500 group-hover:text-gray-700 flex items-center gap-1">
                            Read Analysis <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-400">{a.companyName}</span>
                        </div>
                      </div>

                      <div className="sm:w-40 shrink-0">
                        <div className="relative aspect-[4/3] w-full rounded overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-sm">
                          {(() => {
                            const imageUrl = safeSanityImageUrl(a.featuredImage, {width: 640, height: 480})

                            return imageUrl ? <Image alt={a.title} className="object-cover" fill sizes="160px" src={imageUrl} /> : <div className="absolute inset-0" />
                          })()}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))
              )}

              {totalPages > 1 && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <Pagination
                    currentPage={safePage}
                    totalPages={totalPages}
                    basePath="/news"
                    maxVisible={5}
                  />
                </div>
              )}
            </div>

          </main>

          <aside className="hidden lg:block lg:col-span-4 pl-8 border-l border-gray-200 dark:border-gray-800">
            <div className="sticky top-24 flex flex-col gap-10">
              <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-sm border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">mail</span>
                  <h4 className="font-serif font-semibold text-lg text-gray-800 dark:text-white uppercase tracking-wide">Daily Briefing</h4>
                </div>
                <p className="text-sm text-text-main dark:text-gray-300 mb-4 leading-relaxed font-medium">
                  Get the most important stories delivered to your inbox every morning.
                </p>
                <NewsletterForm
                  source="news_daily_briefing"
                  placeholder="work@email.com"
                  inputClassName="w-full px-3 py-2 text-sm border border-gray-300 bg-white rounded-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-400/20 outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white font-mono placeholder:text-gray-400"
                  buttonClassName="w-full bg-[#1a1a2e] hover:bg-[#252542] text-white text-sm font-semibold py-2 rounded-sm transition-colors uppercase tracking-widest font-mono disabled:opacity-70"
                />
                <p className="text-[10px] text-text-subtle dark:text-gray-500 mt-2">
                  By signing up, you agree to our Terms and Privacy Policy.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
