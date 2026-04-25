'use client'

import Link from 'next/link'
import Image from 'next/image'

import {safeSanityImageUrl} from '@/lib/sanity/image'
import {useSanityArticlesList} from '@/lib/sanity.swr'
import {ARTICLES_LIST_QUERY} from '@/lib/sanity.queries'

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

type ArticlesSWRListProps = {
  /** Initial data from SSR to avoid loading state */
  initialArticles?: ArticleListItem[]
  /** Number of articles to show */
  limit?: number
  /** Custom refresh interval in ms (default: 60000) */
  refreshInterval?: number
  /** Optional className for styling */
  className?: string
}

/**
 * Real-time article list using SWR
 * Features:
 * - Displays initial data immediately (no loading flash)
 * - Polls for updates every 60s (configurable)
 * - Shows stale data while fetching updates
 * - Deduplicates requests across components
 */
export default function ArticlesSWRList({
  initialArticles = [],
  limit = 100,
  refreshInterval = 60000,
  className = '',
}: ArticlesSWRListProps) {
  const {data, isValidating} = useSanityArticlesList<ArticleListItem[]>(
    ARTICLES_LIST_QUERY,
    {limit},
    {
      refreshInterval,
      fallbackData: initialArticles,
    },
  )

  const displayArticles: ArticleListItem[] = data || initialArticles

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso)
      return d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    } catch {
      return ''
    }
  }

  if (displayArticles.length === 0) {
    return (
      <div className="py-8">
        <p className="text-gray-600 dark:text-gray-400">No articles yet.</p>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Subtle refresh indicator */}
      {isValidating && (
        <div className="absolute top-0 right-0 p-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" title="Refreshing..." />
        </div>
      )}

      {displayArticles.map((a: ArticleListItem) => (
        <Link key={a._id} className="group block" href={`/news/${a.slug}`}>
          <article className="flex flex-col sm:flex-row gap-6 py-8 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors -mx-4 px-4 rounded-lg">
            <div className="sm:w-28 shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-1">
              <time className="text-gray-900 dark:text-white font-medium text-lg leading-none">
                {formatTime(a.publishedDate)}
              </time>
              <span className="text-gray-600 text-[11px] font-semibold tracking-wider uppercase bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                {a.category?.name ?? 'Funding'}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                {a.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">
                {a.summary}
              </p>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 flex items-center gap-1">
                  Read Analysis{' '}
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{a.companyName}</span>
              </div>
            </div>

            <div className="sm:w-40 shrink-0">
              <div className="relative aspect-[4/3] w-full rounded overflow-hidden bg-gray-200 dark:bg-gray-700 shadow-sm">
                {(() => {
                  const imageUrl = safeSanityImageUrl(a.featuredImage, {width: 640, height: 480})
                  return imageUrl ? (
                    <Image
                      alt={a.title}
                      className="object-cover"
                      fill
                      sizes="160px"
                      src={imageUrl}
                    />
                  ) : (
                    <div className="absolute inset-0" />
                  )
                })()}
              </div>
            </div>
          </article>
        </Link>
      ))}
    </div>
  )
}
