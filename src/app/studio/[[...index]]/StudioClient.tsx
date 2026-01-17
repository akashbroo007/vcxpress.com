'use client'

import dynamic from 'next/dynamic'
import {useEffect} from 'react'

const Studio = dynamic(
  async () => {
    const [{NextStudio}, configModule] = await Promise.all([
      import('next-sanity/studio'),
      import('../../../../sanity.config'),
    ])

    const config = configModule.default

    return function StudioWrapper() {
      return <NextStudio config={config} />
    }
  },
  {ssr: false},
)

export default function StudioClient() {
  useEffect(() => {
    const originalError = console.error

    console.error = (...args: unknown[]) => {
      const combined = args.filter((a): a is string => typeof a === 'string').join(' ')

      const isReactUnknownPropWarning =
        combined.includes('React does not recognize') && (combined.includes('disableTransition') || args.includes('disableTransition'))

      if (isReactUnknownPropWarning) return

      originalError(...args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return <Studio />
}
