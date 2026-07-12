import { describe, expect, it } from 'vitest'

import { parseCurrentlyReadingShelf, parseReadShelf } from './goodreads'

/**
 * Goodreads RSS mixes two encodings within the same feed: fields whose
 * content needs escaping arrive CDATA-wrapped, plain ones don't. A parser
 * that only accepts one form silently drops the other (~40% of a real
 * feed at time of writing).
 */

const readItem = (opts: {
  title: string
  cdataTitle?: boolean
  author?: string
  readAt?: string
  rating?: number
  link?: string
}): string => {
  const {
    title,
    cdataTitle = false,
    author = 'Some Author',
    readAt = 'Mon, 02 Mar 2026 00:00:00 +0000',
    rating = 0,
    link = 'https://www.goodreads.com/review/show/1',
  } = opts
  const titleXml = cdataTitle ? `<![CDATA[${title}]]>` : title
  const readAtXml = readAt ? `<![CDATA[${readAt}]]>` : ''
  return `<item>
    <title>${titleXml}</title>
    <link><![CDATA[${link}]]></link>
    <author_name>${author}</author_name>
    <user_rating>${rating}</user_rating>
    <user_read_at>${readAtXml}</user_read_at>
    <user_date_added><![CDATA[Mon, 02 Mar 2026 05:35:25 -0800]]></user_date_added>
  </item>`
}

describe('parseReadShelf', () => {
  it('parses items whose title is plain text (no CDATA)', () => {
    const books = parseReadShelf(
      readItem({
        title: 'Flowers for Algernon',
        readAt: 'Sat, 13 Jun 2026 00:00:00 +0000',
        rating: 5,
      })
    )
    expect(books).toHaveLength(1)
    expect(books[0].title).toBe('Flowers for Algernon')
    expect(books[0].rating).toBe(5)
    expect(books[0].dateRead).toBe('Sat, 13 Jun 2026 00:00:00 +0000')
  })

  it('parses items whose title is CDATA-wrapped', () => {
    const books = parseReadShelf(
      readItem({
        title: 'Harry Potter and the Cursed Child, Parts 1 & 2',
        cdataTitle: true,
      })
    )
    expect(books).toHaveLength(1)
    expect(books[0].title).toBe(
      'Harry Potter and the Cursed Child, Parts 1 & 2'
    )
  })

  it('decodes XML entities in plain-text fields', () => {
    const books = parseReadShelf(readItem({ title: 'War &amp; Peace' }))
    expect(books[0].title).toBe('War & Peace')
  })

  it('keeps both encodings from a single mixed feed', () => {
    const xml =
      readItem({ title: 'Plain Title Book' }) +
      readItem({ title: 'CDATA Title Book', cdataTitle: true })
    expect(parseReadShelf(xml).map((b) => b.title)).toEqual(
      expect.arrayContaining(['Plain Title Book', 'CDATA Title Book'])
    )
  })

  it('sorts by read date, newest first', () => {
    const xml =
      readItem({
        title: 'Older Book',
        readAt: 'Fri, 5 Jun 2026 00:00:00 +0000',
      }) +
      readItem({
        title: 'Newest Book',
        readAt: 'Sat, 13 Jun 2026 00:00:00 +0000',
      })
    expect(parseReadShelf(xml).map((b) => b.title)).toEqual([
      'Newest Book',
      'Older Book',
    ])
  })

  it('merges multiple RSS pages and sorts across them', () => {
    const page1 = readItem({
      title: 'Page One Book',
      readAt: 'Fri, 5 Jun 2026 00:00:00 +0000',
    })
    const page2 = readItem({
      title: 'Page Two Newer Book',
      readAt: 'Sat, 13 Jun 2026 00:00:00 +0000',
    })
    expect(parseReadShelf(page1, page2).map((b) => b.title)).toEqual([
      'Page Two Newer Book',
      'Page One Book',
    ])
  })

  it('excludes shelf entries without a read date (bulk-import noise)', () => {
    const xml =
      readItem({ title: 'Undated Import', readAt: '' }) +
      readItem({
        title: 'Real Read',
        readAt: 'Sat, 13 Jun 2026 00:00:00 +0000',
      })
    expect(parseReadShelf(xml).map((b) => b.title)).toEqual(['Real Read'])
  })
})

describe('parseCurrentlyReadingShelf', () => {
  it('parses a plain-text title', () => {
    const book = parseCurrentlyReadingShelf(
      readItem({ title: 'The Ministry for the Future' })
    )
    expect(book?.title).toBe('The Ministry for the Future')
    expect(book?.dateStarted).toBe('Mon, 02 Mar 2026 05:35:25 -0800')
  })

  it('returns null for an empty feed', () => {
    expect(parseCurrentlyReadingShelf('<rss></rss>')).toBeNull()
  })
})
