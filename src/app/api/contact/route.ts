import {NextResponse} from 'next/server'

type Body = {
  fullName?: string
  email?: string
  subject?: string
  message?: string
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const normalizeEnvEmail = (value: string) => {
  let v = value.trim()
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
    v = v.slice(1, -1).trim()
  }
  if (v.includes(',')) v = v.split(',')[0].trim()
  return v
}

const isValidFromField = (value: string) => {
  const v = value.trim()
  if (!v) return false

  // email@example.com
  if (isValidEmail(v)) return true

  // Name <email@example.com>
  const match = /^.+<\s*([^>\s]+)\s*>$/.exec(v)
  if (!match) return false
  return isValidEmail(match[1])
}

const parseBoolEnv = (value: string | undefined) => {
  if (!value) return false
  const v = value.trim().toLowerCase()
  return v === '1' || v === 'true' || v === 'yes' || v === 'on'
}

const getClientIp = (req: Request) => {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first
  }

  const realIp = req.headers.get('x-real-ip')
  if (realIp) return realIp.trim()

  return 'unknown'
}

type RateLimitEntry = {
  count: number
  windowStart: number
}

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000
const RATE_LIMIT_MAX = 2

const globalForRateLimit = globalThis as unknown as {
  __vcxpress_contact_rate_limit__?: Map<string, RateLimitEntry>
}

const rateLimitStore =
  globalForRateLimit.__vcxpress_contact_rate_limit__ ??
  (globalForRateLimit.__vcxpress_contact_rate_limit__ = new Map<string, RateLimitEntry>())

const subjectLabel = (value: string) => {
  switch (value) {
    case 'tip':
      return 'News Tip'
    case 'correction':
      return 'Correction / Fact Check'
    case 'press':
      return 'Press Release'
    case 'general':
      return 'General Inquiry'
    default:
      return value
  }
}

export async function POST(req: Request) {
  const debug = process.env.NODE_ENV !== 'production'
  const autoReplyEnabled = parseBoolEnv(process.env.CONTACT_AUTOREPLY_ENABLED)
  let body: Body = {}
  try {
    body = (await req.json()) as Body
  } catch {
    body = {}
  }

  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  const ip = getClientIp(req)
  const now = Date.now()
  const entry = rateLimitStore.get(ip)
  if (!entry || now - entry.windowStart >= RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(ip, {count: 1, windowStart: now})
  } else {
    if (entry.count >= RATE_LIMIT_MAX) {
      const retryAfterSeconds = Math.max(1, Math.ceil((entry.windowStart + RATE_LIMIT_WINDOW_MS - now) / 1000))
      return NextResponse.json(
        {ok: false, error: 'Too many requests. Please wait and try again.'},
        {status: 429, headers: {'Retry-After': String(retryAfterSeconds)}},
      )
    }
    entry.count += 1
    rateLimitStore.set(ip, entry)
  }

  if (!fullName) return NextResponse.json({ok: false, error: 'Full name is required'}, {status: 400})
  if (!email || !isValidEmail(email)) return NextResponse.json({ok: false, error: 'Enter a valid email address'}, {status: 400})
  if (!subject) return NextResponse.json({ok: false, error: 'Select a subject'}, {status: 400})
  if (!message) return NextResponse.json({ok: false, error: 'Message is required'}, {status: 400})

  const resendKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const fromRaw = process.env.CONTACT_FROM_EMAIL
  const from = typeof fromRaw === 'string' ? normalizeEnvEmail(fromRaw) : ''
  const normalizedTo = typeof to === 'string' ? normalizeEnvEmail(to) : ''

  if (!resendKey || !normalizedTo || !from) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Contact delivery is not configured',
        ...(debug
          ? {
              missing: {
                RESEND_API_KEY: !resendKey,
                CONTACT_TO_EMAIL: !normalizedTo,
                CONTACT_FROM_EMAIL: !from,
              },
            }
          : null),
      },
      {status: 500},
    )
  }

  if (!isValidFromField(from)) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Contact delivery is not configured',
        ...(debug ? {from} : null),
      },
      {status: 500},
    )
  }

  const subjectText = `[VCXPRESS] ${subjectLabel(subject)} — ${fullName}`
  const text = `New contact form submission\n\nName: ${fullName}\nEmail: ${email}\nSubject: ${subjectLabel(subject)}\n\nMessage:\n${message}\n`

  let res: Response
  try {
    res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [normalizedTo],
        reply_to: email,
        subject: subjectText,
        text,
      }),
    })
  } catch {
    return NextResponse.json({ok: false, error: 'Failed to send message'}, {status: 502})
  }

  if (!res.ok) {
    const contentType = res.headers.get('content-type') ?? ''
    let providerBody: unknown = null
    try {
      if (contentType.includes('application/json')) providerBody = (await res.json()) as unknown
      else providerBody = await res.text()
    } catch {
      providerBody = null
    }

    return NextResponse.json(
      {
        ok: false,
        error: 'Failed to send message',
        ...(debug
          ? {
              provider: 'resend',
              status: res.status,
              details: providerBody,
              from,
              to: normalizedTo,
            }
          : null),
      },
      {status: 502},
    )
  }

  let autoReply: unknown = null
  if (!autoReplyEnabled) {
    autoReply = debug ? {attempted: false, reason: 'CONTACT_AUTOREPLY_ENABLED is disabled'} : null
  } else if (subject !== 'general') {
    autoReply = debug ? {attempted: false, reason: 'subject is not general'} : null
  } else {
    try {
      const autoRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: [email],
          reply_to: 'contact@vcxpress.com',
          subject: 'We received your message',
          text: `Hi ${fullName},\n\nThanks for reaching out to VCXPRESS. We’ve received your message and our team will get back to you as soon as possible.\n\n— VCXPRESS`,
        }),
      })

      if (!autoRes.ok) {
        const contentType = autoRes.headers.get('content-type') ?? ''
        let providerBody: unknown = null
        try {
          if (contentType.includes('application/json')) providerBody = (await autoRes.json()) as unknown
          else providerBody = await autoRes.text()
        } catch {
          providerBody = null
        }

        autoReply = debug
          ? {attempted: true, ok: false, provider: 'resend', status: autoRes.status, details: providerBody, to: email}
          : null
      } else {
        autoReply = debug ? {attempted: true, ok: true, to: email} : null
      }
    } catch {
      autoReply = debug ? {attempted: true, ok: false, error: 'Failed to reach email provider'} : null
    }
  }

  return NextResponse.json(debug ? {ok: true, autoReply} : {ok: true})
}
