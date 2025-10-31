/**
 * Format a date string or Date object to a readable format
 * @param date - ISO date string or Date object
 * @param options - Intl.DateTimeFormat options
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
  return new Intl.DateTimeFormat('en-US', options).format(dateObj)
}

/**
 * Compare two dates in descending order (newest first)
 * @param a - First date
 * @param b - Second date
 * @returns Positive if a is older, negative if b is older, 0 if equal
 */
export function compareDateDesc(a: Date, b: Date): number {
  return b.getTime() - a.getTime()
}
