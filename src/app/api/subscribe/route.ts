import {NextResponse} from 'next/server'

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

type Body = {
  email?: string
  source?: string
}

export async function POST(req: Request) {
  let body: Body = {}
  try {
    body = (await req.json()) as Body
  } catch {
    body = {}
  }

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ok: false, error: 'Enter a valid email address'}, {status: 400})
  }

  // Placeholder implementation.
  // Hook this up to your provider (Mailchimp/Brevo/ConvertKit/etc.) or persist in Sanity.
  return NextResponse.json({ok: true})
}
