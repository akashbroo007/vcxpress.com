'use client'

import {useEffect, useRef, useState} from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, params: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
      getResponse: (widgetId: string) => string | undefined
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
    // Add crossorigin attribute for better error handling
    s.crossOrigin = 'anonymous'
    s.addEventListener('load', () => {
      s.setAttribute('data-turnstile-loaded', 'true')
      resolve()
    })
    s.addEventListener('error', () => reject(new Error('Failed to load Turnstile')))
    
    // Append to body instead of head to avoid blocking
    document.body.appendChild(s)
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
  scale?: number
}

export default function TurnstileWidget({siteKey, onToken, onError, onExpire, className, action, cData, scale = 1}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  const onErrorRef = useRef(onError)
  const onExpireRef = useRef(onExpire)
  const [loadError, setLoadError] = useState(false)

  useEffect(() => {
    onTokenRef.current = onToken
    onErrorRef.current = onError
    onExpireRef.current = onExpire
  }, [onError, onExpire, onToken])

  useEffect(() => {
    let canceled = false
    let retryCount = 0
    const maxRetries = 2

    const initTurnstile = async () => {
      try {
        await loadTurnstile()
        if (canceled) return

        if (!window.turnstile) {
          throw new Error('Turnstile not available')
        }

        const container = containerRef.current
        if (!container) return

        // Clear container safely
        while (container.firstChild) {
          container.removeChild(container.firstChild)
        }

        // Reduced console logging for cleaner output

        const widgetId = window.turnstile.render(container, {
          sitekey: siteKey,
          callback: (token: unknown) => {
            if (typeof token === 'string') onTokenRef.current(token)
          },
          'error-callback': () => {
            // Auto-retry on error
            if (retryCount < maxRetries && !canceled) {
              retryCount++
              setTimeout(() => {
                if (!canceled && window.turnstile && widgetIdRef.current) {
                  try {
                    window.turnstile.reset(widgetIdRef.current!)
                  } catch {
                    // If reset fails, re-init
                    initTurnstile()
                  }
                }
              }, 1000)
            } else {
              onErrorRef.current?.()
            }
          },
          'expired-callback': () => {
            onExpireRef.current?.()
          },
          action,
          cData,
        })

        widgetIdRef.current = widgetId
      } catch {
        if (!canceled) {
          setLoadError(true)
          onErrorRef.current?.()
        }
      }
    }

    initTurnstile()

    return () => {
      canceled = true
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current)
        } catch {
          // ignore cleanup errors
        }
      }
      widgetIdRef.current = null
    }
  }, [action, cData, siteKey])

  if (loadError) {
    return (
      <div className={`max-w-full overflow-hidden ${className || ''}`}>
        <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded">
          Security check unavailable. Please refresh the page or try again later.
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-full overflow-hidden ${className || ''}`} style={{width: 300 * scale}}>
      <div
        style={{transform: `scale(${scale})`, transformOrigin: 'top left'}}
      >
        <div 
          ref={containerRef} 
          className="w-[300px]" 
          style={{minHeight: '65px'}}
          aria-live="polite"
          role="status"
        />
      </div>
    </div>
  )
}
