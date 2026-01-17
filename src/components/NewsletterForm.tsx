'use client'

import {useState} from 'react'

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

  type SubscribeErrorResponse = {
    error?: string
  }

  const submit = async () => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !isValidEmail(trimmed)) {
      setStatus('error')
      setError('Enter a valid email address')
      return
    }

    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email: trimmed, source}),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as SubscribeErrorResponse | null
        const message = typeof data?.error === 'string' ? data.error : 'Subscription failed'
        setStatus('error')
        setError(message)
        return
      }

      setStatus('success')
      setEmail('')
      onSuccess?.()
    } catch {
      setStatus('error')
      setError('Subscription failed')
    }
  }

  return (
    <div className={className}>
      <div className="flex flex-col gap-3">
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
        {status === 'success' ? <p className="text-xs text-green-700 dark:text-green-400 font-mono">You are subscribed.</p> : null}
      </div>
    </div>
  )
}
