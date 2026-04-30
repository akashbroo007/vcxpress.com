'use client'

/**
 * Skeleton Component
 * Provides animated loading placeholders for various content types
 */

export function Skeleton({className, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-800 ${className || ''}`}
      {...props}
    />
  )
}

export function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 py-8 border-b border-gray-200 dark:border-gray-800 -mx-4 px-4">
      <div className="sm:w-28 shrink-0 flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 pt-1">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-5 w-20" />
      </div>

      <div className="flex-1 flex flex-col gap-3">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center gap-4 mt-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      <div className="sm:w-40 shrink-0">
        <Skeleton className="aspect-[4/3] w-full rounded" />
      </div>
    </div>
  )
}

export function FeaturedArticleSkeleton() {
  return (
    <div className="lg:col-span-8">
      <Skeleton className="relative w-full aspect-[16/9] mb-6" />
      <div className="flex flex-col gap-3">
        <div className="w-10 h-[2px] bg-gray-300 dark:bg-gray-600"></div>
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <div className="flex items-center gap-4 mt-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}

export function SidebarArticleSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-8 h-[1px] bg-gray-300 dark:bg-gray-600 mb-1"></div>
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  )
}

export function HeroSectionSkeleton() {
  return (
    <section className="mb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <FeaturedArticleSkeleton />
        <div className="lg:col-span-4 flex flex-col gap-6 lg:pl-8 lg:border-l border-gray-200 dark:border-gray-800">
          <div className="flex flex-col gap-2">
            <div className="w-10 h-[2px] bg-gray-300 dark:bg-gray-600"></div>
            <Skeleton className="h-8 w-32" />
          </div>
          {[0, 1, 2, 3, 4].map((idx) => (
            <div key={idx}>
              <SidebarArticleSkeleton />
              {idx !== 4 ? <div className="w-full h-px bg-gray-200 dark:bg-gray-800"></div> : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function NewsletterFormSkeleton() {
  return (
    <div className="p-6 bg-gray-50 dark:bg-white/5 rounded-sm border border-gray-200 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="h-6 w-6 rounded" />
        <Skeleton className="h-6 w-40" />
      </div>
      <Skeleton className="h-4 w-full mb-4" />
      <Skeleton className="h-10 w-full mb-2" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-3 w-3/4 mt-2" />
    </div>
  )
}

export function CategoryPageSkeleton() {
  return (
    <div className="theme-feed bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <main className="lg:col-span-8 flex flex-col gap-8">
            <div className="border-b-2 border-black dark:border-white pb-6 mb-2">
              <Skeleton className="h-10 w-48 mb-2" />
              <Skeleton className="h-6 w-3/4" />
            </div>

            <div className="flex flex-col">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <ArticleCardSkeleton key={idx} />
              ))}
            </div>
          </main>

          <aside className="hidden lg:block lg:col-span-4 pl-8 border-l border-gray-200 dark:border-gray-800">
            <div className="sticky top-24 flex flex-col gap-10">
              <NewsletterFormSkeleton />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export function ArticleDetailSkeleton() {
  return (
    <div className="theme-feed bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-2" />
            <Skeleton className="h-6 w-32" />
          </div>

          <Skeleton className="w-full aspect-[16/9] mb-8 rounded-lg" />

          <div className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-5/6" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-4/5" />
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}

export function AuthorPageSkeleton() {
  return (
    <div className="theme-feed bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
        <div className="mb-8">
          <Skeleton className="h-16 w-16 rounded-full mb-4" />
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-full" />
        </div>

        <div className="border-b-2 border-black dark:border-white pb-6 mb-8">
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="space-y-6">
          {[0, 1, 2, 3, 4].map((idx) => (
            <ArticleCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function SearchResultsSkeleton() {
  return (
    <div className="theme-feed bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 lg:px-8 py-10">
        <div className="mb-8">
          <Skeleton className="h-8 w-96 mb-4" />
          <Skeleton className="h-5 w-64" />
        </div>

        <div className="space-y-6">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <ArticleCardSkeleton key={idx} />
          ))}
        </div>
      </div>
    </div>
  )
}