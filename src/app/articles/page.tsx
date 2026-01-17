import {sanityFetch} from '@/lib/sanity.client'
import {ARTICLES_LIST_QUERY} from '@/lib/sanity.queries'
import LiveArticlesList from '@/components/LiveArticlesList'
import NewsletterForm from '@/components/NewsletterForm'

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
              <div className="p-6 bg-primary/5 rounded-sm border border-primary/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-primary">mail</span>
                  <h4 className="font-serif font-bold text-lg text-primary uppercase tracking-wide">Daily Briefing</h4>
                </div>
                <p className="text-sm text-text-main dark:text-gray-300 mb-4 leading-relaxed font-medium">
                  Get the most important stories delivered to your inbox every morning.
                </p>
                <NewsletterForm
                  source="news_daily_briefing"
                  placeholder="work@email.com"
                  inputClassName="w-full px-3 py-2 text-sm border border-primary/20 bg-white rounded-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none dark:bg-gray-900 dark:border-gray-600 dark:text-white font-mono placeholder:text-gray-400"
                  buttonClassName="w-full bg-primary hover:bg-primary/90 text-white text-sm font-bold py-2 rounded-sm transition-colors uppercase tracking-widest font-mono disabled:opacity-70"
                />
                <p className="text-[10px] text-text-subtle dark:text-gray-500 mt-2">
                  By signing up, you agree to our Terms and Privacy Policy.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
