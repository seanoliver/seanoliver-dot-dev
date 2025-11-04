'use client'

import styles from './reading-progress.module.css'

/**
 * Reading progress indicator using CSS scroll-driven animations
 * Displays as a fixed bar at the top of the viewport
 */
export default function ReadingProgress() {
  return (
    <div className={styles.container}>
      <div
        className={styles.bar}
        role='progressbar'
        aria-label='Reading progress'
      />
    </div>
  )
}
