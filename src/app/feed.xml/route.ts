import { getFeedEntries } from '@/content'
import { buildRssFeed } from '@/lib/feed'

// Next 15 stopped caching GET route handlers by default; the feed derives
// entirely from build-time content, so keep the Next 14 behavior of
// prerendering it at build.
export const dynamic = 'force-static'

export async function GET(): Promise<Response> {
  try {
    // The content API already projects published-only entries with canonical
    // /writing URLs; no route-level filtering or URL building.
    const rssFeed = buildRssFeed(await getFeedEntries())

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
