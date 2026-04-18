'use client'

import {useEffect} from 'react'

export default function ScrollEdgeHelper() {
  useEffect(() => {
    const root = document.querySelector('.sanity-studio-scope') as HTMLElement | null
    if (!root) return

    let lastScrollTime = 0
    const scrollCooldown = 16 // ~60fps

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now()
      if (now - lastScrollTime < scrollCooldown) return

      // Find the scrollable element under the mouse - support both document panes AND list panes
      const target = e.target as HTMLElement
      const pane = target.closest('[data-ui="PaneContent"], [data-testid="document-pane"], [data-ui="Pane"], [data-testid="list-pane"], [data-testid="document-list-pane"]') as HTMLElement | null
      if (!pane) return

      // Check if pane can actually scroll
      const canPaneScroll = pane.scrollHeight > pane.clientHeight
      if (!canPaneScroll) return

      // Precise edge detection with small threshold
      const threshold = 2
      const atTop = pane.scrollTop <= threshold
      const atBottom = pane.scrollTop + pane.clientHeight >= pane.scrollHeight - threshold

      // If not at edge, let pane scroll normally - don't interfere
      if (!atTop && !atBottom) return

      const scrollingUp = e.deltaY < 0
      const scrollingDown = e.deltaY > 0

      // Only scroll outer page when at edge and trying to scroll past it
      const shouldScrollUp = scrollingUp && atTop
      const shouldScrollDown = scrollingDown && atBottom

      if (!shouldScrollUp && !shouldScrollDown) return

      const canPageScrollUp = window.scrollY > 0
      const canPageScrollDown = window.scrollY < document.documentElement.scrollHeight - window.innerHeight - threshold

      if (shouldScrollUp && canPageScrollUp) {
        lastScrollTime = now
        window.scrollBy({top: e.deltaY, behavior: 'auto'})
      } else if (shouldScrollDown && canPageScrollDown) {
        lastScrollTime = now
        window.scrollBy({top: e.deltaY, behavior: 'auto'})
      }
    }

    // Use capture to catch events before Sanity handles them
    root.addEventListener('wheel', handleWheel, {passive: true, capture: true})

    return () => {
      root.removeEventListener('wheel', handleWheel, {capture: true} as AddEventListenerOptions)
    }
  }, [])

  return null
}
