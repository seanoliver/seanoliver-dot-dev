import styles from './reading-progress.module.css'

/**
 * Reading progress indicator with progressive enhancement
 * Uses CSS scroll-driven animations where supported, falls back to JavaScript
 * Displays as a fixed bar at the top of the viewport
 */
export default function ReadingProgress() {
  return (
    <div className={styles.container}>
      <div
        className={styles.bar}
        role='progressbar'
        aria-label='Reading progress'
        aria-valuenow={0}
        aria-valuemin={0}
        aria-valuemax={100}
        data-reading-progress
      />
    </div>
  )
}
