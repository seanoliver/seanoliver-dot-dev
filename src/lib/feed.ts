export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://seanoliver.dev'

const AUTHOR = {
  name: 'Sean Oliver',
  email: 'sean@seanoliver.dev',
} as const

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
 * Unpublished entries are excluded and items are sorted newest first.
 */
export function buildRssFeed(entries: FeedEntry[]): string {
  const publishedEntries = entries
    .filter((entry) => entry.isPublished)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )

  const lastBuildDate =
    publishedEntries.length > 0
      ? new Date(publishedEntries[0].publishedAt)
      : new Date()

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Sean Oliver</title>
    <link>${SITE_URL}</link>
    <description>Blog posts about programming, productivity, and personal knowledge management by Sean Oliver, Growth Engineer at Supabase.</description>
    <language>en-US</language>
    <lastBuildDate>${lastBuildDate.toUTCString()}</lastBuildDate>
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
