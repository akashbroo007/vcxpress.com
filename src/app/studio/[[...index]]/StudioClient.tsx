'use client'

import dynamic from 'next/dynamic'

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
  return <Studio />
}
