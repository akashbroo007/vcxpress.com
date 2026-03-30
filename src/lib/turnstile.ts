import 'server-only'

import {getClientIp} from '@/lib/apiSecurity'

type TurnstileVerifyOk = {
  ok: true
  hostname?: string
  action?: string
  cdata?: string
}

type TurnstileVerifyFail = {
  ok: false
  error: string
}

export async function verifyTurnstile(req: Request, token: string): Promise<TurnstileVerifyOk | TurnstileVerifyFail> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return {ok: false, error: 'Verification is not configured'}

  const ip = getClientIp(req)

  let res: Response
  try {
    const body = new URLSearchParams({secret, response: token})
    if (ip !== 'unknown') body.set('remoteip', ip)

    res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
      body,
    })
  } catch {
    return {ok: false, error: 'Unable to verify request. Please try again.'}
  }

  type VerifyResponse = {
    success?: boolean
    hostname?: string
    action?: string
    cdata?: string
    'error-codes'?: unknown
  }

  let data: VerifyResponse | null = null
  try {
    data = (await res.json()) as VerifyResponse
  } catch {
    data = null
  }

  if (!data?.success) {
    return {ok: false, error: 'We could not verify your submission. Please try again.'}
  }

  return {ok: true, hostname: data.hostname, action: data.action, cdata: data.cdata}
}
