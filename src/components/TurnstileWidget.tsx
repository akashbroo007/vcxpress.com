'use client'

import {useEffect, useRef} from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, params: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

let turnstileLoader: Promise<void> | null = null

function loadTurnstile() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.turnstile) return Promise.resolve()
  if (turnstileLoader) return turnstileLoader

  turnstileLoader = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src^="https://challenges.cloudflare.com/turnstile/"]')
    if (existing) {
      if (existing.getAttribute('data-turnstile-loaded') === 'true') {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve())
      existing.addEventListener('error', () => reject(new Error('Failed to load Turnstile')))
      return
    }

    const s = document.createElement('script')
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    s.async = true
    s.defer = true
    s.addEventListener('load', () => {
      s.setAttribute('data-turnstile-loaded', 'true')
      resolve()
    })
    s.addEventListener('error', () => reject(new Error('Failed to load Turnstile')))
    document.head.appendChild(s)
  })

  return turnstileLoader
}

type Props = {
  siteKey: string
  onToken: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  className?: string
  action?: string
  cData?: string
}

export default function TurnstileWidget({siteKey, onToken, onError, onExpire, className, action, cData}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  const onErrorRef = useRef(onError)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onTokenRef.current = onToken
    onErrorRef.current = onError
    onExpireRef.current = onExpire
  }, [onError, onExpire, onToken])

  useEffect(() => {
    let canceled = false

    ;(async () => {
      try {
        await loadTurnstile()
        if (canceled) return

        if (!window.turnstile) throw new Error('Turnstile not available')

        const container = containerRef.current
        if (!container) return

        if (widgetIdRef.current) return

        container.innerHTML = ''

        if (process.env.NODE_ENV !== 'production') {
          console.info('[turnstile] render', {action, hostname: window.location.hostname})
        }

        const widgetId = window.turnstile.render(container, {
          sitekey: siteKey,
          callback: (token: unknown) => {
            if (typeof token === 'string') onTokenRef.current(token)
            if (process.env.NODE_ENV !== 'production') {
              console.info('[turnstile] token received', {action, tokenLength: typeof token === 'string' ? token.length : 0})
            }
          },
          'error-callback': () => {
            if (process.env.NODE_ENV !== 'production') {
              console.warn('[turnstile] error-callback', {action, hostname: window.location.hostname})
            }
            onErrorRef.current?.()
          },
          'expired-callback': () => {
            if (process.env.NODE_ENV !== 'production') {
              console.info('[turnstile] expired-callback', {action})
            }
            onExpireRef.current?.()
          },
          action,
          cData,
        })

        widgetIdRef.current = widgetId
      } catch (e) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[turnstile] failed to initialize', e)
        }
        onErrorRef.current?.()
      }
    })()

    return () => {
      canceled = true
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // ignore
        }
      }
      widgetIdRef.current = null
    }
  }, [action, cData, siteKey])

  return (
    <div className={className}>
      <div ref={containerRef} />
    </div>
  )
}
