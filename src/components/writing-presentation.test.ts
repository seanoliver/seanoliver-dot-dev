import { describe, expect, it } from 'vitest'

import type { ContentEntry } from '@/content'

import { entryJsonLdType, toWritingListItem } from './writing-presentation'

/**
 * The article/note index distinction is presentation policy, so it lives in a
 * pure projection tested here. Published-note treatments are not e2e-testable
 * until a real note is published; this unit contract is the guard instead.
 */

function makeEntry(
  metadata: Partial<ContentEntry['metadata']> & {
    kind: 'article' | 'note'
    status: 'draft' | 'published'
    title: string
  }
): ContentEntry {
  return {
    slug: 'example-entry',
    sourcePath: 'content/writing/example-entry.mdx',
    metadata: {
      tags: [],
      email: 'never',
      ...metadata,
    } as ContentEntry['metadata'],
  }
}

describe('writing index projection: article/note treatments', () => {
  it('projects a published article with a date and no kind label', () => {
    const item = toWritingListItem(
      makeEntry({
        kind: 'article',
        status: 'published',
        title: 'A Full Article',
        summary: 'A summary.',
        publishedAt: '2026-03-10',
      })
    )

    expect(item).toEqual({
      slug: 'example-entry',
      href: '/writing/example-entry',
      title: 'A Full Article',
      kindLabel: undefined,
      meta: '03 10 2026',
    })
  })

  it('marks a published note with a muted "Note" kind label', () => {
    const item = toWritingListItem(
      makeEntry({
        kind: 'note',
        status: 'published',
        title: 'A Short Note',
        publishedAt: '2026-06-01',
      })
    )

    expect(item.kindLabel).toBe('Note')
    expect(item.meta).toBe('06 01 2026')
  })

  it('always shows the draft marker for drafts, with the date alongside when present', () => {
    // Dev-only preview: a draft that already carries a publishedAt must still
    // read as a draft, not as a published entry.
    const item = toWritingListItem(
      makeEntry({
        kind: 'article',
        status: 'draft',
        title: 'A Dated Draft',
        summary: 'Still unpublished.',
        publishedAt: '2023-08-16',
      })
    )

    expect(item.meta).toBe('Draft · 08 16 2023')
  })

  it('shows only the draft marker when a draft has no date yet', () => {
    const item = toWritingListItem(
      makeEntry({ kind: 'note', status: 'draft', title: 'A Fresh Draft' })
    )

    expect(item.meta).toBe('Draft')
    expect(item.kindLabel).toBe('Note')
  })
})

describe('JSON-LD type per kind', () => {
  it('keeps BlogPosting for articles', () => {
    expect(entryJsonLdType('article')).toBe('BlogPosting')
  })

  it('uses SocialMediaPosting for short-form notes', () => {
    expect(entryJsonLdType('note')).toBe('SocialMediaPosting')
  })
})
