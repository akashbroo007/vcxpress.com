'use client'

import {useState, useMemo} from 'react'
import Link from 'next/link'

// Lucide icons
import {Search, ArrowUp, ArrowDown, Check, ChevronLeft, ChevronRight} from 'lucide-react'

// Shadcn components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type CategoryListItem = {
  _id: string
  name: string
  slug: string
  description?: string | null
  articleCount?: number
}

type SortOption = 'name-asc' | 'name-desc' | 'articles-desc' | 'articles-asc'

export function CategoriesInteractive({
  categories,
  _total,
}: {
  categories: CategoryListItem[]
  _total: number
}) {
  const [searchQuery, setSearchQueryState] = useState('')
  const [sortBy, setSortByState] = useState<SortOption>('name-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 15

  // Wrapper to reset page when search changes
  const setSearchQuery = (value: string) => {
    setSearchQueryState(value)
    setCurrentPage(1)
  }

  // Wrapper to reset page when sort changes
  const setSortBy = (value: SortOption) => {
    setSortByState(value)
    setCurrentPage(1)
  }

  // Filter and sort categories
  const filteredCategories = useMemo(() => {
    let result = [...categories]

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.slug.toLowerCase().includes(query) ||
          (c.description && c.description.toLowerCase().includes(query))
      )
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name)
        case 'name-desc':
          return b.name.localeCompare(a.name)
        case 'articles-desc':
          return (b.articleCount || 0) - (a.articleCount || 0)
        case 'articles-asc':
          return (a.articleCount || 0) - (b.articleCount || 0)
        default:
          return 0
      }
    })

    return result
  }, [categories, searchQuery, sortBy])

  // Paginate the filtered/sorted results
  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex)

  const getSortIcon = () => {
    if (sortBy.includes('asc')) return <ArrowUp className="w-4 h-4" />
    return <ArrowDown className="w-4 h-4" />
  }

  return (
    <>
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <span className="sr-only">Clear search</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">Sort by:</span>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50">
              <span className="text-sm">
                {sortBy === 'name-asc' && 'Name (A-Z)'}
                {sortBy === 'name-desc' && 'Name (Z-A)'}
                {sortBy === 'articles-desc' && 'Most Articles'}
                {sortBy === 'articles-asc' && 'Least Articles'}
              </span>
              {getSortIcon()}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8} className="w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <DropdownMenuItem 
                onClick={() => setSortBy('name-asc')}
                className="flex items-center justify-between cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <span className="text-sm">Name (A-Z)</span>
                {sortBy === 'name-asc' && <Check className="w-4 h-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy('name-desc')}
                className="flex items-center justify-between cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <span className="text-sm">Name (Z-A)</span>
                {sortBy === 'name-desc' && <Check className="w-4 h-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy('articles-desc')}
                className="flex items-center justify-between cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <span className="text-sm">Most Articles</span>
                {sortBy === 'articles-desc' && <Check className="w-4 h-4 text-primary" />}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortBy('articles-asc')}
                className="flex items-center justify-between cursor-pointer px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <span className="text-sm">Least Articles</span>
                {sortBy === 'articles-asc' && <Check className="w-4 h-4 text-primary" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Showing {filteredCategories.length > 0 ? `${startIndex + 1}-${Math.min(endIndex, filteredCategories.length)} of ` : ''}{filteredCategories.length} categories
        {searchQuery && <span className="ml-1">(filtered by &quot;{searchQuery}&quot;)</span>}
      </div>

      {filteredCategories.length === 0 ? (
        <div className="rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 p-8 text-center">
          <p className="text-text-main/70 dark:text-white/70">
            {searchQuery ? 'No categories match your search.' : 'No categories yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCategories.map((c) => (
            <Link
              key={c._id}
              className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-surface-light dark:bg-surface-dark p-6 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-sm transition-all"
              href={`/categories/${c.slug}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest font-mono">
                    {c.slug}
                  </div>
                  <h2 className="mt-2 font-serif text-xl font-semibold text-text-main dark:text-white group-hover:text-primary transition-colors">
                    {c.name}
                  </h2>
                </div>
                <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-primary transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </div>
              {c.description ? (
                <p className="mt-3 text-sm text-text-subtle dark:text-gray-400 leading-relaxed line-clamp-3">{c.description}</p>
              ) : (
                <p className="mt-3 text-sm text-text-subtle dark:text-gray-400 leading-relaxed">
                  View latest articles in this category.
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!searchQuery && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-sm text-gray-500 dark:text-gray-400 px-4">
            Page {safePage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  )
}
