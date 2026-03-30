import 'server-only'

import {NextResponse} from 'next/server'

type RateLimitEntry = {
  tokens: number
  last: number
}

type RateLimitOptions = {
  id: string
  limit: number
  windowMs: number
  burst?: number
  skipIfBot?: boolean
  errorMessage?: string
}

const BOT_UA_RE =
  /(googlebot|bingbot|duckduckbot|baiduspider|yandexbot|slurp|facebookexternalhit|twitterbot|linkedinbot|embedly|quora link preview|slackbot|discordbot|telegrambot)/i

const globalForRateLimit = globalThis as unknown as {
  __vcxpress_rate_limit__?: Map<string, RateLimitEntry>
}

const rateLimitStore = globalForRateLimit.__vcxpress_rate_limit__ ?? (globalForRateLimit.__vcxpress_rate_limit__ = new Map())

const MAX_RATE_LIMIT_ENTRIES = 10000
const SWEEP_AFTER_MS = 10 * 60 * 1000

export function apiJson(data: unknown, init?: {status?: number; headers?: HeadersInit}) {
  const headers = new Headers(init?.headers)
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  headers.set('X-Frame-Options', 'DENY')

  return NextResponse.json(data, {
    status: init?.status,
    headers,
  })
}

export function isBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false
  return BOT_UA_RE.test(userAgent)
}

export function getClientIp(req: Request): string {
  const vercel = req.headers.get('x-vercel-forwarded-for')
  if (vercel) {
    const first = vercel.split(',')[0]?.trim()
    if (first) return first
  }

  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }

  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  return 'unknown'
}

function getRateLimitKey(req: Request): string {
  const ip = getClientIp(req)
  if (ip !== 'unknown') return ip

  const ua = (req.headers.get('user-agent') ?? '').slice(0, 200)
  const lang = (req.headers.get('accept-language') ?? '').slice(0, 120)

  if (ua || lang) return `ua:${ua}|lang:${lang}`

  return 'unknown'
}

function sweepStore(now: number) {
  if (rateLimitStore.size <= MAX_RATE_LIMIT_ENTRIES) return

  for (const [k, v] of rateLimitStore.entries()) {
    if (now - v.last > SWEEP_AFTER_MS) rateLimitStore.delete(k)
  }
}

export function rateLimit(req: Request, options: RateLimitOptions): NextResponse | null {
  if (options.skipIfBot && isBotUserAgent(req.headers.get('user-agent'))) {
    return null
  }

  const now = Date.now()
  sweepStore(now)

  const capacity = Math.max(1, options.burst ?? options.limit)
  const refillPerMs = options.limit / Math.max(1, options.windowMs)

  const baseKey = getRateLimitKey(req)
  const key = `${options.id}:${baseKey}`

  const current = rateLimitStore.get(key)
  if (!current) {
    rateLimitStore.set(key, {tokens: capacity - 1, last: now})
    return null
  }

  const elapsed = Math.max(0, now - current.last)
  const refilled = Math.min(capacity, current.tokens + elapsed * refillPerMs)

  if (refilled < 1) {
    const retryAfterMs = Math.ceil((1 - refilled) / refillPerMs)
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000))

    rateLimitStore.set(key, {tokens: refilled, last: now})

    return apiJson(
      {ok: false, error: options.errorMessage || 'Too many requests'},
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSeconds),
        },
      },
    )
  }

  rateLimitStore.set(key, {tokens: refilled - 1, last: now})
  return null
}

export async function readJsonBody(req: Request, options?: {maxBytes?: number}): Promise<{ok: true; value: unknown} | {ok: false; response: NextResponse}> {
  const maxBytes = options?.maxBytes ?? 10_000

  let raw = ''
  try {
    raw = await req.text()
  } catch {
    return {ok: false, response: apiJson({ok: false, error: 'Invalid request'}, {status: 400})}
  }

  if (raw.length > maxBytes) {
    return {ok: false, response: apiJson({ok: false, error: 'Payload too large'}, {status: 413})}
  }

  if (!raw) {
    return {ok: false, response: apiJson({ok: false, error: 'Invalid request'}, {status: 400})}
  }

  try {
    const parsed = JSON.parse(raw) as unknown
    return {ok: true, value: parsed}
  } catch {
    return {ok: false, response: apiJson({ok: false, error: 'Invalid JSON'}, {status: 400})}
  }
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== 'object') return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

export function hasOnlyAllowedKeys(obj: Record<string, unknown>, allowedKeys: readonly string[]): boolean {
  for (const k of Object.keys(obj)) {
    if (!allowedKeys.includes(k)) return false
  }
  return true
}

export function readRequiredEnv(name: string): string | null {
  const v = process.env[name]
  if (typeof v !== 'string') return null
  const trimmed = v.trim()
  if (!trimmed) return null
  return trimmed
}
