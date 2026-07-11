import { test, expect } from '@playwright/test'

const SITE_URL = 'https://seanoliver.dev'

const PUBLISHED_ENTRIES = [
  {
    slug: 'nextjs-contentlayer',
    title: 'My Next.js + Contentlayer Blog Setup',
  },
  {
    slug: 'scroll-links',
    title: 'Scrolling Anchor Links in React',
  },
]

// These contracts hold because content/writing/ai-function-calling.mdx has
// `status: draft`. If that entry is ever published, point these at another
// draft (or drop the draft tests if none exist).
const DRAFT_SLUG = 'ai-function-calling'

// The two pre-/writing public post URLs. They must 308 to their canonical
// /writing homes forever; the draft's old URL gets no redirect and 404s.
const LEGACY_REDIRECTS = PUBLISHED_ENTRIES.map((entry) => ({
  from: `/${entry.slug}`,
  to: `/writing/${entry.slug}`,
}))

const STATIC_ROUTE_PATHS = new Set([
  '/',
  '/posts',
  '/writing',
  '/experience',
  '/projects',
  '/about',
])

for (const path of ['/', '/posts', '/writing']) {
  test(`${path} serves both published titles in the initial HTML`, async ({
    request,
  }) => {
    const response = await request.get(path)
    expect(response.status()).toBe(200)

    const html = await response.text()
    for (const entry of PUBLISHED_ENTRIES) {
      expect(html, `initial HTML should contain "${entry.title}"`).toContain(
        entry.title
      )
      expect(
        html,
        `initial HTML should link to /writing/${entry.slug}`
      ).toContain(`/writing/${entry.slug}`)
    }
  })
}

for (const { from, to } of LEGACY_REDIRECTS) {
  test(`legacy ${from} permanently redirects to ${to}`, async ({ request }) => {
    const response = await request.get(from, { maxRedirects: 0 })
    expect(response.status(), `${from} should return 308`).toBe(308)
    expect(response.headers()['location'], `${from} Location header`).toBe(to)
  })
}

test('legacy draft URL returns 404 with no redirect', async ({ request }) => {
  const response = await request.get(`/${DRAFT_SLUG}`, { maxRedirects: 0 })
  expect(response.status()).toBe(404)
})

test('draft entry gets no /writing route in the production build', async ({
  request,
}) => {
  const response = await request.get(`/writing/${DRAFT_SLUG}`)
  expect(response.status()).toBe(404)
})

test('published /writing entry renders with highlighted code and no frontmatter leak', async ({
  request,
}) => {
  const response = await request.get('/writing/nextjs-contentlayer')
  expect(response.status()).toBe(200)

  const html = await response.text()
  expect(html, 'initial HTML should contain the article title').toContain(
    PUBLISHED_ENTRIES[0].title
  )
  // rehype-pretty-code stamps fenced blocks with their language; this
  // article contains ```bash fences, so this proves highlighting ran.
  expect(
    html,
    'fenced code should be processed by rehype-pretty-code'
  ).toContain('data-language="bash"')
  // If remark-frontmatter is ever dropped from next.config.mjs, @next/mdx
  // renders the YAML block as visible text while every assertion above still
  // passes — so prove the raw frontmatter never reaches the HTML.
  expect(
    html,
    'raw frontmatter must not leak into the rendered HTML'
  ).not.toContain('status: published')
})

test('article-body Tailwind utilities survive the production CSS build', async ({
  page,
}) => {
  // Guards against Tailwind purging the classes emitted by the root-level
  // mdx-components.tsx: if that file falls out of the content globs, the
  // classNames still appear in the DOM but the stylesheet has no rules for
  // them, so lists lose their bullets and paragraphs lose their margins.
  // Computed styles are the only honest signal — HTML-level assertions pass
  // either way.
  await page.goto('/writing/nextjs-contentlayer')

  const article = page.locator('article')
  await expect(article).toHaveCount(1)

  // ul gets `list-disc` from mdx-components.tsx.
  const list = article.locator('ul').first()
  await expect(list).toBeVisible()
  const listStyleType = await list.evaluate(
    (el) => getComputedStyle(el).listStyleType
  )
  expect(listStyleType, 'ul should render disc bullets (.list-disc)').toBe(
    'disc'
  )

  // MDX paragraphs get `leading-7 [&:not(:first-child)]:mt-6`; the variant
  // only fires on paragraphs that are not their parent's first child, so
  // mirror that condition in the selector.
  const laterParagraph = article
    .locator('p.leading-7:not(:first-child)')
    .first()
  await expect(laterParagraph).toBeVisible()
  const marginTop = await laterParagraph.evaluate((el) =>
    parseFloat(getComputedStyle(el).marginTop)
  )
  expect(
    marginTop,
    'non-first MDX p should have a nonzero margin-top (mt-6)'
  ).toBeGreaterThan(0)
})

test('published entry exposes canonical, OG, and JSON-LD metadata from one URL', async ({
  page,
}) => {
  await page.goto('/writing/nextjs-contentlayer')
  const canonicalUrl = `${SITE_URL}/writing/nextjs-contentlayer`

  const canonical = page.locator('head link[rel="canonical"]')
  await expect(canonical).toHaveAttribute('href', canonicalUrl)

  const ogUrl = page.locator('head meta[property="og:url"]')
  await expect(ogUrl).toHaveAttribute('content', canonicalUrl)

  const description = page.locator('head meta[name="description"]')
  expect(await description.getAttribute('content')).toBeTruthy()

  const jsonLd = page.locator('script[type="application/ld+json"]').first()
  const schema = JSON.parse((await jsonLd.textContent()) as string)
  expect(schema['@type']).toBe('BlogPosting')
  expect(schema.url).toBe(canonicalUrl)
  expect(schema.headline).toBe(PUBLISHED_ENTRIES[0].title)
})

test('entry OG image URL carries a non-empty title parameter', async ({
  page,
}) => {
  await page.goto('/writing/nextjs-contentlayer')

  const ogImage = page.locator('meta[property="og:image"]').first()
  const content = await ogImage.getAttribute('content')
  expect(content).toBeTruthy()

  const title = new URL(content as string).searchParams.get('title')
  expect(title?.trim()).toBeTruthy()
  expect(title).toBe(PUBLISHED_ENTRIES[0].title)
})

test('sitemap lists canonical /writing paths and every URL resolves', async ({
  request,
}) => {
  const response = await request.get('/sitemap.xml')
  expect(response.status()).toBe(200)

  const xml = await response.text()
  const locs = (xml.match(/<loc>.*?<\/loc>/g) ?? []).map((tag) =>
    tag.replace(/<\/?loc>/g, '')
  )

  for (const entry of PUBLISHED_ENTRIES) {
    expect(
      locs,
      `sitemap should list ${SITE_URL}/writing/${entry.slug}`
    ).toContain(`${SITE_URL}/writing/${entry.slug}`)
  }
  expect(xml, 'sitemap must not list the draft').not.toContain(DRAFT_SLUG)

  const entryLocs = locs.filter(
    (loc) => !STATIC_ROUTE_PATHS.has(new URL(loc).pathname)
  )
  expect(entryLocs.length).toBeGreaterThan(0)

  for (const loc of locs) {
    const locResponse = await request.get(new URL(loc).pathname)
    expect(locResponse.status(), `${loc} should return 200`).toBe(200)
  }
})

test('feed.xml links and GUIDs are canonical /writing URLs', async ({
  request,
}) => {
  const response = await request.get('/feed.xml')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/xml')

  const xml = await response.text()
  for (const entry of PUBLISHED_ENTRIES) {
    const canonicalUrl = `${SITE_URL}/writing/${entry.slug}`
    expect(xml, `feed should link ${canonicalUrl}`).toContain(
      `<link>${canonicalUrl}</link>`
    )
    expect(xml, `feed GUID should be ${canonicalUrl}`).toContain(
      `<guid isPermaLink="true">${canonicalUrl}</guid>`
    )
  }
  expect(xml, 'feed must not list the draft').not.toContain(DRAFT_SLUG)
})

test('/writing exposes a discoverable RSS feed link in <head>', async ({
  page,
}) => {
  await page.goto('/writing')

  const rssLink = page.locator(
    'head link[rel="alternate"][type="application/rss+xml"]'
  )
  await expect(rssLink).toHaveCount(1)
  expect(await rssLink.getAttribute('href')).toContain('/feed.xml')
})
