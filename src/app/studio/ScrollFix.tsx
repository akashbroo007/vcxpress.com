'use client'

import {useEffect} from 'react'

export default function ScrollFix() {
  useEffect(() => {
    // Wait for Sanity Studio to fully render
    const fixScroll = () => {
      // Find all scrollable containers in the document pane
      const studio = document.querySelector('.sanity-studio-scope')
      if (!studio) return

      // Find the main content area (right side where form is)
      const panes = studio.querySelectorAll('[data-ui="Pane"], [data-testid="document-pane"], [class*="Pane"]')
      
      panes.forEach((pane) => {
        // Check if this is the document editor pane (not the sidebar)
        const paneEl = pane as HTMLElement
        const hasForm = pane.querySelector('form, [data-testid="document-form"], [class*="DocumentForm"]')
        if (hasForm) {
          // This is the right pane with the form
          // Set it up to have only one scrollable area
          const parent = paneEl.parentElement
          if (parent) {
            parent.style.overflow = 'hidden'
            parent.style.height = '100%'
          }
          
          paneEl.style.overflow = 'hidden'
          paneEl.style.height = '100%'
          paneEl.style.display = 'flex'
          paneEl.style.flexDirection = 'column'
          
          // Find the form element and make it the only scrollable area
          const forms = pane.querySelectorAll('form, [data-testid="document-form"], [class*="FormView"]')
          forms.forEach((form) => {
            const formEl = form as HTMLElement
            formEl.style.flex = '1'
            formEl.style.overflowY = 'auto'
            formEl.style.overflowX = 'hidden'
            formEl.style.height = '100%'
            formEl.style.maxHeight = '100%'
          })
          
          // Disable scrolling on all child containers except the form
          const scrollContainers = pane.querySelectorAll('[data-ui="Box"], [data-ui="Card"], [data-ui="Container"], [data-ui="Grid"]')
          scrollContainers.forEach((container) => {
            const containerEl = container as HTMLElement
            if (!container.closest('form') && !container.querySelector('form')) {
              containerEl.style.overflow = 'visible'
            }
          })
        }
      })
      
      // Also target any element with overflow that could create double scrollbars
      const allElements = studio.querySelectorAll('*')
      allElements.forEach((el) => {
        const elHtml = el as HTMLElement
        const style = window.getComputedStyle(elHtml)
        const rect = elHtml.getBoundingClientRect()
        
        // Check if element has scrollbars
        const hasVerticalScrollbar = elHtml.scrollHeight > rect.height && style.overflowY !== 'hidden'
        const hasForm = elHtml.querySelector('form') || elHtml.closest('form')
        
        // If it has scrollbars but isn't the form, disable them
        if (hasVerticalScrollbar && !hasForm && elHtml.tagName !== 'BODY' && elHtml.tagName !== 'HTML') {
          elHtml.style.overflowY = 'hidden'
        }
      })
    }

    // Run immediately and after a delay to catch dynamically loaded content
    fixScroll()
    const timeout1 = setTimeout(fixScroll, 500)
    const timeout2 = setTimeout(fixScroll, 1000)
    const timeout3 = setTimeout(fixScroll, 2000)

    // Also run on window resize
    window.addEventListener('resize', fixScroll)

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      window.removeEventListener('resize', fixScroll)
    }
  }, [])

  return null
}
