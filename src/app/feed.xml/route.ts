import { allPosts } from 'contentlayer/generated'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://seanoliver.dev'
const AUTHOR = {
  name: 'Sean Oliver',
  email: 'sean@seanoliver.dev',
} as const

/**
 * Escape XML special characters and CDATA end sequences
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
    .replace(/]]>/g, ']]&gt;')
}

export async function GET(): Promise<Response> {
  try {
    // Filter published posts and sort by date
    const publishedPosts = allPosts
      .filter((post) => post?.isPublished && post?.title && post?.date && post?.summary && post?.url)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Get the latest post date for lastBuildDate
    const latestPostDate = publishedPosts.length > 0
      ? new Date(publishedPosts[0].date)
      : new Date()

    const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Sean Oliver</title>
    <link>${SITE_URL}</link>
    <description>Blog posts about programming, productivity, and personal knowledge management by Sean Oliver, Growth Engineer at Supabase.</description>
    <language>en-US</language>
    <lastBuildDate>${latestPostDate.toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>${AUTHOR.email} (${AUTHOR.name})</managingEditor>
    <webMaster>${AUTHOR.email} (${AUTHOR.name})</webMaster>

    ${publishedPosts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${escapeXml(post.title)}]]></title>
      <link>${SITE_URL}${post.url}</link>
      <guid isPermaLink="true">${SITE_URL}${post.url}</guid>
      <description><![CDATA[${escapeXml(post.summary)}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${AUTHOR.email} (${AUTHOR.name})</author>
    </item>`
      )
      .join('')}
  </channel>
</rss>`

    return new Response(rssFeed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('[rss] Feed generation failed:', error)
    return new Response('Feed generation failed', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    })
  }
}
