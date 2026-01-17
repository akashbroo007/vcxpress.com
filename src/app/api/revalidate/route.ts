import {NextResponse} from 'next/server'
import {revalidatePath, revalidateTag} from 'next/cache'

const secret = process.env.REVALIDATE_SECRET

type WebhookDoc = {
  _type?: string
  slug?: {current?: string} | string
  categories?: Array<{slug?: {current?: string} | string}>
  category?: {slug?: {current?: string} | string} | string
}

const extractSlug = (value: unknown): string | undefined => {
  if (!value) return undefined
  if (typeof value === 'string') return value
  if (typeof value === 'object' && value) {
    const maybe = value as {current?: unknown}
    if (typeof maybe.current === 'string') return maybe.current
  }
  return undefined
}

export async function POST(req: Request) {
  if (!secret) {
    return NextResponse.json({ok: false, error: 'Missing REVALIDATE_SECRET'}, {status: 500})
  }

  const headerSecret = req.headers.get('x-revalidate-secret')
  const url = new URL(req.url)
  const querySecret = url.searchParams.get('secret')
  const provided = headerSecret ?? querySecret

  if (provided !== secret) {
    return NextResponse.json({ok: false, error: 'Unauthorized'}, {status: 401})
  }

  let payload: WebhookDoc = {}
  try {
    payload = (await req.json()) as WebhookDoc
  } catch {
    payload = {}
  }

  const docType = payload._type
  const slug = extractSlug(payload.slug)

  const categorySlugs = new Set<string>()
  const legacyCategorySlug = extractSlug(payload.category)
  if (legacyCategorySlug) categorySlugs.add(legacyCategorySlug)

  if (Array.isArray(payload.categories)) {
    for (const c of payload.categories) {
      const s = extractSlug(c?.slug)
      if (s) categorySlugs.add(s)
    }
  }

  // Broad tags
  revalidateTag('articles', 'page')
  revalidateTag('categories', 'page')

  // Paths that commonly depend on latest content
  revalidatePath('/', 'page')
  revalidatePath('/news', 'page')
  revalidatePath('/articles', 'page')
  revalidatePath('/categories', 'page')

  if (docType === 'article' && slug) {
    revalidateTag(`article:${slug}`, 'page')
    revalidatePath(`/news/${slug}`, 'page')
    revalidatePath(`/articles/${slug}`, 'page')
  }

  if (docType === 'category') {
    if (slug) {
      revalidateTag(`category:${slug}`, 'page')
      revalidatePath(`/categories/${slug}`, 'page')
    }
  }

  for (const cs of categorySlugs) {
    revalidateTag(`category:${cs}`, 'page')
    revalidatePath(`/categories/${cs}`, 'page')
  }

  return NextResponse.json({ok: true, type: docType ?? null, slug: slug ?? null, categories: Array.from(categorySlugs)})
}
