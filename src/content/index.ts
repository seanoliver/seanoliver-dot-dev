import 'server-only'

import path from 'node:path'

import { SITE_URL } from '@/lib/site'

import {
  canonicalEntryUrl,
  entryRoutePath,
  loadEntries,
  selectPublished,
  selectRoutable,
  toFeedEntries,
  toRouteParams,
  toSitemapEntries,
  type ContentEntry,
  type EntryRouteParams,
  type FeedEntryProjection,
  type PublishedContentEntry,
  type SitemapEntryProjection,
} from './files'

/**
 * Public server-only surface of the content domain. This is a thin
 * composition layer: it binds the content root, the site URL, and the draft
 * policy to the pure, unit-tested operations in `./files` and `./schema`.
 * Consumers (routes, indexes, RSS, sitemap, JSON-LD) depend on this module,
 * never on a compiler's generated output.
 */

export { entryRoutePath }
export type {
  ContentEntry,
  EntryRouteParams,
  FeedEntryProjection,
  PublishedContentEntry,
  SitemapEntryProjection,
}
export type { EntryMetadata, PublishedEntryMetadata } from './schema'

// Deliberately no module-level cache: every call re-reads the content tree,
// which keeps drafts fresh in `next dev` and is cheap at this content volume.
// Revisit with React `cache()` only if build profiling ever warrants it.
const CONTENT_ROOT = path.join(process.cwd(), 'content', 'writing')

/**
 * Draft policy lives here and only here: drafts are previewable during
 * `next dev`, and no production route, index, feed, or sitemap can see them.
 */
function includeDrafts(): boolean {
  return process.env.NODE_ENV === 'development'
}

/** The canonical URL for an entry — feeds metadata, RSS, sitemap, JSON-LD. */
export function getCanonicalUrl(slug: string): string {
  return canonicalEntryUrl(SITE_URL, slug)
}

/** All published entries, newest first. Metadata only — no compiled bodies. */
export async function getPublishedEntries(): Promise<PublishedContentEntry[]> {
  return selectPublished(await loadEntries(CONTENT_ROOT))
}

/**
 * Resolve one routable entry. Returns undefined for unknown slugs and for
 * drafts outside development, so callers can `notFound()`.
 */
export async function getEntryBySlug(
  slug: string
): Promise<ContentEntry | undefined> {
  const routable = selectRoutable(await loadEntries(CONTENT_ROOT), {
    includeDrafts: includeDrafts(),
  })
  return routable.find((entry) => entry.slug === slug)
}

/**
 * Entries for index pages, newest first: published entries in production,
 * drafts included during `next dev` so they can be previewed. Same visibility
 * policy as route resolution — an index never links to a 404.
 */
export async function getVisibleEntries(): Promise<ContentEntry[]> {
  return selectRoutable(await loadEntries(CONTENT_ROOT), {
    includeDrafts: includeDrafts(),
  })
}

/** Static params for `/writing/[slug]`; drafts appear only in development. */
export async function getEntryRouteParams(): Promise<EntryRouteParams[]> {
  return toRouteParams(
    selectRoutable(await loadEntries(CONTENT_ROOT), {
      includeDrafts: includeDrafts(),
    })
  )
}

/** Published entries projected for `buildRssFeed` in `src/lib/feed.ts`. */
export async function getFeedEntries(): Promise<FeedEntryProjection[]> {
  return toFeedEntries(await loadEntries(CONTENT_ROOT), SITE_URL)
}

/** Published entries projected for the Next.js sitemap. */
export async function getSitemapEntries(): Promise<SitemapEntryProjection[]> {
  return toSitemapEntries(await loadEntries(CONTENT_ROOT), SITE_URL)
}
