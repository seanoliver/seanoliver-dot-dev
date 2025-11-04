'use client'

import { useEffect } from 'react'

/**
 * JavaScript fallback for reading progress in browsers without CSS scroll-timeline support
 * Updates progress via CSS custom property and ARIA attributes
 */
export function ReadingProgressFallback() {
  useEffect(() => {
    // Skip if browser supports CSS scroll-timeline
    if (
      typeof CSS !== 'undefined' &&
      CSS.supports &&
      CSS.supports('animation-timeline', 'scroll()')
    ) {
      return
    }

    const progressBar = document.querySelector('[data-reading-progress]')
    if (!progressBar) return

    const updateProgress = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const scrollPosition = window.scrollY
      const progress = scrollHeight > 0 ? scrollPosition / scrollHeight : 0
      const clampedProgress = Math.min(Math.max(progress, 0), 1)

      // Update CSS custom property for styling
      ;(progressBar as HTMLElement).style.setProperty(
        '--progress',
        clampedProgress.toString()
      )

      // Update ARIA attribute for screen readers
      progressBar.setAttribute(
        'aria-valuenow',
        Math.round(clampedProgress * 100).toString()
      )
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })
    updateProgress()

    return () => {
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return null
}
