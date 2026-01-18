import {apiJson, hasOnlyAllowedKeys, isPlainObject, rateLimit, readJsonBody} from '@/lib/apiSecurity'

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

  const limited = rateLimit(req, {id: 'contact', limit: 20, windowMs: 60_000, burst: 40, skipIfBot: false})
  if (limited) return limited

  const parsed = await readJsonBody(req, {maxBytes: 20_000})
  if (!parsed.ok) return parsed.response

  if (!isPlainObject(parsed.value)) {
    return apiJson({ok: false, error: 'Invalid request'}, {status: 400})
  }

  if (!hasOnlyAllowedKeys(parsed.value, ['fullName', 'email', 'subject', 'message'])) {
    return apiJson({ok: false, error: 'Invalid request'}, {status: 400})
  }

  const body = parsed.value as Body

  const fullName = typeof body.fullName === 'string' ? body.fullName.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
  const message = typeof body.message === 'string' ? body.message.trim() : ''

  if (!fullName) return apiJson({ok: false, error: 'Full name is required'}, {status: 400})
  if (fullName.length > 120) return apiJson({ok: false, error: 'Full name is required'}, {status: 400})
  if (!email || !isValidEmail(email)) return apiJson({ok: false, error: 'Enter a valid email address'}, {status: 400})
  if (email.length > 254) return apiJson({ok: false, error: 'Enter a valid email address'}, {status: 400})
  if (!subject) return apiJson({ok: false, error: 'Select a subject'}, {status: 400})
  if (!['tip', 'correction', 'press', 'general'].includes(subject)) {
    return apiJson({ok: false, error: 'Select a subject'}, {status: 400})
  }
  if (!message) return apiJson({ok: false, error: 'Message is required'}, {status: 400})
  if (message.length > 5000) return apiJson({ok: false, error: 'Message is required'}, {status: 400})

  const resendKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const fromRaw = process.env.CONTACT_FROM_EMAIL
  const from = typeof fromRaw === 'string' ? normalizeEnvEmail(fromRaw) : ''
  const normalizedTo = typeof to === 'string' ? normalizeEnvEmail(to) : ''

  if (!resendKey || !normalizedTo || !from) {
    return apiJson(
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
    return apiJson(
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
    return apiJson({ok: false, error: 'Failed to send message'}, {status: 502})
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

    return apiJson(
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

  return apiJson(debug ? {ok: true, autoReply} : {ok: true})
}
