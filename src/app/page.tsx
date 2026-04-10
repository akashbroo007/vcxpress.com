import Link from 'next/link'
import Image from 'next/image'

import {sanityFetch} from '@/lib/sanity.client'
import {LATEST_FEATURED_ARTICLE_QUERY, LATEST_NEWS_EXCLUDING_FEATURED_QUERY} from '@/lib/sanity.queries'
import {safeSanityImageUrl} from '@/lib/sanity/image'
import NewsletterForm from '@/components/NewsletterForm'

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

export default async function Home({searchParams}: {searchParams?: Promise<{page?: string}>}) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params?.page ?? '1', 10))
  const storiesPerPage = 10

  const featured = await sanityFetch<ArticleListItem | null>(LATEST_FEATURED_ARTICLE_QUERY, {}, {revalidate: 60, useCdn: false, tags: ['articles']})

  const latest = await sanityFetch<ArticleListItem[]>(
    LATEST_NEWS_EXCLUDING_FEATURED_QUERY,
    {featuredId: featured?._id ?? '', limit: 100},
    {revalidate: 60, useCdn: false, tags: ['articles']},
  )

  const totalPages = Math.ceil(latest.length / storiesPerPage)
  const liveWireCount = currentPage === totalPages ? 8 : 15
  const startIndex = (currentPage - 1) * storiesPerPage
  const endIndex = startIndex + storiesPerPage
  const paginatedStories = latest.slice(startIndex, endIndex)

  return (
    <div className="theme-home bg-background-light dark:bg-background-dark text-text-main font-display antialiased min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {featured?.slug ? (
                <Link className="lg:col-span-8 group block" href={`/news/${featured.slug}`}>
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800 mb-6">
                    {(() => {
                      const imageUrl = safeSanityImageUrl(featured.featuredImage, {width: 1200, height: 675})

                      return imageUrl ? (
                        <Image
                          alt={featured.title}
                          className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 66vw"
                          src={imageUrl}
                        />
                      ) : (
                        <div className="absolute inset-0" />
                      )
                    })()}
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="x-line"></div>
                    <span className="text-gray-500 font-semibold text-xs font-mono tracking-widest uppercase mb-1">
                      {featured?.category?.name ?? ''}
                    </span>
                    <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-text-main dark:text-white group-hover:text-primary transition-colors">
                      {featured?.title ?? ''}
                    </h2>
                    <p className="text-lg md:text-xl text-text-subtle dark:text-gray-400 max-w-3xl leading-relaxed mt-2 font-light">
                      {featured?.summary ?? ''}
                    </p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-text-subtle dark:text-gray-500 font-mono uppercase tracking-wide">
                      <span className="text-text-main font-bold dark:text-gray-300">{featured?.companyName ? `By ${featured.companyName}` : ''}</span>
                      <span className="text-gray-300">{featured?.companyName ? '|' : ''}</span>
                      <span>
                        {featured?.publishedDate ? new Date(featured.publishedDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'}) : ''}
                      </span>
                      <span className="text-gray-300">{featured?.publishedDate ? '|' : ''}</span>
                      <span></span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="lg:col-span-8">
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800 mb-6"></div>
                </div>
              )}
              <div className="lg:col-span-4 flex flex-col gap-6 lg:pl-8 lg:border-l border-gray-200 dark:border-gray-800">
                <div className="flex flex-col gap-2">
                  <div className="w-10 h-[2px] bg-gray-300"></div>
                  <h3 className="font-serif text-xl font-bold text-text-main dark:text-white">Latest News</h3>
                </div>

                {[0, 1, 2, 3, 4].map((idx) => {
                  const a = latest[idx]

                  return (
                    <div key={a?._id ?? `hero-stack-${idx}`}>
                      {a?.slug ? (
                        <Link className="flex flex-col gap-2 group" href={`/news/${a.slug}`}>
                          <div className="w-8 h-[1px] bg-gray-300 mb-1"></div>
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">{a?.category?.name ?? ''}</span>
                          <h3 className="font-serif text-xl font-bold text-text-main dark:text-white leading-snug group-hover:text-primary transition-colors">
                            {a?.title ?? ''}
                          </h3>
                          <span className="text-xs text-text-subtle mt-1 font-mono uppercase">
                            {a?.publishedDate
                              ? new Date(a.publishedDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})
                              : ''}
                          </span>
                        </Link>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div className="w-8 h-[1px] bg-gray-300 mb-1"></div>
                          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">{a?.category?.name ?? ''}</span>
                          <h3 className="font-serif text-xl font-bold text-text-main dark:text-white leading-snug transition-colors">{a?.title ?? ''}</h3>
                          <span className="text-xs text-text-subtle mt-1 font-mono uppercase">
                            {a?.publishedDate
                              ? new Date(a.publishedDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})
                              : ''}
                          </span>
                        </div>
                      )}
                      {idx !== 4 ? <div className="w-full h-px bg-gray-200 dark:bg-gray-800"></div> : null}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
          <div className="w-full h-px bg-gray-200 dark:bg-gray-800 mb-12"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 flex flex-col gap-9">
              <div className="flex items-center justify-between pb-4 border-b border-black dark:border-white">
                <div className="flex flex-col gap-1">
                  <div className="w-8 h-[2px] bg-gray-300 mb-1"></div>
                  <h3 className="font-serif text-2xl font-bold text-text-main dark:text-white">Featured Stories</h3>
                </div>
                <Link className="text-xs font-semibold text-primary hover:underline uppercase tracking-widest font-mono" href="/news">
                  View All
                </Link>
              </div>

              {paginatedStories.map((a, idx) => (
                <div key={a._id}>
                  <Link className="block group" href={`/news/${a.slug}`}>
                    <article className="flex flex-col sm:flex-row gap-6">
                      <div className="relative w-full sm:w-64 aspect-[4/3] sm:aspect-video bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                        {(() => {
                          const imageUrl = safeSanityImageUrl(a.featuredImage, {width: 800, height: 600})

                          return imageUrl ? (
                            <Image
                              alt={a.title}
                              className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                              fill
                              sizes="(max-width: 640px) 100vw, 256px"
                              src={imageUrl}
                            />
                          ) : (
                            <div className="absolute inset-0" />
                          )
                        })()}
                      </div>
                      <div className="flex flex-col justify-center gap-2">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 text-xs font-semibold font-mono uppercase tracking-widest">{a.category?.name ?? ''}</span>
                          <span className="text-xs text-text-subtle font-mono">{a.category?.name ? '| ' : ''}</span>
                        </div>
                        <h4 className="font-serif text-xl font-bold text-text-main dark:text-white leading-tight group-hover:text-primary transition-colors">
                          {a.title}
                        </h4>
                        <p className="text-text-subtle dark:text-gray-400 text-sm leading-relaxed line-clamp-2">{a.summary}</p>
                      </div>
                    </article>
                  </Link>
                  {idx < paginatedStories.length - 1 ? (
                    <div className="w-full h-px bg-gray-200 dark:bg-gray-800"></div>
                  ) : null}
                </div>
              ))}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                  {currentPage > 1 && (
                    <Link
                      href={`/?page=${currentPage - 1}`}
                      className="px-3 py-1.5 text-sm font-mono text-text-main hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors"
                    >
                      Previous
                    </Link>
                  )}
                  {(() => {
                    const pages = []
                    const maxVisible = 5
                    for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) {
                      pages.push(i)
                    }
                    return pages.map((pageNum) => (
                      <Link
                        key={pageNum}
                        href={`/?page=${pageNum}`}
                        className={`px-3 py-1.5 text-sm font-mono transition-colors ${
                          pageNum === currentPage
                            ? 'bg-[#1a1a2e] text-white rounded-sm'
                            : 'text-text-main hover:text-gray-700 dark:text-white dark:hover:text-gray-300'
                        }`}
                      >
                        {pageNum}
                      </Link>
                    ))
                  })()}
                  {totalPages > 5 && (
                    <span className="px-1 text-text-subtle dark:text-gray-400 font-mono">...</span>
                  )}
                  {currentPage < totalPages && (
                    <Link
                      href={`/?page=${currentPage + 1}`}
                      className="px-3 py-1.5 text-sm font-mono text-text-main hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors"
                    >
                      Next
                    </Link>
                  )}
                </div>
              )}
            </div>
            <div className="lg:col-span-4 pl-0 lg:pl-6 lg:border-l border-gray-200 dark:border-gray-800">
              <div className="sticky top-24">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b-2 border-gray-300 w-fit">
                  <span className="material-symbols-outlined text-gray-500">flash_on</span>
                  <h3 className="font-serif text-lg font-semibold text-gray-800 dark:text-white uppercase tracking-wider">Live Wire</h3>
                </div>
                <div className="flex flex-col gap-6 relative">
                  <div className="absolute left-[5px] top-2 bottom-2 w-px bg-gray-200 dark:bg-gray-800"></div>
                  {latest.slice(0, liveWireCount).map((a, idx) => (
                    <div key={a._id} className="flex gap-4 relative">
                      <div
                        className={
                          idx === 0
                            ? 'w-2.5 h-2.5 rounded-full bg-gray-400 mt-1.5 flex-shrink-0 relative z-10 ring-4 ring-white dark:ring-background-dark'
                            : 'w-2.5 h-2.5 rounded-full bg-gray-200 mt-1.5 flex-shrink-0 relative z-10 ring-4 ring-white dark:ring-background-dark'
                        }
                      ></div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-bold text-text-subtle font-mono">
                          {a.publishedDate
                            ? new Date(a.publishedDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})
                            : ''}
                        </span>
                        <Link
                          className={
                            idx === 0
                              ? 'font-bold text-text-main dark:text-white hover:text-primary leading-snug font-serif'
                              : 'font-medium text-text-main dark:text-white hover:text-primary leading-snug font-serif'
                          }
                          href={`/news/${a.slug}`}
                        >
                          {a.title}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-10 p-5 pb-0 bg-gray-50 rounded-sm border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-gray-600">mail</span>
                    <h4 className="font-serif font-semibold text-lg text-gray-800 uppercase tracking-wide">Daily Briefing</h4>
                  </div>
                  <p className="text-sm text-text-main dark:text-gray-300 mb-4 leading-relaxed font-medium">
                    Get the intelligence you need. Delivered every morning.
                  </p>
                  <NewsletterForm
                    source="homepage_daily_briefing"
                    turnstileScale={0.9}
                    inputClassName="w-full px-2.5 py-1.5 text-xs border border-gray-200 bg-white rounded-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white font-mono placeholder:text-gray-400"
                    buttonClassName="w-full bg-[#1a1a2e] hover:bg-[#252542] text-white text-xs font-semibold py-1.5 rounded-sm transition-colors uppercase tracking-widest font-mono disabled:opacity-70"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
