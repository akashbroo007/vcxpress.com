'use client'

import {useState} from 'react'

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export default function ContactForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const submit = async () => {
    const nameTrimmed = fullName.trim()
    const emailTrimmed = email.trim().toLowerCase()
    const subjectTrimmed = subject.trim()
    const messageTrimmed = message.trim()

    if (!nameTrimmed) {
      setStatus('error')
      setError('Full name is required')
      return
    }

    if (!emailTrimmed || !isValidEmail(emailTrimmed)) {
      setStatus('error')
      setError('Enter a valid email address')
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

    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          fullName: nameTrimmed,
          email: emailTrimmed,
          subject: subjectTrimmed,
          message: messageTrimmed,
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
    } catch {
      setStatus('error')
      setError('Failed to send message')
    }
  }

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
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

      {status === 'error' ? (
        <div className="rounded border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>
      ) : null}

      {status === 'success' ? (
        <div className="rounded border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-200">Message sent successfully.</div>
      ) : null}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex items-start gap-2 text-[#4c669a] dark:text-gray-400 bg-blue-50 dark:bg-blue-900/10 p-3 rounded text-sm max-w-md">
          <span className="material-symbols-outlined text-primary text-[20px] shrink-0">lock</span>
          <p>We respect your privacy. All communications regarding news tips are kept strictly confidential.</p>
        </div>
        <button
          className="w-full sm:w-auto min-w-[160px] h-12 rounded bg-primary hover:bg-blue-700 transition-colors text-white text-base font-bold shadow-sm flex items-center justify-center gap-2"
          type="submit"
          disabled={status === 'loading'}
        >
          <span>{status === 'loading' ? 'Sending…' : 'Send Message'}</span>
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </div>
    </form>
  )
}
