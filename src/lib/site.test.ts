import { describe, expect, it } from 'vitest'

import { ogImageUrl, SITE_URL } from './site'

describe('ogImageUrl', () => {
  it('returns the bare route with no options', () => {
    expect(ogImageUrl()).toBe(`${SITE_URL}/api/og`)
  })

  it('encodes title, description, and path as query parameters', () => {
    const url = new URL(
      ogImageUrl({
        title: 'Next.js + MDX',
        description: 'Notes & lessons',
        path: '/writing',
      })
    )
    expect(url.searchParams.get('title')).toBe('Next.js + MDX')
    expect(url.searchParams.get('description')).toBe('Notes & lessons')
    expect(url.searchParams.get('path')).toBe('/writing')
  })

  it('omits options that are empty', () => {
    expect(ogImageUrl({ title: '', path: '' })).toBe(`${SITE_URL}/api/og`)
  })
})
