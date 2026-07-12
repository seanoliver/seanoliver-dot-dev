import { describe, expect, it } from 'vitest'

import { formatDate, formatDateSpaced } from './date-utils'

/**
 * Frontmatter dates are plain `YYYY-MM-DD` strings, which `new Date()`
 * parses as UTC midnight. Formatting must therefore also happen in UTC:
 * a server west of UTC (local dev/e2e on a Mac in Pacific time) would
 * otherwise render every date one day early. Run the suite with
 * `TZ=America/Los_Angeles` to prove timezone independence.
 */
describe('date-utils: UTC calendar-day formatting', () => {
  it('formatDate renders an ISO date as its own calendar day in any timezone', () => {
    expect(formatDate('2023-09-21')).toBe('September 21, 2023')
  })

  it('formatDateSpaced renders an ISO date as its own calendar day in any timezone', () => {
    expect(formatDateSpaced('2023-09-21')).toBe('09 21 2023')
  })

  it('formatDate honors caller-supplied Intl options', () => {
    expect(formatDate('2023-09-21', { year: 'numeric', month: 'short' })).toBe(
      'Sep 2023'
    )
  })
})
