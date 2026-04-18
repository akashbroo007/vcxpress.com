import {createClient} from 'next-sanity'

type SanityFetchOptions = {
  revalidate?: number
  tags?: string[]
  cache?: RequestCache
  useCdn?: boolean
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export const SANITY_API_VERSION = '2025-01-01'

const isValidDatasetName = (value: string) => /^~?[a-z0-9][a-z0-9_-]{0,63}$/.test(value)

export const isSanityConfigured = Boolean(projectId && dataset && isValidDatasetName(dataset))

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: projectId as string,
      dataset: dataset as string,
      apiVersion: SANITY_API_VERSION,
      useCdn: true,
    })
  : null

// Simple request deduplication cache for client-side requests
const pendingRequests = new Map<string, Promise<unknown>>()

export async function sanityFetch<QueryResponse>(
  query: string,
  params: Record<string, unknown> = {},
  options: SanityFetchOptions = {},
): Promise<QueryResponse> {
  if (!sanityClient) {
    const datasetHint = dataset ? ` (current NEXT_PUBLIC_SANITY_DATASET="${dataset}")` : ''
    throw new Error(
      `Sanity is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET to a valid dataset name${datasetHint}.`,
    )
  }

  const client = options.useCdn === false ? sanityClient.withConfig({useCdn: false}) : sanityClient

  // Skip deduplication for no-cache requests
  const skipDedup = options.cache === 'no-store'

  // Create a cache key from query + sorted params
  const cacheKey = JSON.stringify({query, params: Object.entries(params).sort()})
  
  // Check if there's already a pending request for this exact query (unless no-cache)
  if (!skipDedup && pendingRequests.has(cacheKey)) {
    return pendingRequests.get(cacheKey) as Promise<QueryResponse>
  }

  const fetchPromise = client.fetch<QueryResponse>(query, params, {
    cache: options.cache,
    next: {
      revalidate: options.revalidate,
      tags: options.tags,
    },
  }).finally(() => {
    // Remove from pending after request completes (success or error)
    if (!skipDedup) {
      pendingRequests.delete(cacheKey)
    }
  })

  // Store the pending request (unless no-cache)
  if (!skipDedup) {
    pendingRequests.set(cacheKey, fetchPromise)
  }

  return fetchPromise
}
