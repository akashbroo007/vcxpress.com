import {apiJson, hasOnlyAllowedKeys, isPlainObject, rateLimit, readJsonBody} from '@/lib/apiSecurity'

import {getAdminFirestore} from '@/lib/firebaseAdmin'

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

type Body = {
  email?: string
}

export async function POST(req: Request) {
  const limited = rateLimit(req, {id: 'unsubscribe', limit: 20, windowMs: 60_000, burst: 40, skipIfBot: false})
  if (limited) return limited

  const parsed = await readJsonBody(req, {maxBytes: 2_000})
  if (!parsed.ok) return parsed.response

  if (!isPlainObject(parsed.value)) {
    return apiJson({ok: false, error: 'Invalid request'}, {status: 400})
  }

  if (!hasOnlyAllowedKeys(parsed.value, ['email'])) {
    return apiJson({ok: false, error: 'Invalid request'}, {status: 400})
  }

  const body = parsed.value as Body
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!email || !isValidEmail(email)) {
    return apiJson({ok: false, error: 'Email required'}, {status: 400})
  }

  if (email.length > 254) {
    return apiJson({ok: false, error: 'Email required'}, {status: 400})
  }

  const db = getAdminFirestore()
  const ref = db.collection('subscribers').doc(email)
  await ref.set(
    {
      is_active: false,
      unsubscribed_at: new Date().toISOString(),
    },
    {merge: true},
  )

  return apiJson({ok: true})
}
