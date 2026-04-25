'use client'

import Link from 'next/link'
import Image from 'next/image'

import {safeSanityImageUrl} from '@/lib/sanity/image'
import {
  useSanityQuery,
  useSanityArticlesList,
} from '@/lib/sanity.swr'
import {
  LATEST_FEATURED_ARTICLE_QUERY,
  LATEST_NEWS_EXCLUDING_FEATURED_QUERY,
} from '@/lib/sanity.queries'

// Types

type FeaturedArticle = {
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

type LatestArticle = {
  _id: string
  title: string
  slug: string
  publishedDate: string
  category?: {
    _id: string
    name: string
    slug: string
  } | null
}

// Props with initial data from server
interface HomepageLiveFeedProps {
  initialFeatured: FeaturedArticle | null
  initialLatest: LatestArticle[]
}

/**
 * Homepage Live Feed Component
 * Uses SWR for real-time updates while showing initial SSR data immediately
 *
 * Architecture:
 * - Server renders initial data (no loading flash)
 * - SWR takes over client-side with 60s polling
 * - Updates appear seamlessly without page reload
 */
export default function HomepageLiveFeed({
  initialFeatured,
  initialLatest,
}: HomepageLiveFeedProps) {
  // Fetch featured article (low frequency updates)
  const {data: featured} = useSanityQuery<FeaturedArticle | null>(
    LATEST_FEATURED_ARTICLE_QUERY,
    {},
    {
      fallbackData: initialFeatured,
      refreshInterval: 60000, // 60s for featured
    },
  )

  // Fetch latest news (higher frequency, excludes featured)
  const {data: latest} = useSanityArticlesList<LatestArticle[]>(
    LATEST_NEWS_EXCLUDING_FEATURED_QUERY,
    {featuredId: featured?._id ?? initialFeatured?._id ?? '', limit: 20},
    {
      fallbackData: initialLatest,
      refreshInterval: 60000, // 60s for latest
    },
  )

  const displayFeatured: FeaturedArticle | null = featured || initialFeatured
  const displayLatest: LatestArticle[] = latest || initialLatest

  return (
    <>
      {/* Hero Section */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {displayFeatured?.slug ? (
            <Link className="lg:col-span-8 group block" href={`/news/${displayFeatured.slug}`}>
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800 mb-6">
                {(() => {
                  const imageUrl = safeSanityImageUrl(displayFeatured.featuredImage, {
                    width: 1200,
                    height: 675,
                  })

                  return imageUrl ? (
                    <Image
                      alt={displayFeatured.title}
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
                <span className="text-gray-500 dark:text-gray-400 font-semibold text-xs font-mono tracking-widest uppercase mb-1">
                  {displayFeatured?.category?.name ?? ''}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-text-main dark:text-white group-hover:text-primary group-hover:underline group-hover:decoration-[0.15em] group-hover:underline-offset-[0.12em] group-hover:decoration-primary transition-colors">
                  {displayFeatured?.title ?? ''}
                </h2>
                <p className="text-lg md:text-xl text-text-subtle/80 dark:text-gray-300 max-w-3xl leading-relaxed mt-2 font-light">
                  {displayFeatured?.summary ?? ''}
                </p>
                <div className="flex items-center gap-4 mt-3 text-xs text-text-subtle dark:text-gray-500 font-mono uppercase tracking-wide">
                  <span className="text-text-main font-bold dark:text-gray-300">
                    {displayFeatured?.companyName ? `By ${displayFeatured.companyName}` : ''}
                  </span>
                  <span className="text-gray-300 dark:text-gray-600">
                    {displayFeatured?.companyName ? '|' : ''}
                  </span>
                  <span>
                    {displayFeatured?.publishedDate
                      ? new Date(displayFeatured.publishedDate).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : ''}
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="lg:col-span-8">
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-800 mb-6" />
            </div>
          )}

          {/* Latest News Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:pl-8 lg:border-l border-gray-200 dark:border-gray-800">
            <div className="flex flex-col gap-2">
              <div className="w-10 h-[2px] bg-gray-300 dark:bg-gray-600"></div>
              <h3 className="font-serif text-xl font-bold text-text-main dark:text-white">
                Latest News
              </h3>
            </div>

            {[0, 1, 2, 3, 4].map((idx) => {
              const a: LatestArticle | undefined = displayLatest[idx]

              return (
                <div key={a?._id ?? `hero-stack-${idx}`}>
                  {a?.slug ? (
                    <Link className="flex flex-col gap-2 group" href={`/news/${a.slug}`}>
                      <div className="w-8 h-[1px] bg-gray-300 dark:bg-gray-600 mb-1"></div>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest font-mono">
                        {a?.category?.name ?? ''}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-text-main dark:text-white leading-snug group-hover:text-primary group-hover:underline group-hover:decoration-[0.15em] group-hover:underline-offset-[0.12em] group-hover:decoration-primary transition-colors">
                        {a?.title ?? ''}
                      </h3>
                      <span className="text-xs text-text-subtle dark:text-gray-500 mt-1 font-mono uppercase">
                        {a?.publishedDate
                          ? new Date(a.publishedDate).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : ''}
                      </span>
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <div className="w-8 h-[1px] bg-gray-300 dark:bg-gray-600 mb-1"></div>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest font-mono">
                        {a?.category?.name ?? ''}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-text-main dark:text-white leading-snug transition-colors">
                        {a?.title ?? ''}
                      </h3>
                    </div>
                  )}
                  {idx !== 4 ? <div className="w-full h-px bg-gray-200 dark:bg-gray-800"></div> : null}
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
