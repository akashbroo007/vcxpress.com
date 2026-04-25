import {sanityFetch} from '@/lib/sanity.client'
import {CategoriesInteractive} from './CategoriesInteractive'

type CategoryListItem = {
  _id: string
  name: string
  slug: string
  description?: string | null
  articleCount?: number
}

type PagedCategories = {
  total: number
  items: CategoryListItem[]
}

type PageProps = {
  _searchParams: Promise<{page?: string}>
}

// Query to fetch all categories (for client-side sorting/filtering)
// Include drafts to show categories created by automation before they're published
const ALL_CATEGORIES_QUERY = /* groq */ `
  {
    "total": count(*[_type == "category"]),
    "items": *[_type == "category"]|order(name asc){
      _id,
      "name": coalesce(name, title),
      "slug": slug.current,
      description,
      "articleCount": count(*[_type == "article" && status == "published" && (references(^._id) || category._ref == ^._id || ^._id in categories[]._ref)])
    }
  }
`

export default async function CategoriesPage({_searchParams}: PageProps) {
  const data = await sanityFetch<PagedCategories>(
    ALL_CATEGORIES_QUERY,
    {},
    {cache: 'no-store', tags: ['categories']},
  )

  const categories = Array.isArray(data?.items) ? data.items : []
  const total = typeof data?.total === 'number' ? data.total : 0

  return (
    <main className="theme-home bg-background-light dark:bg-background-dark text-text-main font-display antialiased min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="flex flex-col gap-2 mb-10">
          <div className="w-10 h-[2px] bg-gray-300"></div>
          <h1 className="font-serif text-3xl md:text-4xl font-semibold text-text-main dark:text-white">Categories</h1>
          <p className="text-text-subtle dark:text-gray-400 max-w-2xl">
            Explore all topics and discover the latest insights across industries.
          </p>
        </div>

        {/* Interactive search/sort with pagination (Client Component) */}
        <CategoriesInteractive 
          categories={categories} 
          _total={total}
        />
      </div>
    </main>
  )
}
