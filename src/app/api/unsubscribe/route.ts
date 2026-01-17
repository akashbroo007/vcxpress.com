import {NextResponse} from 'next/server'

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
    return NextResponse.json({ok: false, error: 'Unsubscribe failed'}, {status: 500})
  }

  let body: Body = {}
  try {
    body = (await req.json()) as Body
  } catch {
    body = {}
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ok: false, error: 'Email required'}, {status: 400})
  }

  const {error} = await supabase
    .from('subscribers')
    .update({
      is_active: false,
      unsubscribed_at: new Date().toISOString(),
    })
    .eq('email', email)

  if (error) {
    return NextResponse.json({ok: false, error: 'Unsubscribe failed'}, {status: 500})
  }

  return NextResponse.json({ok: true})
}
