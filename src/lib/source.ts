const SOURCE_MAP: Record<string, string> = {
  'news.crunchbase.com': 'Crunchbase News',
  'techcrunch.com': 'TechCrunch',
  'reuters.com': 'Reuters',
  'forbes.com': 'Forbes',
}

const STRIP_SUBDOMAINS = new Set(['www', 'news', 'm', 'mobile', 'amp'])

const TWO_PART_TLDS = new Set(['co.uk', 'com.au', 'co.in', 'co.jp', 'com.br', 'com.mx'])

function normalizeUrl(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  return `https://${trimmed}`
}

function titleCase(value: string): string {
  const v = value.replace(/[-_]+/g, ' ').trim()
  if (!v) return ''
  return v
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export function getSourceName(url: string): string {
  try {
    const normalized = normalizeUrl(url)
    if (!normalized) return 'Source'

    const u = new URL(normalized)
    const hostname = u.hostname.toLowerCase()

    const mapped = SOURCE_MAP[hostname]
    if (mapped) return mapped

    const parts = hostname.split('.').filter(Boolean)
    while (parts.length > 2 && STRIP_SUBDOMAINS.has(parts[0])) parts.shift()

    const tld2 = parts.length >= 2 ? `${parts[parts.length - 2]}.${parts[parts.length - 1]}` : ''
    const baseIndex = parts.length >= 3 && TWO_PART_TLDS.has(tld2) ? parts.length - 3 : parts.length - 2

    const base = parts[baseIndex] || hostname
    return titleCase(base)
  } catch {
    return 'Source'
  }
}

export function getSourceHref(url: string | null | undefined): string | null {
  if (typeof url !== 'string') return null
  try {
    const normalized = normalizeUrl(url)
    if (!normalized) return null
    const u = new URL(normalized)
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null
    return u.toString()
  } catch {
    return null
  }
}
