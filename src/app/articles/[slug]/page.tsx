import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'

import {sanityFetch} from '@/lib/sanity.client'
import {ARTICLE_BY_SLUG_QUERY, LATEST_NEWS_SIDEBAR_QUERY, NEWS_CONTINUOUS_FEED_ITEMS_QUERY, NEWS_RECOMMENDED_NEXT_QUERY} from '@/lib/sanity.queries'
import {safeSanityImageUrl} from '@/lib/sanity/image'
import ScrollProgressBar from '@/components/ScrollProgressBar'
import ContinuousArticleFeedClient from '@/components/ContinuousArticleFeedClient'

type ArticleDetail = {
  _id: string
  title: string
  slug: string
  summary: string
  body: unknown[]
  tags?: string[] | null
  companyName: string
  fundingAmount: string
  fundingRound: string
  publishedDate: string
  sourceURL: string
  featuredImage?: unknown
  seoTitle?: string | null
  seoDescription?: string | null
  categories?: Array<{
    _id: string
    name: string
    slug: string
  }>
  category?: {
    _id: string
    name: string
    slug: string
  } | null
}

type NewsRecommendedItem = {
  _id: string
  title: string
  slug: string
  summary: string
  publishedDate: string
  companyName: string
  fundingRound: string
  featuredImage?: unknown
  category?: {
    _id: string
    name: string
    slug: string
  } | null
}

type PageProps = {
  params: Promise<{slug: string}>
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {slug} = await params

  const article = await sanityFetch<ArticleDetail | null>(
    ARTICLE_BY_SLUG_QUERY,
    {slug},
    {cache: 'no-store', tags: ['articles', `article:${slug}`]},
  )

  if (!article) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const canonicalUrl = new URL(`/news/${article.slug}`, siteUrl)
  const ogImage = safeSanityImageUrl(article.featuredImage, {width: 1200, height: 630}) ?? undefined

  return {
    title: article.seoTitle || article.title,
    description: article.seoDescription || article.summary,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.summary,
      images: ogImage ? [{url: ogImage, width: 1200, height: 630, alt: article.title}] : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.summary,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function ArticleDetailPage({params}: PageProps) {
  const {slug} = await params

  const article = await sanityFetch<ArticleDetail | null>(
    ARTICLE_BY_SLUG_QUERY,
    {slug},
    {cache: 'no-store', tags: ['articles', `article:${slug}`]},
  )

  if (!article) notFound()

  const maxAdditional = 6
  const categoryId = article.category?._id

  const sameCategoryAdditional = categoryId
    ? await sanityFetch<ArticleDetail[]>(
        NEWS_CONTINUOUS_FEED_ITEMS_QUERY,
        {categoryId, currentId: article._id, limit: maxAdditional},
        {revalidate: 60, tags: ['articles', `article:${slug}`, 'continuous-feed']},
      )
    : []

  const missing = Math.max(0, maxAdditional - sameCategoryAdditional.length)
  const latestPool = missing
    ? await sanityFetch<ArticleDetail[]>(
        NEWS_CONTINUOUS_FEED_ITEMS_QUERY,
        {categoryId: null, currentId: article._id, limit: 10},
        {revalidate: 60, tags: ['articles', `article:${slug}`, 'continuous-feed']},
      )
    : []

  const alreadyIncluded = new Set<string>([article._id, ...sameCategoryAdditional.map((a) => a._id)])
  const latestFallback = latestPool.filter((a) => !alreadyIncluded.has(a._id)).slice(0, missing)

  const feedArticles = [article, ...sameCategoryAdditional, ...latestFallback].slice(0, 1 + maxAdditional)

  const latestSidebar = await sanityFetch<
    Array<{_id: string; title: string; slug: string; publishedDate: string; featuredImage?: unknown; category?: {name: string; slug: string} | null}>
  >(
    LATEST_NEWS_SIDEBAR_QUERY,
    {slug, limit: 5},
    {revalidate: 60, tags: ['articles', 'latest-news']},
  )

  const recommendedLimit = 4
  const recommended = article.category?._id
    ? await sanityFetch<NewsRecommendedItem[]>(
        NEWS_RECOMMENDED_NEXT_QUERY,
        {categoryId: article.category._id, currentId: article._id, limit: recommendedLimit},
        {revalidate: 60, tags: ['articles', `article:${slug}`, 'recommended']},
      )
    : await sanityFetch<NewsRecommendedItem[]>(
        LATEST_NEWS_SIDEBAR_QUERY,
        {slug, limit: recommendedLimit},
        {revalidate: 60, tags: ['articles', `article:${slug}`, 'recommended']},
      )

  return (
    <div className="theme-detail bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased">
      <div className="fixed top-0 left-0 right-0 z-[70] h-[2px] bg-gray-200 dark:bg-gray-800">
        <ScrollProgressBar className="h-full bg-primary" targetId="continuous-feed" />
      </div>
      <main className="w-full pb-20">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12" id="continuous-feed">
          <div className="flex items-center gap-2 mb-8 text-sm text-gray-500 dark:text-gray-400 font-mono uppercase tracking-wide">
            <Link className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors" href="/">
              Home
            </Link>
            <span className="text-gray-300 dark:text-gray-700">/</span>
            <Link className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors" href="/news">
              News
            </Link>
          </div>

          <ContinuousArticleFeedClient
            feedArticles={feedArticles}
            latestSidebar={latestSidebar}
            related={recommended}
          />
        </div>
      </main>
    </div>
  )
}
