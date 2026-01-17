'use client'

import {useEffect, useMemo, useRef, useState} from 'react'

type Props = {
  className?: string
  title?: string
  url?: string
}

export default function ArticleActionButtons({className, title, url}: Props) {
  const [shareOpen, setShareOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const resolvedUrl = useMemo(() => {
    if (typeof window === 'undefined') return url
    return url || window.location.href
  }, [url])

  useEffect(() => {
    if (!shareOpen && !moreOpen) return

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null
      if (!rootRef.current) return
      if (target && rootRef.current.contains(target)) return
      setShareOpen(false)
      setMoreOpen(false)
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShareOpen(false)
        setMoreOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [shareOpen, moreOpen])

  const copyLink = async () => {
    const link = resolvedUrl
    if (!link) return

    try {
      await navigator.clipboard.writeText(link)
    } catch {
      try {
        const input = document.createElement('input')
        input.value = link
        document.body.appendChild(input)
        input.select()
        document.execCommand('copy')
        document.body.removeChild(input)
      } catch {
        // ignore
      }
    }
  }

  const nativeShare = async () => {
    const link = resolvedUrl
    if (!link) return

    const nav = navigator as Navigator & {share?: (data: {title?: string; url?: string}) => Promise<void>}

    if (typeof nav.share === 'function') {
      try {
        await nav.share({title, url: link})
        return
      } catch {
        // fall through
      }
    }

    await copyLink()
  }

  const encoded = useMemo(() => {
    const link = resolvedUrl
    const safeTitle = title || ''

    return {
      link,
      title: safeTitle,
      encodedLink: link ? encodeURIComponent(link) : '',
      encodedTitle: encodeURIComponent(safeTitle),
      encodedText: encodeURIComponent(safeTitle ? `${safeTitle} ${link || ''}`.trim() : link || ''),
    }
  }, [resolvedUrl, title])

  const hasNativeShare = useMemo(() => {
    if (typeof window === 'undefined') return false
    const nav = navigator as Navigator & {share?: (data: {title?: string; url?: string}) => Promise<void>}
    return typeof nav.share === 'function'
  }, [])

  const whatsappHref = useMemo(() => {
    if (!encoded.link) return undefined
    return `https://wa.me/?text=${encoded.encodedText}`
  }, [encoded])

  const facebookHref = useMemo(() => {
    if (!encoded.link) return undefined
    return `https://www.facebook.com/sharer/sharer.php?u=${encoded.encodedLink}`
  }, [encoded])

  const xHref = useMemo(() => {
    if (!encoded.link) return undefined
    const params = new URLSearchParams()
    if (encoded.title) params.set('text', encoded.title)
    params.set('url', encoded.link)
    return `https://twitter.com/intent/tweet?${params.toString()}`
  }, [encoded])

  return (
    <div ref={rootRef} className={className}>
      <div className="relative flex items-center justify-end gap-2">
        <button
          className="text-slate-400 hover:text-primary transition-colors"
          type="button"
          onClick={() => {
            setShareOpen((v) => !v)
            setMoreOpen(false)
          }}
          aria-label="Share"
          aria-expanded={shareOpen}
        >
          <span className="material-symbols-outlined">share</span>
        </button>
        <button
          className="text-slate-400 hover:text-primary transition-colors"
          type="button"
          onClick={() => {
            setMoreOpen((v) => !v)
            setShareOpen(false)
          }}
          aria-label="More"
          aria-expanded={moreOpen}
        >
          <span className="material-symbols-outlined">more_horiz</span>
        </button>

        {shareOpen ? (
          <div className="absolute right-0 top-10 z-50 min-w-52 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
            {whatsappHref ? (
              <a
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShareOpen(false)}
              >
                Share to WhatsApp
              </a>
            ) : null}
            {facebookHref ? (
              <a
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                href={facebookHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShareOpen(false)}
              >
                Share to Facebook
              </a>
            ) : null}
            {xHref ? (
              <a
                className="block w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                href={xHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShareOpen(false)}
              >
                Share to X
              </a>
            ) : null}

            <button
              className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              type="button"
              onClick={() => {
                void copyLink()
                setShareOpen(false)
              }}
            >
              Copy link
            </button>

            {hasNativeShare ? (
              <button
                className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                type="button"
                onClick={() => {
                  void nativeShare()
                  setShareOpen(false)
                }}
              >
                Share…
              </button>
            ) : null}
          </div>
        ) : null}

        {moreOpen ? (
          <div className="absolute right-0 top-10 z-50 min-w-44 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
            <button
              className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              type="button"
              onClick={() => {
                void copyLink()
                setMoreOpen(false)
              }}
            >
              Copy link
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
