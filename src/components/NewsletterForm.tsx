'use client'

import {useState} from 'react'

import TurnstileWidget from '@/components/TurnstileWidget'

type Props = {
  className?: string
  inputClassName?: string
  buttonClassName?: string
  placeholder?: string
  source?: string
  onSuccess?: () => void
}

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export default function NewsletterForm({
  className,
  inputClassName,
  buttonClassName,
  placeholder = 'EMAIL ADDRESS',
  source,
  onSuccess,
}: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string>('')
  const [successMessage, setSuccessMessage] = useState<string>('You are subscribed.')
  const [captchaToken, setCaptchaToken] = useState<string>('')

  type SubscribeErrorResponse = {
    error?: string
  }

  type SubscribeOkResponse = {
    alreadySubscribed?: boolean
  }

  const submit = async () => {
    const trimmed = email.trim().toLowerCase()
    const captchaTrimmed = captchaToken.trim()
    if (!trimmed || !isValidEmail(trimmed)) {
      setStatus('error')
      setError('Enter a valid email address')
      return
    }

    if (!captchaTrimmed) {
      setStatus('error')
      setError('Please verify you are human.')
      return
    }

    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: trimmed, source, captchaToken: captchaTrimmed}),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as SubscribeErrorResponse | null
        const message = typeof data?.error === 'string' ? data.error : 'Subscription failed'
        setStatus('error')
        setError(message)
        return
      }

      const data = (await res.json().catch(() => null)) as SubscribeOkResponse | null
      if (data?.alreadySubscribed) {
        setSuccessMessage("You're already subscribed.")
      } else {
        setSuccessMessage('You are subscribed.')
      }

      setStatus('success')
      setEmail('')
      setCaptchaToken('')
      onSuccess?.()
    } catch {
      setStatus('error')
      setError('Subscription failed')
    }
  }

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row sm:items-stretch gap-3">
        <input
          className={inputClassName}
          placeholder={placeholder}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status !== 'idle') setStatus('idle')
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
        />
        <button className={buttonClassName} type="button" onClick={submit} disabled={status === 'loading'}>
          {status === 'loading' ? 'Subscribing…' : status === 'success' ? 'Subscribed' : 'Subscribe'}
        </button>
        {status === 'error' ? <p className="text-xs text-red-600 dark:text-red-400 font-mono">{error}</p> : null}
        {status === 'success' ? (
          <p className="text-xs text-green-700 dark:text-green-400 font-mono">{successMessage}</p>
        ) : null}
      </div>

      {(() => {
        const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
        if (!siteKey) return null

        return (
          <div className="mt-3">
            <TurnstileWidget
              siteKey={siteKey}
              action="subscribe"
              onToken={(token) => {
                setCaptchaToken(token)
                if (status !== 'idle') setStatus('idle')
              }}
              onExpire={() => {
                setCaptchaToken('')
              }}
              onError={() => {
                setCaptchaToken('')
              }}
            />
          </div>
        )
      })()}
    </div>
  )
}
