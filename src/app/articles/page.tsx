import {sanityFetch} from '@/lib/sanity.client'
import {ARTICLES_LIST_QUERY} from '@/lib/sanity.queries'
import LiveArticlesList from '@/components/LiveArticlesList'

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

export default async function ArticlesPage() {
  const articles = await sanityFetch<ArticleListItem[]>(ARTICLES_LIST_QUERY, {}, {revalidate: 60, useCdn: false, tags: ['articles']})

  return (
    <div className="theme-feed bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <main className="lg:col-span-8 flex flex-col gap-8">
            <div className="border-b-2 border-black dark:border-white pb-6 mb-2">
              <h2 className="text-4xl font-black tracking-tight text-gray-900 dark:text-white mb-2">Latest News</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-serif italic">
                Real-time updates from the world of business, finance, and technology.
              </p>
            </div>

            <div className="flex flex-col">
              <LiveArticlesList initialArticles={articles} />
            </div>

          </main>

          <aside className="hidden lg:block lg:col-span-4 pl-8 border-l border-gray-200 dark:border-gray-800">
            <div className="sticky top-24 flex flex-col gap-10">
              <div className="border border-gray-200 dark:border-gray-700 rounded p-5 flex flex-col gap-3">
                <span className="material-symbols-outlined text-gray-900 dark:text-white text-[32px]">mail</span>
                <h4 className="font-bold text-gray-900 dark:text-white text-lg">Daily Briefing</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get the most important stories delivered to your inbox every morning.
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  <input
                    className="text-sm rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-primary focus:border-primary"
                    placeholder="work@email.com"
                    type="email"
                  />
                  <button
                    className="bg-primary dark:bg-white text-white dark:text-gray-900 font-bold text-sm py-2 rounded hover:opacity-90 transition-opacity"
                    type="button"
                  >
                    Sign Up
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">By signing up, you agree to our Terms and Privacy Policy.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
