'use client'

import Link from 'next/link'
import {useEffect, useRef, useState} from 'react'

type Article = {
  _id: string
  title: string
  slug: string
  publishedDate: string
}

interface LiveWireTimelineProps {
  articles: Article[]
  count: number
}

export default function LiveWireTimeline({articles, count}: LiveWireTimelineProps) {
  const [visibleIndices, setVisibleIndices] = useState<Set<number>>(new Set())
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      setVisibleIndices((prev) => {
        const newSet = new Set(prev)
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0', 10)
          if (entry.isIntersecting) {
            newSet.add(index)
          } else {
            newSet.delete(index)
          }
        })
        return newSet
      })
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '-20% 0px -20% 0px',
      threshold: [0.5],
    })

    // Observe all timeline items
    itemRefs.current.forEach((ref) => {
      if (ref && observerRef.current) {
        observerRef.current.observe(ref)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [articles.length, count])

  const displayedArticles = articles.slice(0, count)

  return (
    <div className="flex flex-col relative">
      {displayedArticles.map((article, idx) => {
        const isDotActive = visibleIndices.has(idx)
        // Line segment activates when NEXT item is visible (connects current to next)
        const isLineActive = visibleIndices.has(idx + 1)
        const isLastItem = idx === displayedArticles.length - 1

        return (
          <div
            key={article._id}
            ref={(el) => { itemRefs.current[idx] = el }}
            className="flex gap-4 relative"
            data-index={idx}
          >
            {/* Timeline column: dot + line segment */}
            <div className="flex flex-col items-center flex-shrink-0 relative">
              {/* Dot indicator */}
              <div
                className={`
                  w-2.5 h-2.5 rounded-full mt-1.5 relative z-10 
                  ring-4 ring-white dark:ring-background-dark
                  transition-all duration-300 ease-out
                  ${isDotActive
                    ? 'bg-[#1a1a2e] dark:bg-blue-400 scale-110' 
                    : 'bg-gray-300 dark:bg-gray-600 scale-100'
                  }
                `}
              />

              {/* Line segment below dot (connects to next item) */}
              {!isLastItem && (
                <div 
                  className={`
                    w-px flex-grow min-h-[24px] mt-1 origin-top transition-all duration-500 ease-out
                    ${isLineActive 
                      ? 'bg-[#1a1a2e] dark:bg-gray-400' 
                      : 'bg-gray-300 dark:bg-gray-700'
                    }
                  `}
                />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 pb-6">
              <span className="text-xs font-bold text-text-subtle dark:text-gray-400 font-mono">
                {article.publishedDate
                  ? new Date(article.publishedDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : ''}
              </span>
              <Link
                className={`
                  font-serif hover:text-primary hover:underline hover:decoration-[0.15em] hover:underline-offset-[0.12em] hover:decoration-primary leading-snug transition-all duration-300
                  ${isDotActive
                    ? 'font-bold text-text-main dark:text-white' 
                    : 'font-medium text-text-main/70 dark:text-white/70'
                  }
                `}
                href={`/news/${article.slug}`}
              >
                {article.title}
              </Link>
            </div>
          </div>
        )
      })}
    </div>
  )
}
