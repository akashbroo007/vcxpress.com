'use client'

import Link from 'next/link'
import {useEffect, useMemo, useRef, useState} from 'react'

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

export default function LiveCategoryArticles({initialCategory}: {initialCategory: CategoryDetail}) {
  const [category, setCategory] = useState<CategoryDetail>(initialCategory)
  const lastSignatureRef = useRef<string>('')

  const signature = useMemo(() => {
    const ids = category.articles.map((a) => a._id).join(',')
    return `${category._id}|${category.articles.length}|${ids}`
  }, [category._id, category.articles])

  useEffect(() => {
    lastSignatureRef.current = signature
  }, [signature])

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return

    let disposed = false

    const tick = async () => {
      try {
        const res = await fetch(`/api/categories/${encodeURIComponent(category.slug)}`, {cache: 'no-store'})
        if (!res.ok) return

        const next = (await res.json()) as CategoryDetail | null
        if (disposed || !next) return

        const nextSig = `${next._id}|${next.articles.length}|${next.articles.map((a) => a._id).join(',')}`
        if (nextSig !== lastSignatureRef.current) {
          lastSignatureRef.current = nextSig
          setCategory(next)
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
  }, [category.slug])

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col gap-1">
          <div className="w-8 h-[2px] bg-gray-300 mb-1"></div>
          <h2 className="font-serif text-2xl font-semibold text-text-main dark:text-white">Latest in {category.name}</h2>
        </div>
      </div>

      {category.articles.length === 0 ? (
        <div className="mt-6 rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-6 text-text-main/70 dark:text-white/70">
          No articles in this category yet.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {category.articles.map((a) => (
            <Link
              key={a._id}
              className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark p-6 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-sm transition-all"
              href={`/news/${a.slug}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">
                  {a.publishedDate
                    ? new Date(a.publishedDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric', year: 'numeric'})
                    : ''}
                </div>
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors">
                  arrow_forward
                </span>
              </div>
              <h3 className="mt-3 font-serif text-xl font-semibold text-text-main dark:text-white group-hover:text-primary transition-colors">
                {a.title}
              </h3>
              <p className="mt-2 text-sm text-text-subtle dark:text-gray-400 leading-relaxed line-clamp-3">{a.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
