'use client'

/**
 * SWR hooks for Sanity data fetching (Client-side only)
 * Provides automatic deduplication, caching, polling, and revalidation
 *
 * IMPORTANT: This file is marked 'use client' and should only be imported
 * in Client Components. For server-side code, use sanity.client.ts directly.
 */

import useSWR, {SWRConfiguration} from 'swr'
import {mutate} from 'swr/_internal'

import {sanityFetch} from './sanity.client'

// Default SWR config optimized for Sanity CDN
const defaultSWRConfig: SWRConfiguration = {
  // Refresh interval: 60 seconds (production-friendly)
  // Reduces to 30s in development for faster feedback
  refreshInterval: process.env.NODE_ENV === 'development' ? 30000 : 60000,

  // Keep stale data visible while fetching (better UX)
  revalidateOnFocus: true,
  revalidateOnReconnect: true,

  // Deduping interval prevents duplicate requests within this window
  dedupingInterval: 2000,

  // Error retry with exponential backoff
  errorRetryCount: 3,
  errorRetryInterval: 5000,

  // Keep previous data while loading new data (prevents layout shifts)
  keepPreviousData: true,
}

/**
 * Create a SWR fetcher that uses sanityFetch
 */
function createSanityFetcher<QueryResponse>(
  query: string,
  params: Record<string, unknown> = {},
): () => Promise<QueryResponse> {
  return async (): Promise<QueryResponse> => {
    return sanityFetch<QueryResponse>(query, params)
  }
}

/**
 * Primary hook for fetching Sanity data with SWR
 *
 * @example
 * const { data: articles, error, isLoading, isValidating } = useSanityQuery(
 *   ARTICLES_LIST_QUERY,
 *   {},
 *   { refreshInterval: 30000 }
 * )
 */
export function useSanityQuery<QueryResponse>(
  query: string,
  params: Record<string, unknown> = {},
  swrOptions: SWRConfiguration = {},
) {
  // Create a stable cache key
  const cacheKey = `sanity:${query}:${JSON.stringify(Object.entries(params).sort())}`

  const fetcher = createSanityFetcher<QueryResponse>(query, params)

  const result = useSWR(
    cacheKey,
    fetcher,
    {
      ...defaultSWRConfig,
      ...swrOptions,
    },
  )

  return {
    data: result.data as QueryResponse | undefined,
    error: result.error,
    isLoading: result.isLoading,
    isValidating: result.isValidating,
    mutate: result.mutate,
  }
}

/**
 * Hook for fetching a single article by slug
 */
export function useSanityArticle<QueryResponse>(
  slug: string,
  query: string,
  swrOptions: SWRConfiguration = {},
) {
  return useSanityQuery<QueryResponse>(
    query,
    {slug},
    {
      ...swrOptions,
      // Disable auto-refresh for single articles (webhook handles updates)
      refreshInterval: 0,
    },
  )
}

/**
 * Hook for fetching paginated article lists with real-time updates
 */
export function useSanityArticlesList<QueryResponse>(
  query: string,
  params: Record<string, unknown> = {},
  swrOptions: SWRConfiguration = {},
) {
  return useSanityQuery<QueryResponse>(query, params, {
    // Default 60s polling for article lists
    refreshInterval: 60000,
    ...swrOptions,
  })
}

/**
 * Preload data into SWR cache (for SSR hydration)
 */
export function preloadSanityData<QueryResponse>(
  query: string,
  params: Record<string, unknown> = {},
  data: QueryResponse,
) {
  const cacheKey = `sanity:${query}:${JSON.stringify(Object.entries(params).sort())}`
  mutate(cacheKey, data, false)
}

/**
 * Global mutate function to trigger revalidation
 * Call this after webhook events to refresh all related queries
 */
export {mutate as mutateSanity}

/**
 * Revalidate all article-related SWR caches
 * Call this in response to Sanity webhooks
 */
export async function revalidateArticles() {
  // Revalidate all queries containing articles
  await mutate(
    (key) => typeof key === 'string' && key.includes('sanity:'),
    undefined,
    {revalidate: true},
  )
}
