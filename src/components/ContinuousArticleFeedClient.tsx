'use client'

import {useEffect, useMemo, useRef, useState} from 'react'

import Link from 'next/link'
import Image from 'next/image'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {PortableTextBlock} from '@portabletext/types'

import {safeSanityImageUrl} from '@/lib/sanity/image'
import ArticleActionButtons from '@/components/ArticleActionButtons'
import NewsletterForm from '@/components/NewsletterForm'

const isValidHttpUrl = (value: string | undefined): boolean => {
  if (!value) return false
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const portableTextComponents: PortableTextComponents = {
  block: {
    blockquote: ({children}) => (
      <blockquote className="my-8 border-l-2 border-gray-300 dark:border-gray-700 pl-6 text-gray-700 dark:text-gray-300 italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({children, value}) => {
      const href = typeof value?.href === 'string' ? value.href : undefined
      if (!href || !isValidHttpUrl(href)) return <>{children}</>
      return (
        <a className="text-primary underline hover:opacity-80" href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    },
  },
}

type CategoryRef = {
  _id: string
  name: string
  slug: string
}

export type ContinuousFeedArticle = {
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
  category?: CategoryRef | null
}

export type LatestSidebarItem = {
  _id: string
  title: string
  slug: string
  publishedDate: string
  featuredImage?: unknown
  category?: {name: string; slug: string} | null
}

export type RelatedItem = {
  _id: string
  title: string
  slug: string
  summary: string
  publishedDate: string
  companyName: string
  fundingRound: string
  featuredImage?: unknown
  category?: {name: string; slug: string} | null
}

type Props = {
  feedArticles: ContinuousFeedArticle[]
  latestSidebar: LatestSidebarItem[]
  related: RelatedItem[]
}

function formatDate(value: string | undefined): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, {day: '2-digit', month: 'short', year: 'numeric'})
}

export default function ContinuousArticleFeedClient({
  feedArticles,
  latestSidebar,
  related,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const relatedRowRef = useRef<HTMLDivElement | null>(null)
  const [activeSlug, setActiveSlug] = useState(feedArticles[0]?.slug ?? '')

  const slugToId = useMemo(() => {
    const map = new Map<string, string>()
    for (const a of feedArticles) map.set(a.slug, a._id)
    return map
  }, [feedArticles])

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => {
            const aRatio = a.intersectionRatio ?? 0
            const bRatio = b.intersectionRatio ?? 0
            if (Math.abs(aRatio - bRatio) > 0.1) return bRatio - aRatio
            const aY = a.boundingClientRect.top
            const bY = b.boundingClientRect.top
            return Math.abs(aY - bY) < 100 ? bRatio - aRatio : aY - bY
          })

        const top = visible[0]
        const slug = top?.target?.getAttribute('data-article-slug') ?? ''
        if (!slug || slug === activeSlug) return

        setActiveSlug(slug)
        window.history.replaceState(window.history.state, '', `/news/${slug}`)
      },
      {
        root: null,
        rootMargin: '-10% 0px -40% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75],
      },
    )

    const nodes = containerRef.current.querySelectorAll<HTMLElement>('[data-article-slug]')
    nodes.forEach((n) => observer.observe(n))

    const onPopState = () => {
      const match = window.location.pathname.match(/^\/news\/([^/]+)$/)
      const slug = match?.[1]
      if (!slug) return

      const id = slugToId.get(slug)
      if (!id) return

      const el = containerRef.current?.querySelector<HTMLElement>(`[data-article-id="${id}"]`)
      if (!el) return

      el.scrollIntoView({behavior: 'smooth', block: 'start'})
    }

    window.addEventListener('popstate', onPopState)

    return () => {
      observer.disconnect()
      window.removeEventListener('popstate', onPopState)
    }
  }, [activeSlug, slugToId])

  const scrollRelatedBy = (dx: number) => {
    const row = relatedRowRef.current
    if (!row) return
    row.scrollBy({left: dx, behavior: 'smooth'})
  }

  const ArticleBlock = ({item, showActions}: {item: ContinuousFeedArticle; showActions: boolean}) => {
    const imageUrl = safeSanityImageUrl(item.featuredImage, {width: 1400, height: 788})
    const publishedLabel = formatDate(item.publishedDate)

    return (
      <article className="w-full" data-article-slug={item.slug} data-article-id={item._id}>
        <div className="text-xs font-mono uppercase tracking-widest text-gray-500 dark:text-gray-400">
          {item.category?.slug ? (
            <Link className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors" href={`/categories/${item.category.slug}`}>
              {item.category.name}
            </Link>
          ) : (
            <span>News</span>
          )}
          {publishedLabel ? <span className="mx-2 text-gray-300 dark:text-gray-700">/</span> : null}
          {publishedLabel ? <span>{publishedLabel}</span> : null}
        </div>

        <h1 className="mt-3 font-serif text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white">
          {item.title}
        </h1>

        {item.summary ? (
          <div className="mt-6 border-l-2 border-gray-300 dark:border-gray-700 pl-5 text-gray-700 dark:text-gray-300 font-serif text-lg leading-8">
            {item.summary}
          </div>
        ) : null}

        <div className="mt-8">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
            {imageUrl ? (
              <Image
                alt={item.title}
                className="object-cover"
                fill
                sizes="(max-width: 1024px) 100vw, 760px"
                src={imageUrl}
              />
            ) : (
              <div className="absolute inset-0" />
            )}
          </div>
        </div>

        <div className="mt-10">
          {showActions ? <ArticleActionButtons className="mb-8" title={item.title} /> : null}
          <div className="prose prose-lg md:prose-xl dark:prose-invert prose-slate prose-headings:font-display prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-lg prose-p:leading-8">
            <PortableText value={item.body as PortableTextBlock[]} components={portableTextComponents} />
          </div>
        </div>

        <div className="mt-14 border-t border-gray-200 dark:border-gray-800" />
      </article>
    )
  }

  return (
    <div ref={containerRef} className="flex flex-col lg:flex-row lg:items-start gap-10">
      <div className="w-full lg:w-2/3 lg:min-w-0">
        <div className="flex flex-col gap-16">
          {feedArticles.map((item, idx) => (
            <div key={item._id} className="flex flex-col gap-10">
              <ArticleBlock item={item} showActions={idx === 0} />

              {idx === 0 && related.length ? (
                <section>
                  <div className="flex items-end justify-between gap-4">
                    <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-600 dark:text-gray-300">Related Articles</h2>
                    <div className="hidden sm:flex items-center gap-2">
                      <button
                        aria-label="Scroll related left"
                        className="h-9 w-9 rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                        type="button"
                        onClick={() => scrollRelatedBy(-360)}
                      >
                        <span className="material-symbols-outlined text-[18px] text-gray-700 dark:text-gray-200">chevron_left</span>
                      </button>
                      <button
                        aria-label="Scroll related right"
                        className="h-9 w-9 rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors"
                        type="button"
                        onClick={() => scrollRelatedBy(360)}
                      >
                        <span className="material-symbols-outlined text-[18px] text-gray-700 dark:text-gray-200">chevron_right</span>
                      </button>
                    </div>
                  </div>

                  <div
                    ref={relatedRowRef}
                    className="mt-5 -mx-2 px-2 flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory"
                  >
                    {related.slice(0, 8).map((a) => {
                      const recImageUrl = safeSanityImageUrl(a.featuredImage, {width: 560, height: 360})
                      return (
                        <Link
                          key={a._id}
                          href={`/news/${a.slug}`}
                          className="snap-start shrink-0 w-[280px] sm:w-[320px] rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 transition-all duration-200 hover:shadow-sm"
                        >
                          <div className="relative w-full aspect-[16/9] rounded-t-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                            {recImageUrl ? <Image alt={a.title} className="object-cover" fill sizes="320px" src={recImageUrl} /> : null}
                          </div>
                          <div className="p-4">
                            <div className="text-[11px] font-mono text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                              {a.category?.name ?? 'News'}
                            </div>
                            <div className="mt-2 font-serif font-bold text-base sm:text-lg text-gray-900 dark:text-white leading-snug line-clamp-3">
                              {a.title}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              ) : null}

            </div>
          ))}
        </div>
      </div>

      <aside className="w-full lg:w-1/3 lg:min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-gray-600 dark:text-gray-300">Latest News</h3>
          <Link className="text-xs font-mono text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors" href="/news">
            View all
          </Link>
        </div>

        <div className="mt-5 flex flex-col gap-4">
          {latestSidebar.slice(0, 4).map((n) => {
            const thumbUrl = safeSanityImageUrl(n.featuredImage, {width: 200, height: 150})
            return (
              <Link
                key={n._id}
                href={`/news/${n.slug}`}
                className={`flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors ${
                  n.slug === activeSlug ? 'bg-gray-50 dark:bg-gray-800/40' : ''
                }`}
              >
                <div className="relative w-20 h-16 sm:w-24 sm:h-20 rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                  {thumbUrl ? (
                    <Image
                      alt={n.title}
                      className="object-cover"
                      fill
                      sizes="96px"
                      src={thumbUrl}
                    />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-3">
                    {n.title}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 p-5 pb-6 bg-gray-50 dark:bg-gray-800 rounded-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">mail</span>
            <h4 className="font-serif font-semibold text-lg text-gray-800 dark:text-white uppercase tracking-wide">Daily Briefing</h4>
          </div>
          <p className="text-sm text-text-main dark:text-gray-300 mb-4 leading-relaxed font-medium">
            Get the intelligence you need. Delivered every morning.
          </p>
          <NewsletterForm
            source="article_sidebar_daily_briefing"
            turnstileScale={0.9}
            inputClassName="w-full px-2.5 py-1.5 text-xs border border-gray-200 bg-white rounded-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white font-mono placeholder:text-gray-400"
            buttonClassName="w-full bg-[#1a1a2e] hover:bg-[#252542] text-white text-xs font-semibold py-1.5 rounded-sm transition-colors uppercase tracking-widest font-mono disabled:opacity-70"
          />
        </div>
      </aside>
    </div>
  )
}
