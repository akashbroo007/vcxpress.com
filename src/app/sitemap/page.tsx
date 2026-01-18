import Link from 'next/link'

import {sanityFetch} from '@/lib/sanity.client'
import {ARTICLES_LIST_QUERY, AUTHORS_LIST_QUERY, CATEGORIES_LIST_QUERY, LEARN_CATEGORIES_LIST_QUERY, LEARN_LATEST_ARTICLES_QUERY} from '@/lib/sanity.queries'

type CategoryListItem = {
  _id: string
  name: string
  slug: string
}

type AuthorListItem = {
  _id: string
  name: string
  slug: string
}

type NewsListItem = {
  _id: string
  title: string
  slug: string
}

type LearnCategoryItem = {
  _id: string
  title: string
  slug: string
}

type LearnListItem = {
  _id: string
  title: string
  slug: string
  category?: {
    _id: string
    title: string
    slug: string
  } | null
}

export default async function SitemapPage() {
  const [categories, learnCategories, authors, latestNews, latestLearn] = await Promise.all([
    sanityFetch<CategoryListItem[]>(CATEGORIES_LIST_QUERY, {}, {revalidate: 3600, useCdn: false, tags: ['categories']}),
    sanityFetch<LearnCategoryItem[]>(LEARN_CATEGORIES_LIST_QUERY, {}, {revalidate: 3600, useCdn: false, tags: ['learn']}),
    sanityFetch<AuthorListItem[]>(AUTHORS_LIST_QUERY, {}, {revalidate: 3600, useCdn: false, tags: ['authors']}),
    sanityFetch<NewsListItem[]>(ARTICLES_LIST_QUERY, {}, {revalidate: 3600, useCdn: false, tags: ['articles']}),
    sanityFetch<LearnListItem[]>(LEARN_LATEST_ARTICLES_QUERY, {}, {revalidate: 3600, useCdn: false, tags: ['learn']}),
  ])

  const categoryItems = categories.slice(0, 12)
  const learnCategoryItems = learnCategories.slice(0, 12)
  const authorItems = authors.slice(0, 12)
  const latestNewsItems = latestNews.slice(0, 12)
  const latestLearnItems = latestLearn.slice(0, 12)

  return (
    <main className="bg-background-light dark:bg-background-dark text-text-main dark:text-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <section className="border-b border-[#e7ebf3] dark:border-gray-800 pb-10">
          <div className="flex items-center gap-2">
            <div className="h-px w-8 bg-primary"></div>
            <span className="text-primary text-xs font-bold tracking-widest uppercase font-mono">Directory</span>
          </div>
          <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-black tracking-tight">Sitemap</h1>
          <p className="mt-4 text-base sm:text-lg text-text-subtle dark:text-gray-300 leading-relaxed max-w-3xl">
            A structured overview of VCXPRESS pages and key sections.
          </p>
        </section>

        <section className="py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-xl border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-6">
              <h2 className="text-xs font-bold uppercase tracking-widest font-mono text-text-subtle dark:text-gray-400">Core</h2>
              <div className="mt-4 flex flex-col gap-3">
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/">
                  Home
                </Link>
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/news">
                  News
                </Link>
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/learn">
                  Learn
                </Link>
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/categories">
                  Categories
                </Link>
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/authors">
                  Authors
                </Link>
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/search">
                  Search
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-6">
              <h2 className="text-xs font-bold uppercase tracking-widest font-mono text-text-subtle dark:text-gray-400">Company</h2>
              <div className="mt-4 flex flex-col gap-3">
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/about">
                  About
                </Link>
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/contact">
                  Contact
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-6">
              <h2 className="text-xs font-bold uppercase tracking-widest font-mono text-text-subtle dark:text-gray-400">Support</h2>
              <div className="mt-4 flex flex-col gap-3">
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/help-center">
                  Help Center
                </Link>
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/contact">
                  Contact
                </Link>
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/sitemap">
                  Sitemap
                </Link>
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/sitemap.xml">
                  Sitemap XML
                </Link>
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/robots.txt">
                  Robots
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-6">
              <h2 className="text-xs font-bold uppercase tracking-widest font-mono text-text-subtle dark:text-gray-400">Legal</h2>
              <div className="mt-4 flex flex-col gap-3">
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/privacy">
                  Privacy
                </Link>
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/terms">
                  Terms
                </Link>
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/cookies">
                  Cookies
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-6">
              <h2 className="text-xs font-bold uppercase tracking-widest font-mono text-text-subtle dark:text-gray-400">News Categories</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {categoryItems.map((c) => (
                  <Link key={c._id} className="text-sm font-semibold hover:text-primary transition-colors" href={`/category/${c.slug}`}>
                    {c.name}
                  </Link>
                ))}
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/categories">
                  View all
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-6">
              <h2 className="text-xs font-bold uppercase tracking-widest font-mono text-text-subtle dark:text-gray-400">Learn Topics</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {learnCategoryItems.map((c) => (
                  <Link key={c._id} className="text-sm font-semibold hover:text-primary transition-colors" href={`/learn/${c.slug}`}>
                    {c.title}
                  </Link>
                ))}
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/learn">
                  View all
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-6">
              <h2 className="text-xs font-bold uppercase tracking-widest font-mono text-text-subtle dark:text-gray-400">Latest News</h2>
              <div className="mt-4 flex flex-col gap-3">
                {latestNewsItems.map((a) => (
                  <Link key={a._id} className="text-sm font-semibold hover:text-primary transition-colors" href={`/news/${a.slug}`}>
                    {a.title}
                  </Link>
                ))}
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/news">
                  View all
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-6">
              <h2 className="text-xs font-bold uppercase tracking-widest font-mono text-text-subtle dark:text-gray-400">Latest Learn</h2>
              <div className="mt-4 flex flex-col gap-3">
                {latestLearnItems.map((a) => (
                  <Link
                    key={a._id}
                    className="text-sm font-semibold hover:text-primary transition-colors"
                    href={a.category?.slug ? `/learn/${a.category.slug}/${a.slug}` : '/learn'}
                  >
                    {a.title}
                  </Link>
                ))}
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/learn">
                  View all
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-[#e7ebf3] dark:border-gray-800 bg-surface-light dark:bg-surface-dark p-6">
              <h2 className="text-xs font-bold uppercase tracking-widest font-mono text-text-subtle dark:text-gray-400">Authors</h2>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {authorItems.map((a) => (
                  <Link key={a._id} className="text-sm font-semibold hover:text-primary transition-colors" href={`/authors/${a.slug}`}>
                    {a.name}
                  </Link>
                ))}
                <Link className="text-sm font-semibold hover:text-primary transition-colors" href="/authors">
                  View all
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-primary/15 bg-primary/5 p-6 md:col-span-2 lg:col-span-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">link</span>
                <h2 className="font-bold text-text-main dark:text-white">Looking for something specific?</h2>
              </div>
              <p className="mt-3 text-sm text-text-subtle dark:text-gray-300 leading-relaxed">
                Use site search from the navigation bar, or contact the editorial team for corrections, press releases, and news tips.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link className="inline-flex items-center gap-2 rounded bg-primary text-white text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-primary/90 transition-colors" href="/contact">
                  Contact
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
                <Link className="inline-flex items-center gap-2 rounded border border-primary/30 text-primary text-xs font-bold uppercase tracking-widest px-4 py-2 hover:bg-primary/10 transition-colors" href="/news">
                  Browse News
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
