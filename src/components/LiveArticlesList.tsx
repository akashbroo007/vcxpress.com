'use client'

import Link from 'next/link'
import Image from 'next/image'
import {useEffect, useMemo, useRef, useState} from 'react'

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

export default function LiveArticlesList({initialArticles}: {initialArticles: ArticleListItem[]}) {
  const [articles, setArticles] = useState<ArticleListItem[]>(initialArticles)
  const lastSignatureRef = useRef<string>('')

  const signature = useMemo(() => {
    const first = articles[0]?._id ?? ''
    const ids = articles.map((a) => a._id).join(',')
    return `${first}|${articles.length}|${ids}`
  }, [articles])

  useEffect(() => {
    lastSignatureRef.current = signature
  }, [signature])

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return

    let disposed = false

    const tick = async () => {
      try {
        const res = await fetch('/api/articles', {cache: 'no-store'})
        if (!res.ok) return
        const next = (await res.json()) as ArticleListItem[]
        if (disposed) return

        const nextSig = `${next[0]?._id ?? ''}|${next.length}|${next.map((a) => a._id).join(',')}`
        if (nextSig !== lastSignatureRef.current) {
          lastSignatureRef.current = nextSig
          setArticles(next)
        }
      } catch {
        // ignore
      }
    }

    const id = window.setInterval(tick, 5000)
    return () => {
      disposed = true
      window.clearInterval(id)
    }
  }, [])

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso)
      return d.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    } catch {
      return ''
    }
  }

  if (articles.length === 0) {
    return (
      <div className="py-8">
        <p className="text-gray-600 dark:text-gray-400">No articles yet.</p>
      </div>
    )
  }

  return (
    <>
      {articles.map((a) => (
        <Link key={a._id} className="group block" href={`/news/${a.slug}`}>
          <article className="flex flex-col sm:flex-row gap-6 py-8 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors -mx-4 px-4 rounded-lg">
            <div className="sm:w-28 shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-1">
              <time className="text-gray-900 dark:text-white font-medium text-lg leading-none">{formatTime(a.publishedDate)}</time>
              <span className="text-primary text-[11px] font-bold tracking-wider uppercase bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">
                {a.category?.name ?? 'Funding'}
              </span>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-primary transition-colors">
                {a.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2">{a.summary}</p>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs font-semibold text-gray-500 group-hover:text-primary flex items-center gap-1">
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

                  return imageUrl ? (
                    <Image alt={a.title} className="object-cover" fill sizes="160px" src={imageUrl} />
                  ) : (
                    <div className="absolute inset-0" />
                  )
                })()}
              </div>
            </div>
          </article>
        </Link>
      ))}
    </>
  )
}
