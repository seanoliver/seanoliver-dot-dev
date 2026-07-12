import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  entryRoutePath,
  getCanonicalUrl,
  getEntryBySlug,
  getEntryRouteParams,
  getFeedEntries,
  getPublishedEntries,
  getSitemapEntries,
  getVisibleEntries,
} from './index'

/**
 * Integration tests for the public content API against the real
 * `content/writing` tree. Vitest runs with NODE_ENV=test, which the content
 * domain treats as production: drafts must be invisible everywhere.
 *
 * These tests deliberately pin the real content inventory: two published
 * articles and two drafts (an article and a summaryless note). If that
 * inventory changes, update PUBLISHED_SLUGS / DRAFT_SLUGS rather than
 * loosening the assertions.
 */

const PUBLISHED_SLUGS = ['scroll-links', 'nextjs-contentlayer'] as const
const DRAFT_SLUGS = ['ai-function-calling', 'leaving-contentlayer'] as const
const DRAFT_SLUG = DRAFT_SLUGS[0]
const NOTE_DRAFT_SLUG = DRAFT_SLUGS[1]
const SITE_URL = 'https://seanoliver.dev'

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('content API: published projections', () => {
  it('getPublishedEntries returns the published entries newest first', async () => {
    const entries = await getPublishedEntries()

    expect(entries.map((entry) => entry.slug)).toEqual([...PUBLISHED_SLUGS])
    for (const entry of entries) {
      expect(entry.metadata.status).toBe('published')
      expect(entry.metadata.publishedAt).toBeTruthy()
    }
  })

  it('getEntryBySlug resolves published slugs and rejects unknown ones', async () => {
    const entry = await getEntryBySlug('nextjs-contentlayer')

    expect(entry?.metadata.title).toBe('My Next.js + Contentlayer Blog Setup')
    expect(await getEntryBySlug('no-such-entry')).toBeUndefined()
  })

  it('getEntryRouteParams yields exactly the published slugs', async () => {
    expect(await getEntryRouteParams()).toEqual(
      PUBLISHED_SLUGS.map((slug) => ({ slug }))
    )
  })

  it('getVisibleEntries matches the published set outside development', async () => {
    const entries = await getVisibleEntries()

    expect(entries.map((entry) => entry.slug)).toEqual([...PUBLISHED_SLUGS])
  })

  it('getFeedEntries projects published entries with canonical /writing URLs', async () => {
    const entries = await getFeedEntries()

    expect(entries.map((entry) => entry.canonicalUrl)).toEqual(
      PUBLISHED_SLUGS.map((slug) => `${SITE_URL}/writing/${slug}`)
    )
    for (const entry of entries) {
      expect(entry.isPublished).toBe(true)
      expect(entry.title).toBeTruthy()
      expect(entry.summary).toBeTruthy()
      expect(entry.publishedAt).toBeTruthy()
    }
  })

  it('getSitemapEntries projects published entries with canonical URLs', async () => {
    const entries = await getSitemapEntries()

    expect(entries.map((entry) => entry.url)).toEqual(
      PUBLISHED_SLUGS.map((slug) => `${SITE_URL}/writing/${slug}`)
    )
    for (const entry of entries) {
      expect(entry.lastModified).toBeTruthy()
    }
  })

  it('getCanonicalUrl builds the one canonical /writing URL', () => {
    expect(getCanonicalUrl('nextjs-contentlayer')).toBe(
      `${SITE_URL}/writing/nextjs-contentlayer`
    )
  })
})

describe('content API: one URL across every projection', () => {
  it('a published entry resolves to the identical URL in route params, index, feed, sitemap, and metadata source', async () => {
    const slug = 'nextjs-contentlayer'
    const canonicalUrl = getCanonicalUrl(slug)

    // Route params: the slug that /writing/[slug] statically generates.
    const routeParams = await getEntryRouteParams()
    expect(routeParams).toContainEqual({ slug })
    expect(canonicalUrl.endsWith(entryRoutePath(slug))).toBe(true)

    // Index: the entry the /writing index links to via entryRoutePath.
    const indexEntry = (await getVisibleEntries()).find(
      (entry) => entry.slug === slug
    )
    expect(indexEntry).toBeDefined()
    expect(`${SITE_URL}${entryRoutePath(indexEntry!.slug)}`).toBe(canonicalUrl)

    // Feed: item link and GUID.
    const feedEntry = (await getFeedEntries()).find(
      (entry) => entry.canonicalUrl === canonicalUrl
    )
    expect(feedEntry).toBeDefined()

    // Sitemap: <loc>.
    const sitemapEntry = (await getSitemapEntries()).find(
      (entry) => entry.url === canonicalUrl
    )
    expect(sitemapEntry).toBeDefined()

    // Metadata + JSON-LD source: the route builds both from the same
    // getEntryBySlug projection and getCanonicalUrl builder.
    const metadataEntry = await getEntryBySlug(slug)
    expect(metadataEntry).toBeDefined()
    expect(getCanonicalUrl(metadataEntry!.slug)).toBe(canonicalUrl)

    // The same title feeds the page, index, and feed projections.
    expect(feedEntry!.title).toBe(metadataEntry!.metadata.title)
    expect(indexEntry!.metadata.title).toBe(metadataEntry!.metadata.title)
  })

  it('no draft appears in any projection outside development', async () => {
    const projections = [
      await getPublishedEntries(),
      await getVisibleEntries(),
      await getEntryRouteParams(),
      await getFeedEntries(),
      await getSitemapEntries(),
    ]
    for (const draftSlug of DRAFT_SLUGS) {
      expect(await getEntryBySlug(draftSlug)).toBeUndefined()
      for (const projection of projections) {
        expect(JSON.stringify(projection)).not.toContain(draftSlug)
      }
    }
  })
})

describe('content API: development draft preview', () => {
  it('drafts are routable and listed in development only', async () => {
    vi.stubEnv('NODE_ENV', 'development')

    const entry = await getEntryBySlug(DRAFT_SLUG)
    expect(entry?.metadata.status).toBe('draft')

    // The draft note exercises the notes-only optional summary against the
    // real content tree: it must be routable without one.
    const noteDraft = await getEntryBySlug(NOTE_DRAFT_SLUG)
    expect(noteDraft?.metadata.kind).toBe('note')
    expect(noteDraft?.metadata.summary).toBeUndefined()

    expect(await getEntryRouteParams()).toContainEqual({ slug: DRAFT_SLUG })
    const visibleSlugs = (await getVisibleEntries()).map(
      (visible) => visible.slug
    )
    expect(visibleSlugs).toContain(DRAFT_SLUG)
    expect(visibleSlugs).toContain(NOTE_DRAFT_SLUG)

    // Publication projections stay draft-free even in development.
    expect(JSON.stringify(await getPublishedEntries())).not.toContain(
      DRAFT_SLUG
    )
    expect(JSON.stringify(await getFeedEntries())).not.toContain(DRAFT_SLUG)
    expect(JSON.stringify(await getSitemapEntries())).not.toContain(DRAFT_SLUG)
  })
})
