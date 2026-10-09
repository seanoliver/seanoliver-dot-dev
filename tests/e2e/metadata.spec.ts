import { test, expect } from '@playwright/test'

const ROUTES = [
  '/',
  '/writing',
  '/writing/nextjs-contentlayer',
  '/projects',
  '/experience',
  '/about',
  '/read',
]

const REQUIRED_TAGS = [
  'meta[name="description"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:url"]',
  'meta[property="og:image"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
  'meta[name="twitter:image"]',
]

for (const route of ROUTES) {
  test(`${route} has complete link-preview metadata`, async ({
    page,
    request,
  }) => {
    await page.goto(route)
    const head = page.locator('head')

    for (const selector of REQUIRED_TAGS) {
      const content = await head
        .locator(selector)
        .first()
        .getAttribute('content')
      expect(content?.trim(), `${route} ${selector}`).toBeTruthy()
    }

    await expect(head.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image'
    )

    const ogUrl = await head
      .locator('meta[property="og:url"]')
      .getAttribute('content')
    expect(new URL(ogUrl as string).pathname.replace(/\/$/, '')).toBe(
      route.replace(/\/$/, '')
    )

    // The tag points at production, so fetch the same path from this server.
    const ogImage = await head
      .locator('meta[property="og:image"]')
      .first()
      .getAttribute('content')
    const { pathname, search } = new URL(ogImage as string)
    const image = await request.get(pathname + search)
    expect(image.status(), `${route} og:image ${pathname}`).toBe(200)
    expect(image.headers()['content-type']).toMatch(/^image\//)
  })
}
