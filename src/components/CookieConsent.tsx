'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'

type ConsentValue = 'all' | 'essential'

const STORAGE_KEY = 'vcxpress_cookie_consent'

export default function CookieConsent() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      const existing = window.localStorage.getItem(STORAGE_KEY)
      if (existing === 'all' || existing === 'essential') return
    } catch {
      // If storage is blocked, still show the banner.
    }

    const t = window.setTimeout(() => {
      setOpen(true)
    }, 800)

    return () => window.clearTimeout(t)
  }, [])

  const setConsent = (value: ConsentValue) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value)
    } catch {
      // ignore
    }
    setOpen(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 pb-4 px-4 sm:px-6">
      <div className="mx-auto max-w-[1200px]">
        <div className="ml-auto w-full sm:max-w-[420px] rounded-xl border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark text-text-main dark:text-white shadow-2xl transition-colors duration-300 ease-in-out">
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-serif font-bold text-base leading-tight text-text-main dark:text-white transition-colors duration-300 ease-in-out">Cookies</p>
                <p className="mt-1 text-xs text-text-main/70 dark:text-white/70 leading-relaxed transition-colors duration-300 ease-in-out">
                  We use essential cookies to run the site, and optional cookies to improve performance.
                </p>
              </div>
              <button
                aria-label="Close"
                className="shrink-0 text-text-main/60 dark:text-white/60 hover:text-text-main dark:hover:text-white transition-colors"
                onClick={() => setConsent('essential')}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3">
              <Link className="text-xs font-mono uppercase tracking-widest text-primary hover:underline" href="/cookies">
                Learn more
              </Link>

              <div className="flex gap-2">
                <button
                  className="rounded-md border border-black/15 dark:border-white/15 px-3 py-2 text-xs font-bold text-text-main/90 dark:text-white/90 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  onClick={() => setConsent('essential')}
                  type="button"
                >
                  Only necessary
                </button>
                <button
                  className="rounded-md bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary/90 transition-colors"
                  onClick={() => setConsent('all')}
                  type="button"
                >
                  Accept
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
