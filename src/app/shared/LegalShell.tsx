 'use client'

import Link from 'next/link'
import {useEffect, useRef, useState, type ReactNode} from 'react'

type ContentsItem = {
  id: string
  label: string
}

type Props = {
  title: string
  description: string
  lastUpdated: string
  contents: ContentsItem[]
  contactEmail: string
  contactLabel: string
  children: ReactNode
}

export default function LegalShell({
  title,
  description,
  lastUpdated,
  contents,
  contactEmail,
  contactLabel,
  children,
}: Props) {
  const [activeId, setActiveId] = useState<string>(contents[0]?.id ?? '')
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sectionRefs = useRef<Map<string, IntersectionObserverEntry>>(new Map())

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        sectionRefs.current.set(entry.target.id, entry)
      })

      // Find the most visible section
      let maxRatio = 0
      let activeSectionId = ''

      sectionRefs.current.forEach((entry) => {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio
          activeSectionId = entry.target.id
        }
      })

      if (activeSectionId && activeSectionId !== activeId) {
        setActiveId(activeSectionId)
      }
    }

    observerRef.current = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: [0, 0.25, 0.5, 0.75, 1],
    })

    // Observe all sections
    contents.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element && observerRef.current) {
        observerRef.current.observe(element)
      }
    })

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [contents, activeId])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      const offset = 100 // Account for sticky header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
      setActiveId(id)
    }
  }

  return (
    <main className="bg-background-light dark:bg-background-dark text-gray-900 dark:text-gray-100 flex flex-col min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <aside className="lg:col-span-3 hidden lg:block">
            <div className="sticky top-24">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contents</h3>
              <nav aria-label="Sidebar" className="space-y-1">
                {contents.map((item, idx) => {
                  const isActive = activeId === item.id
                  return (
                    <a
                      key={item.id}
                      className={
                        isActive
                          ? 'group flex items-center border-l-2 border-primary py-2 pl-3 text-sm font-medium text-primary bg-primary/5 rounded-r transition-colors'
                          : 'group flex items-center border-l-2 border-transparent py-2 pl-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white transition-colors'
                      }
                      href={`#${item.id}`}
                      onClick={(e) => handleClick(e, item.id)}
                    >
                      {idx + 1}. {item.label}
                    </a>
                  )
                })}
              </nav>

              <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Have specific questions?</p>
                <a className="text-sm font-bold text-primary hover:underline" href={`mailto:${contactEmail}`}>
                  {contactLabel} →
                </a>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 p-6 md:p-10 mb-8 shadow-sm">
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
                <Link
                  className={
                    title === 'Privacy Policy'
                      ? 'relative pb-4 px-4 text-sm font-bold text-primary border-b-2 border-primary -mb-px'
                      : 'relative pb-4 px-4 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-b-2 border-transparent hover:border-gray-300 -mb-px transition-colors'
                  }
                  href="/privacy"
                >
                  Privacy Policy
                </Link>
                <Link
                  className={
                    title !== 'Privacy Policy'
                      ? 'relative pb-4 px-4 text-sm font-bold text-primary border-b-2 border-primary -mb-px'
                      : 'relative pb-4 px-4 text-sm font-bold text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 border-b-2 border-transparent hover:border-gray-300 -mb-px transition-colors'
                  }
                  href="/terms"
                >
                  Terms &amp; Conditions
                </Link>
              </div>

              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="max-w-2xl">
                  <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
                    {title}
                  </h1>
                  <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-4">{description}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-medium text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    Last updated: {lastUpdated}
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    aria-label="Print"
                    className="flex items-center gap-2 px-3 py-2 bg-background-light dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-200 transition-colors"
                    onClick={() => {
                      if (typeof window !== 'undefined') window.print()
                    }}
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">print</span>
                    <span className="text-sm font-medium hidden sm:inline">Print</span>
                  </button>
                  <button
                    aria-label="Download PDF"
                    className="flex items-center gap-2 px-3 py-2 bg-background-light dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded text-gray-700 dark:text-gray-200 transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[20px]">download</span>
                    <span className="text-sm font-medium hidden sm:inline">PDF</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 p-6 md:p-10 shadow-sm">
              <article className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-li:my-1">
                {children}
              </article>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
