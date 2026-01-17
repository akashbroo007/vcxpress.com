import {NextResponse} from 'next/server'

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
    return NextResponse.json({ok: false, error: 'Subscription failed'}, {status: 500})
  }

  let body: Body = {}
  try {
    body = (await req.json()) as Body
  } catch {
    body = {}
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const source = typeof body.source === 'string' ? body.source.trim().slice(0, 120) : null

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ok: false, error: 'Enter a valid email address'}, {status: 400})
  }

  const {data: existing, error: existingError} = await supabase
    .from('subscribers')
    .select('is_active')
    .eq('email', email)
    .maybeSingle()

  if (existingError) {
    return NextResponse.json({ok: false, error: 'Subscription failed'}, {status: 500})
  }

  if (existing?.is_active === true) {
    const resp: SubscribeOkResponse = {ok: true, alreadySubscribed: true}
    return NextResponse.json(resp)
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
    return NextResponse.json({ok: false, error: 'Subscription failed'}, {status: 500})
  }

  const resp: SubscribeOkResponse = {ok: true, reactivated: existing?.is_active === false}
  return NextResponse.json(resp)
}
