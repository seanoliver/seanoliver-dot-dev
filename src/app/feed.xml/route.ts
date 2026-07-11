import { allPosts } from 'contentlayer/generated'

import { buildRssFeed, SITE_URL, type FeedEntry } from '@/lib/feed'

export async function GET(): Promise<Response> {
  try {
    const entries: FeedEntry[] = allPosts
      .filter((post) => post?.title && post?.date && post?.summary && post?.url)
      .map((post) => ({
        title: post.title,
        summary: post.summary,
        publishedAt: post.date,
        canonicalUrl: `${SITE_URL}${post.url}`,
        isPublished: Boolean(post.isPublished),
      }))

    const rssFeed = buildRssFeed(entries)

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
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}
