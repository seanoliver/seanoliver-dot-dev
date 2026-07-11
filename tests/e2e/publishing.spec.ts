import { test, expect } from '@playwright/test'

const SITE_URL = 'https://seanoliver.dev'

const PUBLISHED_POSTS = [
  {
    path: '/nextjs-contentlayer',
    title: 'My Next.js + Contentlayer Blog Setup',
  },
  {
    path: '/scroll-links',
    title: 'Scrolling Anchor Links in React',
  },
]

const DRAFT_POST_PATH = '/ai-function-calling'

const STATIC_ROUTE_PATHS = new Set([
  '/',
  '/posts',
  '/experience',
  '/projects',
  '/about',
])

test('/posts serves both published titles in the initial HTML', async ({
  request,
}) => {
  const response = await request.get('/posts')
  expect(response.status()).toBe(200)

  const html = await response.text()
  for (const post of PUBLISHED_POSTS) {
    expect(html, `initial HTML should contain "${post.title}"`).toContain(
      post.title
    )
  }
})

test('draft post returns 404 in the production build', async ({ request }) => {
  const response = await request.get(DRAFT_POST_PATH)
  expect(response.status()).toBe(404)
})

test('sitemap lists canonical post paths and every post URL resolves', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)

  const xml = await response.text()
  const locs = (xml.match(/<loc>.*?<\/loc>/g) ?? []).map((tag) =>
    tag.replace(/<\/?loc>/g, '')
  )

  for (const post of PUBLISHED_POSTS) {
    expect(locs, `sitemap should list ${SITE_URL}${post.path}`).toContain(
      `${SITE_URL}${post.path}`
    )
  }

  const postLocs = locs.filter(
    (loc) => !STATIC_ROUTE_PATHS.has(new URL(loc).pathname)
  )
  expect(postLocs.length).toBeGreaterThan(0)

  for (const loc of postLocs) {
    const postResponse = await request.get(new URL(loc).pathname)
    expect(postResponse.status(), `${loc} should return 200`).toBe(200)
  }
})

test('post OG image URL carries a non-empty title parameter', async ({
  page,
}) => {
  await page.goto('/nextjs-contentlayer')

  const ogImage = page.locator('meta[property="og:image"]').first()
  const content = await ogImage.getAttribute('content')
  expect(content).toBeTruthy()

  const title = new URL(content as string).searchParams.get('title')
  expect(title?.trim()).toBeTruthy()
  expect(title).toBe('My Next.js + Contentlayer Blog Setup')
})

test('/posts exposes a discoverable RSS feed link in <head>', async ({
  page,
}) => {
  await page.goto('/posts')

  const rssLink = page.locator(
    'head link[rel="alternate"][type="application/rss+xml"]'
  )
  await expect(rssLink).toHaveCount(1)
  expect(await rssLink.getAttribute('href')).toContain('/feed.xml')
})
