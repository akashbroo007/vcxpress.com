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

export function isValidImageSrc(src: unknown): src is string {
  if (typeof src !== 'string') return false
  const trimmed = src.trim()
  if (!trimmed) return false
  if (trimmed.startsWith('data:')) return true
  try {
    const u = new URL(trimmed)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export function safeSanityImageUrl(
  source: unknown,
  {width, height, fit = 'crop'}: {width: number; height: number; fit?: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'min' | 'scale'},
) {
  try {
    if (!source) return null
    const url = urlFor(source as SanityImageSource).width(width).height(height).fit(fit).auto('format').url()
    return isValidImageSrc(url) ? url : null
  } catch {
    return null
  }
}
