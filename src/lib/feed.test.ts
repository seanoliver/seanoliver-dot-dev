import { describe, expect, it } from 'vitest'

import { buildRssFeed, escapeXml, type FeedEntry } from '@/lib/feed'

const olderPublished: FeedEntry = {
  title: 'Older Post <Tags> & "Quotes"',
  summary: 'Contains a ]]> sequence & an ampersand',
  publishedAt: '2024-01-15T00:00:00.000Z',
  canonicalUrl: 'https://seanoliver.dev/blog/older-post',
  isPublished: true,
}

const newerPublished: FeedEntry = {
  title: 'Newer Post',
  summary: 'The most recent summary',
  publishedAt: '2024-06-01T00:00:00.000Z',
  canonicalUrl: 'https://seanoliver.dev/blog/newer-post',
  isPublished: true,
}

const draft: FeedEntry = {
  title: 'Secret Draft Post',
  summary: 'This draft must never appear in the feed',
  publishedAt: '2024-07-01T00:00:00.000Z',
  canonicalUrl: 'https://seanoliver.dev/blog/secret-draft-post',
  isPublished: false,
}

// Intentionally unsorted input with a draft mixed in.
const entries: FeedEntry[] = [olderPublished, draft, newerPublished]

describe('escapeXml', () => {
  it('escapes each XML special character exactly once', () => {
    expect(escapeXml(`& < > " '`)).toBe('&amp; &lt; &gt; &quot; &apos;')
    expect(escapeXml('a & b')).not.toContain('&amp;amp;')
  })

  it('neutralizes ]]> so it cannot terminate a CDATA section', () => {
    expect(escapeXml('before]]>after')).not.toContain(']]>')
  })
})

describe('buildRssFeed', () => {
  it('escapes item titles and descriptions exactly once', () => {
    const feed = buildRssFeed(entries)

    expect(feed).toContain('Older Post &lt;Tags&gt; &amp; &quot;Quotes&quot;')
    expect(feed).toContain('Contains a ]]&gt; sequence &amp; an ampersand')
    expect(feed).not.toContain('&amp;amp;')
    expect(feed).not.toContain('&amp;lt;')
  })

  it('never emits a raw ]]> that could terminate CDATA', () => {
    const feed = buildRssFeed(entries)

    expect(feed).not.toContain(']]>')
  })

  it('excludes unpublished entries', () => {
    const feed = buildRssFeed(entries)

    expect(feed).not.toContain('Secret Draft Post')
    expect(feed).not.toContain(draft.canonicalUrl)
  })

  it('sorts entries newest first', () => {
    const feed = buildRssFeed(entries)

    const newerIndex = feed.indexOf('Newer Post')
    const olderIndex = feed.indexOf('Older Post')
    expect(newerIndex).toBeGreaterThan(-1)
    expect(olderIndex).toBeGreaterThan(-1)
    expect(newerIndex).toBeLessThan(olderIndex)
  })

  it('uses the canonical URL from the entry for every link and GUID', () => {
    const feed = buildRssFeed(entries)

    expect(feed).toContain(`<link>${newerPublished.canonicalUrl}</link>`)
    expect(feed).toContain(
      `<guid isPermaLink="true">${newerPublished.canonicalUrl}</guid>`
    )
    expect(feed).toContain(`<link>${olderPublished.canonicalUrl}</link>`)
    expect(feed).toContain(
      `<guid isPermaLink="true">${olderPublished.canonicalUrl}</guid>`
    )
  })

  it('stamps each item pubDate from the entry publishedAt', () => {
    const feed = buildRssFeed(entries)

    expect(feed).toContain('<pubDate>Sat, 01 Jun 2024 00:00:00 GMT</pubDate>')
  })

  it('omits lastBuildDate and items when nothing is published', () => {
    for (const feed of [buildRssFeed([]), buildRssFeed([draft])]) {
      expect(feed).toContain('<channel>')
      expect(feed).toContain('<title>Sean Oliver</title>')
      expect(feed).not.toContain('<lastBuildDate>')
      expect(feed).not.toContain('<item>')
    }
  })

  it('drops entries whose publishedAt cannot be parsed', () => {
    const invalidDate: FeedEntry = {
      title: 'Broken Date Post',
      summary: 'This entry has an unparseable date',
      publishedAt: 'not-a-date',
      canonicalUrl: 'https://seanoliver.dev/blog/broken-date-post',
      isPublished: true,
    }

    const feed = buildRssFeed([...entries, invalidDate])

    expect(feed).not.toContain('Broken Date Post')
    expect(feed).not.toContain('Invalid Date')
    expect(feed).toContain('Newer Post')
  })
})
