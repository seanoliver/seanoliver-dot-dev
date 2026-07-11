import { SITE_AUTHOR as AUTHOR, SITE_URL } from './site'

export type FeedEntry = {
  title: string
  summary: string
  publishedAt: string
  canonicalUrl: string
  isPublished: boolean
}

/**
 * Escape XML special characters exactly once. Because `>` is escaped, the
 * `]]>` CDATA terminator can never survive escaping.
 */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Build the RSS 2.0 feed document from a plain array of entries.
 * Unpublished entries and entries with unparseable dates are excluded,
 * and items are sorted newest first. With no published entries the
 * optional <lastBuildDate> element is omitted so output stays pure.
 */
export function buildRssFeed(entries: FeedEntry[]): string {
  const publishedEntries = entries
    .filter(
      (entry) =>
        entry.isPublished &&
        !Number.isNaN(new Date(entry.publishedAt).getTime())
    )
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )

  const lastBuildDate =
    publishedEntries.length > 0
      ? `\n    <lastBuildDate>${new Date(
          publishedEntries[0].publishedAt
        ).toUTCString()}</lastBuildDate>`
      : ''

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sean Oliver</title>
    <link>${SITE_URL}</link>
    <description>Blog posts about programming, productivity, and personal knowledge management by Sean Oliver, Growth Engineer at Supabase.</description>
    <language>en-US</language>${lastBuildDate}
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>${AUTHOR.email} (${AUTHOR.name})</managingEditor>
    <webMaster>${AUTHOR.email} (${AUTHOR.name})</webMaster>

    ${publishedEntries
      .map(
        (entry) => `
    <item>
      <title>${escapeXml(entry.title)}</title>
      <link>${escapeXml(entry.canonicalUrl)}</link>
      <guid isPermaLink="true">${escapeXml(entry.canonicalUrl)}</guid>
      <description>${escapeXml(entry.summary)}</description>
      <pubDate>${new Date(entry.publishedAt).toUTCString()}</pubDate>
      <author>${AUTHOR.email} (${AUTHOR.name})</author>
    </item>`
      )
      .join('')}
  </channel>
</rss>`
}
