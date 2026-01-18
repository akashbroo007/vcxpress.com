'use client'

import {useEffect, useRef} from 'react'

type ScrollProgressBarProps = {
  targetId: string
  className?: string
}

function clamp01(n: number) {
  if (n < 0) return 0
  if (n > 1) return 1
  return n
}

function getViewportHeight() {
  // visualViewport is more accurate on mobile when the URL bar expands/collapses
  return window.visualViewport?.height ?? window.innerHeight
}

export default function ScrollProgressBar({targetId, className}: ScrollProgressBarProps) {
  const barRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return

    const update = () => {
      rafRef.current = null

      const rect = target.getBoundingClientRect()
      const scrollY = window.scrollY || window.pageYOffset
      const start = rect.top + scrollY
      const viewportH = getViewportHeight()

      const end = start + target.scrollHeight - viewportH
      const denom = Math.max(1, end - start)
      const progress = clamp01((scrollY - start) / denom)

      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`
      }
    }

    const scheduleUpdate = () => {
      if (rafRef.current != null) return
      rafRef.current = window.requestAnimationFrame(update)
    }

    scheduleUpdate()

    window.addEventListener('scroll', scheduleUpdate, {passive: true})
    window.addEventListener('resize', scheduleUpdate)
    window.visualViewport?.addEventListener('resize', scheduleUpdate)

    return () => {
      if (rafRef.current != null) window.cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.visualViewport?.removeEventListener('resize', scheduleUpdate)
    }
  }, [targetId])

  return (
    <div
      ref={barRef}
      className={className}
      style={{transform: 'scaleX(0)', transformOrigin: 'left center'}}
    />
  )
}
