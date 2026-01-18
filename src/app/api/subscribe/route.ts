import {apiJson, hasOnlyAllowedKeys, isPlainObject, rateLimit, readJsonBody} from '@/lib/apiSecurity'

import {createClient} from '@supabase/supabase-js'

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

type Body = {
  email?: string
  source?: string
}

type SubscribeOkResponse = {
  ok: true
  alreadySubscribed?: boolean
  reactivated?: boolean
}

const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = supabaseUrl && supabaseServiceRoleKey ? createClient(supabaseUrl, supabaseServiceRoleKey) : null

export async function POST(req: Request) {
  if (!supabase) {
    return apiJson({ok: false, error: 'Subscription failed'}, {status: 500})
  }

  const limited = rateLimit(req, {id: 'subscribe', limit: 25, windowMs: 60_000, burst: 60, skipIfBot: false})
  if (limited) return limited

  const parsed = await readJsonBody(req, {maxBytes: 5_000})
  if (!parsed.ok) return parsed.response

  if (!isPlainObject(parsed.value)) {
    return apiJson({ok: false, error: 'Invalid request'}, {status: 400})
  }

  if (!hasOnlyAllowedKeys(parsed.value, ['email', 'source'])) {
    return apiJson({ok: false, error: 'Invalid request'}, {status: 400})
  }

  const body = parsed.value as Body

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const source = typeof body.source === 'string' ? body.source.trim() : null

  if (source && source.length > 120) {
    return apiJson({ok: false, error: 'Subscription failed'}, {status: 400})
  }

  if (!email || !isValidEmail(email)) {
    return apiJson({ok: false, error: 'Enter a valid email address'}, {status: 400})
  }

  if (email.length > 254) {
    return apiJson({ok: false, error: 'Enter a valid email address'}, {status: 400})
  }

  const {data: existing, error: existingError} = await supabase
    .from('subscribers')
    .select('is_active')
    .eq('email', email)
    .maybeSingle()

  if (existingError) {
    return apiJson({ok: false, error: 'Subscription failed'}, {status: 500})
  }

  if (existing?.is_active === true) {
    const resp: SubscribeOkResponse = {ok: true, alreadySubscribed: true}
    return apiJson(resp)
  }

  const {error} = await supabase.from('subscribers').upsert(
    {
      email,
      source,
      is_active: true,
      subscribed_at: new Date().toISOString(),
      unsubscribed_at: null,
    },
    {onConflict: 'email'},
  )

  if (error) {
    return apiJson({ok: false, error: 'Subscription failed'}, {status: 500})
  }

  const resp: SubscribeOkResponse = {ok: true, reactivated: existing?.is_active === false}
  return apiJson(resp)
}
