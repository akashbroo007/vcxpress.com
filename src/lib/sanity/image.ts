import createImageUrlBuilder from '@sanity/image-url'
import type {SanityImageSource} from '@sanity/image-url/lib/types/types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

const builder = projectId && dataset ? createImageUrlBuilder({projectId, dataset}) : null

export function urlFor(source: SanityImageSource) {
  if (!builder) {
    throw new Error('Sanity image URL builder is not configured. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.')
  }
  return builder.image(source)
}
