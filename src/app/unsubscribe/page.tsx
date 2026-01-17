'use client'

import {Suspense, useEffect, useRef, useState} from 'react'

import {useSearchParams} from 'next/navigation'

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

type UnsubscribeErrorResponse = {
  error?: string
}

function UnsubscribeInner() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email')

  const email = typeof emailParam === 'string' ? emailParam.trim().toLowerCase() : ''
  const hasEmail = Boolean(email)
  const emailValid = hasEmail && isValidEmail(email)

  const [result, setResult] = useState<'success' | 'error' | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const startedRef = useRef(false)

  useEffect(() => {
    if (!emailValid) return
    if (startedRef.current) return
    startedRef.current = true

    ;(async (): Promise<void> => {
      try {
        const res = await fetch('/api/unsubscribe', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({email}),
        })

        if (!res.ok) {
          const data = (await res.json().catch(() => null)) as UnsubscribeErrorResponse | null
          const err = typeof data?.error === 'string' ? data.error : 'Unsubscribe failed'
          setResult('error')
          setErrorMessage(err)
          return
        }

        setResult('success')
      } catch {
        setResult('error')
        setErrorMessage('Unsubscribe failed')
      }
    })()
  }, [email, emailValid])

  const message = !hasEmail
    ? 'Missing email address.'
    : !emailValid
      ? 'Invalid email address.'
      : result === 'success'
        ? 'You have been unsubscribed.'
        : result === 'error'
          ? errorMessage || 'Unsubscribe failed'
          : 'Unsubscribing…'

  return (
    <div className="min-h-[60vh] bg-background-light dark:bg-background-dark text-text-dark dark:text-text-light transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-4 lg:px-8 py-16">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white">Unsubscribe</h1>
        <p className="mt-4 text-sm text-text-main dark:text-gray-300 font-mono">{message}</p>

        {hasEmail && emailValid && result === null ? (
          <p className="mt-3 text-xs text-text-subtle dark:text-gray-500">Please wait…</p>
        ) : null}
      </div>
    </div>
  )
}

export default function UnsubscribePage() {
  return (
    <Suspense>
      <UnsubscribeInner />
    </Suspense>
  )
}
