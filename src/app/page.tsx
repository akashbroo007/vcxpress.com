import Link from 'next/link'
import Image from 'next/image'
import {Suspense} from 'react'

import {sanityFetch} from '@/lib/sanity.client'
import {
  LATEST_FEATURED_ARTICLE_QUERY,
  LATEST_NEWS_EXCLUDING_FEATURED_QUERY,
} from '@/lib/sanity.queries'
import {safeSanityImageUrl} from '@/lib/sanity/image'
import NewsletterForm from '@/components/NewsletterForm'
import Pagination from '@/components/Pagination'
import LiveWireTimeline from '@/components/LiveWireTimeline'
import HomepageLiveFeed from '@/components/HomepageLiveFeed'
import {HeroSectionSkeleton} from '@/components/ui/skeleton'

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

/**
 * ISR Configuration
 * - revalidate: 300 = 5 minutes (reduces API calls vs no-store)
 * - Tags enable on-demand revalidation via webhooks
 * - CDN is always enabled (configured in sanity.client.ts)
 */
export const revalidate = 300 // 5 minutes

export default async function Home({searchParams}: {searchParams?: Promise<{page?: string}>}) {
  return (
    <Suspense fallback={<HeroSectionSkeleton />}>
      <HomeContent searchParams={searchParams} />
    </Suspense>
  )
}

async function HomeContent({searchParams}: {searchParams?: Promise<{page?: string}>}) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params?.page ?? '1', 10))
  const storiesPerPage = 10

  // Fetch featured article (ISR + CDN)
  const featured = await sanityFetch<ArticleListItem | null>(
    LATEST_FEATURED_ARTICLE_QUERY,
    {},
    {
      revalidate: 300, // 5 minutes
      tags: ['articles', 'featured'],
    },
  )

  // Fetch latest news (ISR + CDN)
  const latest = await sanityFetch<ArticleListItem[]>(
    LATEST_NEWS_EXCLUDING_FEATURED_QUERY,
    {featuredId: featured?._id ?? '', limit: 100},
    {
      revalidate: 300, // 5 minutes
      tags: ['articles'],
    },
  )

  const totalPages = Math.ceil(latest.length / storiesPerPage)
  const liveWireCount = currentPage === totalPages ? 8 : 15
  const startIndex = (currentPage - 1) * storiesPerPage
  const endIndex = startIndex + storiesPerPage
  const paginatedStories = latest.slice(startIndex, endIndex)

  // Prepare data for client-side SWR (only the first 5 for sidebar)
  const initialLatestForSWR = latest.slice(0, 5).map((a) => ({
    _id: a._id,
    title: a.title,
    slug: a.slug,
    publishedDate: a.publishedDate,
    category: a.category,
  }))

  return (
    <div className="theme-home bg-background-light dark:bg-background-dark text-text-main dark:text-white font-display antialiased min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Live Feed with SWR - Client Component */}
          <HomepageLiveFeed
            initialFeatured={featured}
            initialLatest={initialLatestForSWR}
          />

          <div className="w-full h-px bg-gray-200 dark:bg-gray-800 mb-12"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 flex flex-col gap-9">
              <div className="flex items-center justify-between pb-4 border-b border-black dark:border-white">
                <div className="flex flex-col gap-1">
                  <div className="w-8 h-[2px] bg-gray-300 dark:bg-gray-600 mb-1"></div>
                  <h3 className="font-serif text-2xl font-bold text-text-main dark:text-white">
                    Featured Stories
                  </h3>
                </div>
                <Link
                  className="text-xs font-semibold text-primary hover:underline uppercase tracking-widest font-mono"
                  href="/news"
                >
                  View All
                </Link>
              </div>

              {paginatedStories.map((a, idx) => (
                <div key={a._id}>
                  <Link className="block group" href={`/news/${a.slug}`}>
                    <article className="flex flex-col sm:flex-row gap-6">
                      <div className="relative w-full sm:w-64 aspect-[4/3] sm:aspect-video bg-gray-100 dark:bg-gray-800 rounded-sm overflow-hidden flex-shrink-0">
                        {(() => {
                          const imageUrl = safeSanityImageUrl(a.featuredImage, {
                            width: 800,
                            height: 600,
                          })

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
                          <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold font-mono uppercase tracking-widest">
                            {a.category?.name ?? ''}
                          </span>
                          <span className="text-xs text-text-subtle dark:text-gray-500 font-mono">
                            {a.category?.name ? '| ' : ''}
                          </span>
                        </div>
                        <h4 className="font-serif text-xl font-bold text-text-main dark:text-white leading-tight group-hover:text-primary group-hover:underline group-hover:decoration-[0.15em] group-hover:underline-offset-[0.12em] group-hover:decoration-primary transition-colors">
                          {a.title}
                        </h4>
                        <p className="text-text-subtle dark:text-gray-400 text-sm leading-relaxed line-clamp-2">
                          {a.summary}
                        </p>
                      </div>
                    </article>
                  </Link>
                  {idx < paginatedStories.length - 1 ? (
                    <div className="w-full h-px bg-gray-200 dark:bg-gray-800"></div>
                  ) : null}
                </div>
              ))}

              {totalPages > 1 && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    basePath="/"
                    maxVisible={5}
                  />
                </div>
              )}
            </div>

            <div className="lg:col-span-4 pl-0 lg:pl-6 lg:border-l border-gray-200 dark:border-gray-800">
              <div className="lg:sticky lg:top-24">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b-2 border-gray-300 dark:border-gray-600 w-fit">
                  <span className="material-symbols-outlined text-gray-500 dark:text-gray-400">
                    flash_on
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-gray-800 dark:text-white uppercase tracking-wider">
                    Live Wire
                  </h3>
                </div>
                <LiveWireTimeline articles={latest} count={liveWireCount} />
                <div className="mt-8 p-4 bg-white dark:bg-white/5 rounded-lg border border-gray-100 dark:border-white/10 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-sm text-gray-500 dark:text-gray-400">
                      mail
                    </span>
                    <h4 className="font-serif font-semibold text-sm text-gray-800 dark:text-white uppercase tracking-wide">
                      Daily Briefing
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                    Get the intelligence you need. Delivered every morning.
                  </p>
                  <NewsletterForm
                    source="homepage_daily_briefing"
                    turnstileScale={0.85}
                    inputClassName="w-full px-3 py-2 text-xs border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none dark:text-white placeholder:text-gray-400"
                    buttonClassName="w-full bg-[#1a1a2e] hover:bg-[#252542] text-white text-xs font-semibold py-2 rounded-md transition-colors uppercase tracking-widest disabled:opacity-70"
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
