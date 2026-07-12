import { describe, expect, it } from 'vitest'

import type { ContentEntry } from '@/content'

import {
  NEWSLETTER_CTA,
  emailEditionLink,
  entryJsonLdType,
  toWritingListItem,
} from './writing-presentation'

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

describe('newsletter signup affordance', () => {
  it('pins the Substack URL and label of the signup link', () => {
    // The affordance is a plain labeled link (no iframe embed): rendering
    // must never depend on a live Substack response. The URL is the public
    // newsletter home that the nav already links.
    expect(NEWSLETTER_CTA).toEqual({
      href: 'https://newsletter.seanoliver.dev/',
      label: 'Subscribe to the newsletter',
    })
  })
})

describe('email edition link projection', () => {
  it('exposes an email-edition link for a selected entry with a substackUrl', () => {
    // No published entry carries distribution fields yet, so this projection
    // contract is the guard until one does (there is no e2e surface).
    const entry = makeEntry({
      kind: 'article',
      status: 'published',
      title: 'A Distributed Article',
      summary: 'Sent by email too.',
      publishedAt: '2026-05-01',
      email: 'selected',
      substackUrl: 'https://newsletter.seanoliver.dev/p/a-distributed-article',
      emailedAt: '2026-05-02',
    })

    expect(emailEditionLink(entry.metadata)).toEqual({
      href: 'https://newsletter.seanoliver.dev/p/a-distributed-article',
      label: 'Also sent as an email edition',
    })
  })

  it('returns nothing for entries never distributed by email', () => {
    const entry = makeEntry({
      kind: 'article',
      status: 'published',
      title: 'A Site-Only Article',
      summary: 'Canonical here only.',
      publishedAt: '2026-04-01',
    })

    expect(emailEditionLink(entry.metadata)).toBeUndefined()
  })

  it('returns nothing for a selected entry whose email edition has no URL yet', () => {
    // `email: selected` marks intent; the link only exists once the edition
    // has actually been sent and its URL recorded.
    const entry = makeEntry({
      kind: 'note',
      status: 'published',
      title: 'A Selected Note',
      publishedAt: '2026-06-15',
      email: 'selected',
    })

    expect(emailEditionLink(entry.metadata)).toBeUndefined()
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
