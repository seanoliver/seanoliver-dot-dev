/**
 * Both formatters interpret and render dates in UTC. Content dates are plain
 * `YYYY-MM-DD` strings, which `new Date()` parses as UTC midnight — formatting
 * them in the server's local timezone renders the previous day anywhere west
 * of UTC (e.g. local dev/e2e on a Mac in Pacific time). Production (Vercel)
 * already runs in UTC, so pinning UTC also makes dev match prod for the
 * timestamped Goodreads dates.
 */

/**
 * Format a date string or Date object to a readable format
 * @param date - ISO date string or Date object
 * @param options - Intl.DateTimeFormat options (may override the UTC default)
 * @returns Formatted date string (e.g., "January 1, 2024")
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    ...options,
  }).format(dateObj)
}

/**
 * Format a date string or Date object to space-separated format
 * @param date - ISO date string or Date object
 * @returns Formatted date string (e.g., "01 15 2024")
 */
export function formatDateSpaced(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getUTCDate()).padStart(2, '0')
  const year = dateObj.getUTCFullYear()
  return `${month} ${day} ${year}`
}
