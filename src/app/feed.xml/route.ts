import { allPosts } from 'contentlayer/generated'

export async function GET() {
  const siteUrl = 'https://seanoliver.dev'
  const author = {
    name: 'Sean Oliver',
    email: 'sean@seanoliver.dev',
  }

  // Filter published posts and sort by date
  const publishedPosts = allPosts
    .filter((post) => post.isPublished)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Sean Oliver</title>
    <link>${siteUrl}</link>
    <description>Blog posts about programming, productivity, and personal knowledge management by Sean Oliver, Growth Engineer at Supabase.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>${author.email} (${author.name})</managingEditor>
    <webMaster>${author.email} (${author.name})</webMaster>

    ${publishedPosts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}${post.url}</link>
      <guid isPermaLink="true">${siteUrl}${post.url}</guid>
      <description><![CDATA[${post.summary}]]></description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <author>${author.email} (${author.name})</author>
      ${post.image ? `<enclosure url="${post.image}" type="image/png"/>` : ''}
    </item>`
      )
      .join('')}
  </channel>
</rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
