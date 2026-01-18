import {apiJson, hasOnlyAllowedKeys, isPlainObject, rateLimit, readJsonBody} from '@/lib/apiSecurity'

import {createClient} from '@supabase/supabase-js'

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

type Body = {
  email?: string
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseServiceRoleKey ? createClient(supabaseUrl, supabaseServiceRoleKey) : null

export async function POST(req: Request) {
  if (!supabase) {
    return apiJson({ok: false, error: 'Unsubscribe failed'}, {status: 500})
  }

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

  const {error} = await supabase
    .from('subscribers')
    .update({
      is_active: false,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('email', email)

  if (error) {
    return apiJson({ok: false, error: 'Unsubscribe failed'}, {status: 500})
  }

  return apiJson({ok: true})
}
