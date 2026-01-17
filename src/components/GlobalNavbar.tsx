'use client'

import {useState} from 'react'

import Link from 'next/link'
import {useRouter} from 'next/navigation'

import {useTheme} from './ThemeProvider'
import NewsletterForm from './NewsletterForm'

function ChevronDownIcon({className}: {className?: string}) {
  return (
    <svg className={className} fill="none" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function SunIcon({className}: {className?: string}) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M12 2.75v2.5M12 18.75v2.5M4.22 4.22l1.77 1.77M18.01 18.01l1.77 1.77M2.75 12h2.5M18.75 12h2.5M4.22 19.78l1.77-1.77M18.01 5.99l1.77-1.77"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

function MoonIcon({className}: {className?: string}) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21 14.6A7.8 7.8 0 0 1 9.4 3a6.9 6.9 0 1 0 11.6 11.6Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  )
}

export default function GlobalNavbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearchQuery, setMobileSearchQuery] = useState('')
  const {theme, toggleTheme, mounted} = useTheme()
  const router = useRouter()

  const submitSearch = (query: string) => {
    const q = query.trim()
    if (!q) return
    setOpen(false)
    setSearchOpen(false)
    setSearchQuery('')
    setMobileSearchQuery('')
    router.push(`/search?q=${encodeURIComponent(q)}`)
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background-light text-text-main border-b border-black/10 dark:bg-background-dark dark:text-white dark:border-white/10 transition-colors duration-300 ease-in-out">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="py-2 md:py-0">
          <div className="flex items-center justify-between gap-3 md:h-16">
            <div className="flex items-center gap-2 shrink-0">
              <button
                aria-label="Toggle navigation"
                className="inline-flex items-center justify-center h-10 w-10 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                type="button"
                onClick={() => {
                  setOpen((v) => !v)
                  setSearchOpen(false)
                }}
              >
                <span className="material-symbols-outlined text-[22px]">{open ? 'close' : 'menu'}</span>
              </button>

              <button
                aria-label="Search"
                className="hidden md:inline-flex items-center justify-center h-10 w-10 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                type="button"
                onClick={() => {
                  setSearchOpen((v) => !v)
                  setOpen(false)
                }}
              >
                <span className="material-symbols-outlined text-[22px]">search</span>
              </button>

              <button
                aria-label="Toggle theme"
                className="hidden md:inline-flex items-center justify-center h-10 w-10 rounded text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/25 transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                onClick={toggleTheme}
                disabled={!mounted}
              >
                {!mounted ? (
                  <span className="block h-5 w-5" />
                ) : (
                  <span className="relative block h-5 w-5">
                    <SunIcon
                      className={`absolute inset-0 h-5 w-5 transition-all duration-300 ease-in-out ${
                        theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-90'
                      }`}
                    />
                    <MoonIcon
                      className={`absolute inset-0 h-5 w-5 transition-all duration-300 ease-in-out ${
                        theme === 'dark' ? 'opacity-0 rotate-90 scale-90' : 'opacity-100 rotate-0 scale-100'
                      }`}
                    />
                  </span>
                )}
              </button>
            </div>

            <Link
              className="font-serif text-xl sm:text-2xl font-black tracking-tight uppercase text-text-main dark:text-white shrink-0 leading-none transition-colors duration-300 ease-in-out"
              href="/"
            >
              VCXPRESS
            </Link>

            <div className="flex items-center gap-2 shrink-0">
              <button
                className="bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 lg:px-5 py-2 rounded transition-colors uppercase tracking-wide"
                type="button"
                onClick={() => {
                  setSubscribeOpen(true)
                  setOpen(false)
                  setSearchOpen(false)
                }}
              >
                Subscribe
              </button>
            </div>
          </div>

          <nav className="hidden md:flex items-center justify-center gap-5 lg:gap-7 text-[13px] lg:text-sm font-semibold tracking-wide whitespace-nowrap py-3">
            <Link className="inline-flex items-center gap-1 text-text-main/80 hover:text-text-main dark:text-white/90 dark:hover:text-white transition-colors" href="/news">
              News
              <ChevronDownIcon className="h-3.5 w-3.5 opacity-70" />
            </Link>
            <Link className="inline-flex items-center gap-1 text-text-main/80 hover:text-text-main dark:text-white/90 dark:hover:text-white transition-colors" href="/category/business">
              Business
              <ChevronDownIcon className="h-3.5 w-3.5 opacity-70" />
            </Link>
            <Link className="inline-flex items-center gap-1 text-text-main/80 hover:text-text-main dark:text-white/90 dark:hover:text-white transition-colors" href="/category/startups">
              Startups
              <ChevronDownIcon className="h-3.5 w-3.5 opacity-70" />
            </Link>
            <Link className="inline-flex items-center gap-1 text-text-main/80 hover:text-text-main dark:text-white/90 dark:hover:text-white transition-colors" href="/category/tech">
              Tech
              <ChevronDownIcon className="h-3.5 w-3.5 opacity-70" />
            </Link>
            <Link className="inline-flex items-center gap-1 text-text-main/80 hover:text-text-main dark:text-white/90 dark:hover:text-white transition-colors" href="/category/finance">
              Finance
              <ChevronDownIcon className="h-3.5 w-3.5 opacity-70" />
            </Link>
            <Link className="inline-flex items-center gap-1 text-text-main/80 hover:text-text-main dark:text-white/90 dark:hover:text-white transition-colors" href="/about">
              About
              <ChevronDownIcon className="h-3.5 w-3.5 opacity-70" />
            </Link>
          </nav>

          <div
            className={
              searchOpen
                ? 'hidden md:block overflow-hidden border-t border-black/10 dark:border-white/10 pb-3 pt-3 transition-[max-height,opacity] duration-200 ease-out max-h-[120px] opacity-100'
                : 'hidden md:block overflow-hidden border-t border-black/10 dark:border-white/10 pb-0 pt-0 transition-[max-height,opacity] duration-200 ease-out max-h-0 opacity-0'
            }
          >
            <div className="flex items-center h-10 w-full bg-black/5 dark:bg-white/5 rounded border border-black/10 dark:border-white/10 focus-within:border-black/20 dark:focus-within:border-white/25 focus-within:ring-1 focus-within:ring-black/10 dark:focus-within:ring-white/20 transition-all">
              <span className="material-symbols-outlined text-text-main/50 dark:text-white/60 pl-3 transition-colors duration-300 ease-in-out">search</span>
              <input
                className="bg-transparent border-none text-sm w-full focus:ring-0 text-text-main dark:text-white placeholder-black/40 dark:placeholder-white/50 px-3 transition-colors duration-300 ease-in-out"
                placeholder="Search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    submitSearch(searchQuery)
                  }
                }}
              />
            </div>
          </div>

          <div
            className={
              open
                ? 'md:hidden overflow-hidden border-t border-black/10 dark:border-white/10 pt-3 transition-[max-height,opacity] duration-200 ease-out max-h-[520px] opacity-100'
                : 'md:hidden overflow-hidden border-t border-black/10 dark:border-white/10 pt-3 transition-[max-height,opacity] duration-200 ease-out max-h-0 opacity-0'
            }
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center h-10 w-full bg-black/5 dark:bg-white/5 rounded border border-black/10 dark:border-white/10 focus-within:border-black/20 dark:focus-within:border-white/25 focus-within:ring-1 focus-within:ring-black/10 dark:focus-within:ring-white/20 transition-all">
                <span className="material-symbols-outlined text-text-main/50 dark:text-white/60 pl-3 transition-colors duration-300 ease-in-out">search</span>
                <input
                  className="bg-transparent border-none text-sm w-full focus:ring-0 text-text-main dark:text-white placeholder-black/40 dark:placeholder-white/50 px-3 transition-colors duration-300 ease-in-out"
                  placeholder="Search"
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      submitSearch(mobileSearchQuery)
                    }
                  }}
                />
              </div>

              <nav className="flex flex-col gap-2 text-sm font-semibold tracking-wide">
                <Link className="text-text-main/80 hover:text-text-main dark:text-white/90 dark:hover:text-white transition-colors py-2" href="/news" onClick={() => setOpen(false)}>
                  News
                </Link>
                <Link className="text-text-main/80 hover:text-text-main dark:text-white/90 dark:hover:text-white transition-colors py-2" href="/category/business" onClick={() => setOpen(false)}>
                  Business
                </Link>
                <Link className="text-text-main/80 hover:text-text-main dark:text-white/90 dark:hover:text-white transition-colors py-2" href="/category/startups" onClick={() => setOpen(false)}>
                  Startups
                </Link>
                <Link className="text-text-main/80 hover:text-text-main dark:text-white/90 dark:hover:text-white transition-colors py-2" href="/category/tech" onClick={() => setOpen(false)}>
                  Tech
                </Link>
                <Link className="text-text-main/80 hover:text-text-main dark:text-white/90 dark:hover:text-white transition-colors py-2" href="/category/finance" onClick={() => setOpen(false)}>
                  Finance
                </Link>
                <Link className="text-text-main/80 hover:text-text-main dark:text-white/90 dark:hover:text-white transition-colors py-2" href="/about" onClick={() => setOpen(false)}>
                  About
                </Link>
              </nav>

              <button
                aria-label="Toggle theme"
                className="inline-flex items-center justify-center h-10 w-10 rounded text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-black/5 dark:hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/20 dark:focus-visible:ring-white/25 transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                onClick={toggleTheme}
                disabled={!mounted}
              >
                {!mounted ? (
                  <span className="block h-5 w-5" />
                ) : (
                  <span className="relative block h-5 w-5">
                    <SunIcon
                      className={`absolute inset-0 h-5 w-5 transition-all duration-300 ease-in-out ${
                        theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-90'
                      }`}
                    />
                    <MoonIcon
                      className={`absolute inset-0 h-5 w-5 transition-all duration-300 ease-in-out ${
                        theme === 'dark' ? 'opacity-0 rotate-90 scale-90' : 'opacity-100 rotate-0 scale-100'
                      }`}
                    />
                  </span>
                )}
              </button>

              <button
                className="bg-primary hover:bg-primary/90 text-white text-sm font-bold px-5 py-2 rounded transition-colors uppercase tracking-wide"
                type="button"
                onClick={() => {
                  setSubscribeOpen(true)
                  setOpen(false)
                  setSearchOpen(false)
                }}
              >
                Subscribe
              </button>
            </div>
          </div>

          {subscribeOpen ? (
            <div className="fixed inset-0 z-[60]">
              <button
                aria-label="Close subscribe modal"
                className="absolute inset-0 bg-black/50"
                type="button"
                onClick={() => setSubscribeOpen(false)}
              />
              <div className="absolute left-1/2 top-20 w-[92vw] max-w-md -translate-x-1/2 rounded-xl border border-black/10 dark:border-white/10 bg-background-light dark:bg-background-dark p-6 shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-serif text-2xl font-bold">Subscribe</h3>
                    <p className="text-sm text-text-subtle dark:text-gray-400">
                      Get the intelligence you need. Delivered every morning.
                    </p>
                  </div>
                  <button
                    aria-label="Close"
                    className="inline-flex items-center justify-center h-9 w-9 rounded border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                    type="button"
                    onClick={() => setSubscribeOpen(false)}
                  >
                    <span className="material-symbols-outlined text-[22px]">close</span>
                  </button>
                </div>

                <div className="mt-5">
                  <NewsletterForm
                    source="navbar_subscribe"
                    onSuccess={() => setSubscribeOpen(false)}
                    inputClassName="w-full px-3 py-2 text-sm border border-primary/20 bg-white rounded-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white font-mono placeholder:text-gray-400"
                    buttonClassName="w-full bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2 rounded-sm transition-colors uppercase tracking-widest font-mono disabled:opacity-70"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
