import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  maxVisible?: number
}

/**
 * Generates sliding window of page numbers centered around current page
 * Rules:
 * - Always show exactly `maxVisible` pages (default 5)
 * - Center the current page when possible
 * - At edges, stick to start/end
 */
function getPageRange(current: number, total: number, maxVisible: number): number[] {
  if (total <= maxVisible) {
    return Array.from({length: total}, (_, i) => i + 1)
  }

  const halfVisible = Math.floor(maxVisible / 2)
  let start = current - halfVisible
  let end = current + halfVisible

  // Handle edge cases
  if (start < 1) {
    start = 1
    end = maxVisible
  } else if (end > total) {
    end = total
    start = total - maxVisible + 1
  }

  return Array.from({length: end - start + 1}, (_, i) => start + i)
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  maxVisible = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const safePage = Math.min(Math.max(1, currentPage), totalPages)
  const prevPage = safePage > 1 ? safePage - 1 : null
  const nextPage = safePage < totalPages ? safePage + 1 : null
  const visiblePages = getPageRange(safePage, totalPages, maxVisible)

  // Determine if we need ellipses
  const showFirstEllipsis = visiblePages[0] > 1
  const showLastEllipsis = visiblePages[visiblePages.length - 1] < totalPages

  const getHref = (page: number) => {
    const separator = basePath.includes('?') ? '&' : '?'
    return `${basePath}${separator}page=${page}`
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 sm:gap-2">
      {/* Previous button */}
      <Link
        aria-label="Previous page"
        className={`px-2 sm:px-3 py-2 rounded border text-sm font-medium transition-colors ${
          prevPage
            ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed pointer-events-none'
        }`}
        href={prevPage ? getHref(prevPage) : '#'}
      >
        ← Prev
      </Link>

      {/* First page + ellipsis if needed */}
      {showFirstEllipsis && (
        <>
          <Link
            className="h-9 w-9 sm:h-10 sm:w-10 inline-flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href={getHref(1)}
          >
            1
          </Link>
          <span className="px-1 text-gray-400 dark:text-gray-500">...</span>
        </>
      )}

      {/* Visible page numbers */}
      {visiblePages.map((pageNum) => {
        const isActive = pageNum === safePage
        return (
          <Link
            key={pageNum}
            aria-current={isActive ? 'page' : undefined}
            className={`h-9 w-9 sm:h-10 sm:w-10 inline-flex items-center justify-center rounded border text-sm font-medium transition-colors ${
              isActive
                ? 'border-[#1a1a2e] bg-[#1a1a2e] text-white'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            href={getHref(pageNum)}
          >
            {pageNum}
          </Link>
        )
      })}

      {/* Last page + ellipsis if needed */}
      {showLastEllipsis && (
        <>
          <span className="px-1 text-gray-400 dark:text-gray-500">...</span>
          <Link
            className="h-9 w-9 sm:h-10 sm:w-10 inline-flex items-center justify-center rounded border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            href={getHref(totalPages)}
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Next button */}
      <Link
        aria-label="Next page"
        className={`px-2 sm:px-3 py-2 rounded border text-sm font-medium transition-colors ${
          nextPage
            ? 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            : 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed pointer-events-none'
        }`}
        href={nextPage ? getHref(nextPage) : '#'}
      >
        Next →
      </Link>
    </nav>
  )
}
