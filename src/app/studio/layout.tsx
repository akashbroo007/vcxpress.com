import type React from 'react'

import './studio.css'
import ScrollEdgeHelper from './ScrollEdgeHelper'

export default function StudioLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="sanity-studio-scope">
      <ScrollEdgeHelper />
      {children}
    </div>
  )
}
