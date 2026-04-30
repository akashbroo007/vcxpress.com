'use client'

import {useState} from 'react'

import TurnstileWidget from '@/components/TurnstileWidget'

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

const looksLikeRandomString = (value: string) => {
  const s = value.trim()
  if (!s) return false
  if (!/\s/.test(s)) return true

  const letters = s.replace(/[^a-z]/gi, '')
  if (letters.length >= 12 && !/[aeiou]/i.test(letters)) return true
  return false
}

export default function ContactForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const submit = async (event?: React.FormEvent) => {
    event?.preventDefault()
    const nameTrimmed = fullName.trim()
    const emailTrimmed = email.trim().toLowerCase()
    const subjectTrimmed = subject.trim()
    const messageTrimmed = message.trim()
    const honeypot = companyWebsite.trim()
    const captchaTrimmed = captchaToken.trim()

    if (!nameTrimmed || nameTrimmed.length < 2) {
      setStatus('error')
      setError('Full name is required')
      return
    }

    if (!emailTrimmed || !isValidEmail(emailTrimmed)) {
      setStatus('error')
      setError('Enter a valid email address')
      return
    }

    if (emailTrimmed.length > 254) {
      setStatus('error')
      setError('Email address is too long')
      return
    }

    if (!subjectTrimmed) {
      setStatus('error')
      setError('Select a subject')
      return
    }

    if (!messageTrimmed) {
      setStatus('error')
      setError('Message is required')
      return
    }

    if (messageTrimmed.length < 30) {
      setStatus('error')
      setError('Please provide a more detailed message (at least 30 characters).')
      return
    }

    if (!/\s/.test(messageTrimmed)) {
      setStatus('error')
      setError('Please include a few words so we can understand your message.')
      return
    }

    if (looksLikeRandomString(messageTrimmed)) {
      setStatus('error')
      setError('Please rewrite your message with more detail.')
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
      const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
      if (!siteKey) {
        setStatus('error')
        setError('Contact form is temporarily unavailable. Please try again later.')
        return
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          fullName: nameTrimmed,
          email: emailTrimmed,
          subject: subjectTrimmed,
          message: messageTrimmed,
          // Honeypot field: real users never fill this. Bots often do.
          company_website: honeypot,
          captchaToken: captchaTrimmed,
        }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as
          | {
              error?: string
              status?: number
              details?: unknown
            }
          | null
        setStatus('error')

        const base = typeof data?.error === 'string' ? data.error : 'Failed to send message'
        const statusText = typeof data?.status === 'number' ? ` (provider status ${data.status})` : ''
        let detailText = ''
        if (typeof data?.details === 'string') detailText = `: ${data.details}`
        else if (data?.details && typeof data.details === 'object') {
          const detailsObj = data.details as Record<string, unknown>
          if (typeof detailsObj.message === 'string') detailText = `: ${detailsObj.message}`
        }

        if (data) console.error('Contact API error:', data)
        setError(`${base}${statusText}${detailText}`)
        return
      }

      setStatus('success')
      setFullName('')
      setEmail('')
      setSubject('')
      setMessage('')
      setCompanyWebsite('')
      setCaptchaToken('')
    } catch {
      setStatus('error')
      setError('Failed to send message')
    }
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={submit}
      noValidate
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <label className="flex flex-col flex-1">
          <span className="text-[#0d121b] dark:text-gray-200 text-sm font-bold leading-normal pb-2">Full Name</span>
          <input
            className="form-input w-full rounded border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-[#1a202c] text-[#0d121b] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 px-4 text-base placeholder:text-[#9ca3af]"
            placeholder="Jane Doe"
            required
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              if (status !== 'idle') setStatus('idle')
            }}
          />
        </label>
        <label className="flex flex-col flex-1">
          <span className="text-[#0d121b] dark:text-gray-200 text-sm font-bold leading-normal pb-2">Work Email</span>
          <input
            className="form-input w-full rounded border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-[#1a202c] text-[#0d121b] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 px-4 text-base placeholder:text-[#9ca3af]"
            placeholder="name@company.com"
            required
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (status !== 'idle') setStatus('idle')
            }}
          />
        </label>
      </div>

      <div className="hidden" aria-hidden="true">
        <label>
          <span>Company website</span>
          <input
            autoComplete="off"
            tabIndex={-1}
            type="text"
            value={companyWebsite}
            onChange={(e) => {
              setCompanyWebsite(e.target.value)
            }}
          />
        </label>
      </div>
      <label className="flex flex-col flex-1">
        <span className="text-[#0d121b] dark:text-gray-200 text-sm font-bold leading-normal pb-2">Subject</span>
        <div className="relative">
          <select
            className="form-select w-full rounded border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-[#1a202c] text-[#0d121b] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 pl-4 pr-10 text-base appearance-none cursor-pointer"
            required
            value={subject}
            onChange={(e) => {
              setSubject(e.target.value)
              if (status !== 'idle') setStatus('idle')
            }}
          >
            <option disabled value="">
              Select a topic...
            </option>
            <option value="tip">News Tip</option>
            <option value="correction">Correction / Fact Check</option>
            <option value="press">Press Release</option>
            <option value="general">General Inquiry</option>
          </select>
        </div>
      </label>
      <label className="flex flex-col flex-1">
        <span className="text-[#0d121b] dark:text-gray-200 text-sm font-bold leading-normal pb-2">Message</span>
        <textarea
          className="form-textarea w-full rounded border border-[#cfd7e7] dark:border-gray-700 bg-white dark:bg-[#1a202c] text-[#0d121b] dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[200px] p-4 text-base placeholder:text-[#9ca3af] resize-y"
          placeholder="Please provide as much detail as possible. If you are sharing a sensitive tip, please indicate if you require anonymity."
          required
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            if (status !== 'idle') setStatus('idle')
          }}
        ></textarea>
      </label>

      {(() => {
        const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
        if (!siteKey) return null

        return (
          <TurnstileWidget
            siteKey={siteKey}
            action="contact"
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
        )
      })()}

      {status === 'error' ? (
        <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
      ) : null}

      {status === 'success' ? (
        <div className="rounded border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-200">Message sent successfully.</div>
      ) : null}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-start gap-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 p-3 rounded text-sm max-w-md">
          <span className="material-symbols-outlined text-gray-500 text-[20px] shrink-0">lock</span>
          <p>We respect your privacy. All communications regarding news tips are kept strictly confidential.</p>
        </div>
        <button
          className="w-full sm:w-auto min-w-[160px] h-12 rounded bg-[#1a1a2e] hover:bg-[#252542] transition-colors text-white text-base font-semibold shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={status === 'loading' || !captchaToken}
          aria-disabled={status === 'loading' || !captchaToken}
        >
          <span>{status === 'loading' ? 'Sending…' : 'Send Message'}</span>
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>
    </form>
  )
}
