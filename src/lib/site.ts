/**
 * Site-wide identity configuration. The site URL and author identity live
 * here — never in per-file frontmatter — and feed the content domain, RSS,
 * sitemap, metadata, and JSON-LD.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://seanoliver.dev'

export const SITE_AUTHOR = {
  name: 'Sean Oliver',
  email: 'sean@seanoliver.dev',
} as const

/**
 * RSS discovery `alternates.types` entry. Next.js merges metadata shallowly
 * per top-level key, so any page that sets `alternates` (e.g. for a canonical
 * URL) replaces the layout's `alternates` entirely and must re-include this
 * to keep the feed discoverable from its <head>.
 */
export const RSS_ALTERNATE = {
  'application/rss+xml': [
    { url: `${SITE_URL}/feed.xml`, title: 'Sean Oliver RSS Feed' },
  ],
}
