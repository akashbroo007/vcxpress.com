'use client'

import {useRef, useState} from 'react'

import Link from 'next/link'
import {useRouter} from 'next/navigation'

import {useTheme} from '../ThemeProvider'
import NewsletterForm from '../NewsletterForm'

function ChevronDownIcon({className}: {className?: string}) {
  return (
    <svg className={className} fill="none" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function FacebookIcon({className}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function XIcon({className}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

function LinkedInIcon({className}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function InstagramIcon({className}: {className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.381-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.852-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
    </svg>
  )
}

function CloseIcon({className}: {className?: string}) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

function HamburgerIcon({className}: {className?: string}) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  )
}

type MainNavItem = {
  label: string
  href: string
  dropdown?: {label: string; href: string}[]
}

const mainNavItems: MainNavItem[] = [
  {label: 'News', href: '/news'},
  {label: 'Finance', href: '/category/finance'},
  {label: 'AI', href: '/category/ai'},
  {label: 'Cybersecurity', href: '/category/cybersecurity'},
  {label: 'Healthcare', href: '/category/healthcare'},
  {
    label: 'Others',
    href: '#',
    dropdown: [
      {label: 'Categories', href: '/categories'},
      {label: 'Learn', href: '/learn'},
      {label: 'About Us', href: '/about'},
      {label: 'Policy', href: '/privacy'},
    ],
  },
]

export default function GlobalNavbar() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [subscribeOpen, setSubscribeOpen] = useState(false)
  const [othersDropdownOpen, setOthersDropdownOpen] = useState(false)
  const [sidebarOthersOpen, setSidebarOthersOpen] = useState(false)
  const closeSubscribeTimer = useRef<number | null>(null)
  const closeOthersTimer = useRef<number | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const {theme, toggleTheme, mounted} = useTheme()
  const router = useRouter()

  const submitSearch = (query: string) => {
    const q = query.trim()
    if (!q) return
    setSearchOpen(false)
    setSearchQuery('')
    router.push(`/search?q=${encodeURIComponent(q)}`)
    router.refresh()
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#101622] border-b border-gray-200 dark:border-white/10 transition-colors duration-300 ease-in-out">
        {/* Top tier - Logo, search, subscribe */}
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Left: Hamburger + Mobile Search */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                aria-label="Toggle navigation"
                className="inline-flex items-center justify-center h-10 w-10 rounded bg-[#1a1a2e] hover:bg-[#252542] text-white transition-all duration-200 hover:scale-105"
                type="button"
                onClick={() => {
                  setOpen((v) => !v)
                  setSearchOpen(false)
                }}
              >
                <HamburgerIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Center: Logo - smaller on mobile */}
            <Link
              className="absolute left-1/2 -translate-x-1/2 font-serif text-xl sm:text-3xl md:text-4xl font-semibold tracking-[0.05em] text-gray-800 dark:text-white shrink-0 leading-none transition-colors duration-300 ease-in-out"
              href="/"
            >
              VCXPRESS
            </Link>

            {/* Right: Search + Subscribe + Theme */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Search input - desktop */}
              <div className="hidden md:flex items-center h-10 bg-gray-100 dark:bg-white/5 rounded-md px-3 focus-within:ring-2 focus-within:ring-primary/30 transition-all">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      submitSearch(searchQuery)
                    }
                  }}
                  className="bg-transparent border-none text-sm w-32 lg:w-48 focus:ring-0 text-text-main dark:text-white placeholder-gray-400 px-2 outline-none"
                />
              </div>

              {/* Mobile search button */}
              <button
                aria-label="Search"
                className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                type="button"
                onClick={() => setSearchOpen((v) => !v)}
              >
                <svg className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Subscribe button */}
              <button
                className="bg-[#1a1a2e] hover:bg-[#252542] text-white text-[10px] sm:text-sm font-semibold h-10 px-2 sm:px-5 rounded-md transition-all duration-200 uppercase tracking-wide hover:shadow-lg hover:shadow-black/20 hover:-translate-y-0.5"
                type="button"
                onClick={() => {
                  setSubscribeOpen(true)
                  setOpen(false)
                  setSearchOpen(false)
                }}
              >
                <span className="sm:hidden">Join</span>
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </div>
          </div>

          {/* Mobile search dropdown */}
          <div
            className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
              searchOpen ? 'max-h-[80px] opacity-100 pb-4' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="flex items-center h-12 w-full bg-gray-100 dark:bg-white/5 rounded-lg px-3 focus-within:ring-2 focus-within:ring-primary/30 transition-all">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    submitSearch(searchQuery)
                  }
                }}
                className="bg-transparent border-none text-sm w-full focus:ring-0 text-text-main dark:text-white placeholder-gray-400 px-3 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Bottom tier - Navigation links (desktop only) */}
        <div className="hidden md:block bg-[#1a1a2e]">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center justify-center gap-1 text-sm font-semibold tracking-wide">
              {mainNavItems.map((item) => (
                <div key={item.label} className="relative group">
                  {item.dropdown ? (
                    <>
                      <button
                        className="relative px-4 lg:px-6 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-1"
                        onMouseEnter={() => {
                          if (closeOthersTimer.current) window.clearTimeout(closeOthersTimer.current)
                          setOthersDropdownOpen(true)
                        }}
                        onMouseLeave={() => {
                          closeOthersTimer.current = window.setTimeout(() => setOthersDropdownOpen(false), 150)
                        }}
                        onClick={() => setOthersDropdownOpen((v) => !v)}
                      >
                        {item.label}
                        <ChevronDownIcon className={`h-3 w-3 opacity-70 transition-transform duration-200 ${othersDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {othersDropdownOpen ? (
                        <div
                          className="absolute top-full left-0 bg-[#1a1a2e] border-t border-white/10 shadow-xl min-w-[180px] py-2 z-50"
                          onMouseEnter={() => {
                            if (closeOthersTimer.current) window.clearTimeout(closeOthersTimer.current)
                          }}
                          onMouseLeave={() => {
                            closeOthersTimer.current = window.setTimeout(() => setOthersDropdownOpen(false), 150)
                          }}
                        >
                          {item.dropdown.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="block px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                              onClick={() => setOthersDropdownOpen(false)}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white group-hover:w-3/4 transition-all duration-300" />
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="relative px-4 lg:px-6 py-3 text-white/90 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-1 group"
                    >
                      {item.label}
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-white group-hover:w-3/4 transition-all duration-300" />
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Sidebar overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar menu */}
      <aside
        className={`fixed top-0 left-0 h-full w-[320px] max-w-[85vw] bg-white dark:bg-[#101622] z-50 shadow-2xl transform transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close button */}
          <div className="flex items-center justify-end p-4 border-b border-gray-100 dark:border-white/10">
            <button
              aria-label="Close menu"
              className="inline-flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              onClick={() => setOpen(false)}
            >
              <CloseIcon className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Navigation items - main nav */}
          <nav className="flex-1 py-6 px-4 overflow-y-auto">
            <ul className="space-y-1">
              {mainNavItems.map((item) => (
                <li key={item.label}>
                  {item.dropdown ? (
                    <div className="space-y-1">
                      <button
                        className="w-full flex items-center justify-between px-4 py-3 text-lg font-semibold tracking-wide text-text-main/50 dark:text-white/50 hover:bg-[#1a1a2e]/10 hover:text-[#1a1a2e] dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-all duration-200"
                        onClick={() => setSidebarOthersOpen((v) => !v)}
                      >
                        {item.label.toUpperCase()}
                        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${sidebarOthersOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {sidebarOthersOpen ? (
                        <ul className="pl-4 space-y-1 border-l-2 border-gray-200 dark:border-white/10 ml-4">
                          {item.dropdown.map((subItem) => (
                            <li key={subItem.href}>
                              <Link
                                className="block px-4 py-2 text-base font-medium tracking-wide text-text-main/80 dark:text-white/80 hover:bg-[#1a1a2e]/10 hover:text-[#1a1a2e] dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-all duration-200"
                                href={subItem.href}
                                onClick={() => setOpen(false)}
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : (
                    <Link
                      className="block px-4 py-3 text-lg font-semibold tracking-wide text-text-main dark:text-white hover:bg-[#1a1a2e]/10 hover:text-[#1a1a2e] dark:hover:text-white dark:hover:bg-white/10 rounded-lg transition-all duration-200"
                      href={item.href}
                      onClick={() => setOpen(false)}
                    >
                      {item.label.toUpperCase()}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Theme toggle */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-white/10">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-main dark:text-white">Dark mode</span>
              <label
                className="ui-switch inline-flex items-center justify-center h-8 px-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Toggle theme"
              >
                <input
                  type="checkbox"
                  checked={mounted && theme === 'dark'}
                  onChange={() => {
                    if (!mounted) return
                    toggleTheme()
                  }}
                  disabled={!mounted}
                />
                <span className="slider" aria-hidden="true">
                  <span className="circle" />
                </span>
              </label>
            </div>
          </div>

          {/* Social icons */}
          <div className="p-4 border-t border-gray-100 dark:border-white/10">
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:bg-[#1a1a2e] dark:hover:bg-[#1a1a2e] hover:text-white dark:hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Facebook"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:bg-[#1a1a2e] dark:hover:bg-[#1a1a2e] hover:text-white dark:hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="X (Twitter)"
              >
                <XIcon className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:bg-[#1a1a2e] dark:hover:bg-[#1a1a2e] hover:text-white dark:hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="LinkedIn"
              >
                <LinkedInIcon className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center hover:bg-[#1a1a2e] dark:hover:bg-[#1a1a2e] hover:text-white dark:hover:text-white transition-all duration-200 hover:scale-110"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Subscribe modal */}
      {subscribeOpen ? (
        <div className="fixed inset-0 z-[60]">
          <button
            aria-label="Close subscribe modal"
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            type="button"
            onClick={() => setSubscribeOpen(false)}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm rounded-lg border border-gray-200/50 dark:border-white/5 bg-white/95 dark:bg-[#101622]/95 backdrop-blur-md p-4 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <h3 className="font-serif text-lg font-semibold text-text-main dark:text-white">Subscribe</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get the intelligence you need. Delivered every morning.
                </p>
              </div>
              <button
                aria-label="Close"
                className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-gray-200/50 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                type="button"
                onClick={() => setSubscribeOpen(false)}
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4">
              <NewsletterForm
                source="navbar_subscribe"
                onSuccess={() => {
                  if (closeSubscribeTimer.current) window.clearTimeout(closeSubscribeTimer.current)
                  closeSubscribeTimer.current = window.setTimeout(() => {
                    setSubscribeOpen(false)
                  }, 1400)
                }}
                inputClassName="w-full px-3 py-2 text-sm border border-gray-200/50 dark:border-gray-600/50 bg-gray-50/50 dark:bg-gray-800/50 rounded-md focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none dark:text-white placeholder:text-gray-400"
                buttonClassName="w-full bg-[#1a1a2e] hover:bg-[#252542] text-white text-xs font-semibold py-2 rounded-md transition-all duration-200 uppercase tracking-widest disabled:opacity-70"
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
