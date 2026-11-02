import { test, expect, type Page } from '@playwright/test'

async function stubYouTube(page: Page): Promise<void> {
  await page.route('https://www.youtube-nocookie.com/**', (route) =>
    route.fulfill({ contentType: 'text/html', body: '<html></html>' })
  )
}

test.beforeEach(async ({ page }) => {
  await stubYouTube(page)
})

test('clicking a card opens the lightbox with the privacy embed', async ({
  page,
}) => {
  await page.goto('/travel')
  await page.getByRole('button', { name: 'Play China' }).click()

  const dialog = page.getByRole('dialog', { name: 'China video' })
  await expect(dialog).toBeVisible()
  await expect(page).toHaveURL(/\/travel#china$/)
  await expect(dialog.locator('iframe')).toHaveAttribute(
    'src',
    /^https:\/\/www\.youtube-nocookie\.com\/embed\/i_i4imzYTeE\?/
  )
})

test('Esc closes the lightbox and clears the hash', async ({ page }) => {
  await page.goto('/travel')
  await page.getByRole('button', { name: 'Play China' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()

  await page.keyboard.press('Escape')

  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(page).toHaveURL(/\/travel$/)
})

test('arrow keys step through videos and wrap', async ({ page }) => {
  await page.goto('/travel#china')
  await expect(page.getByRole('dialog', { name: 'China video' })).toBeVisible()

  await page.keyboard.press('ArrowRight')
  await expect(
    page.getByRole('dialog', { name: 'Disney Cruise video' })
  ).toBeVisible()
  await expect(page).toHaveURL(/#disney-cruise$/)

  await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('ArrowLeft')
  await expect(
    page.getByRole('dialog', { name: 'Australia & New Zealand video' })
  ).toBeVisible()
})

test('a #slug deep link opens that video on load', async ({ page }) => {
  await page.goto('/travel#disney-cruise')
  await expect(
    page.getByRole('dialog', { name: 'Disney Cruise video' })
  ).toBeVisible()
})

test('region pills filter the grid', async ({ page }) => {
  await page.goto('/travel')
  const pill = page.getByRole('button', { name: 'Americas', exact: true })
  await pill.click()

  await expect(pill).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: /^Play / })).toHaveText([
    /Disney Cruise/,
    /Miami & Cuba/,
  ])
})

test('a missing maxres thumbnail falls back to hqdefault', async ({ page }) => {
  await page.route(/\/_next\/image\?url=.*maxresdefault/, (route) =>
    route.fulfill({ status: 404 })
  )
  await page.goto('/travel')

  const thumbnail = page
    .getByRole('button', { name: 'Play China' })
    .locator('img')
  await expect(thumbnail).toHaveAttribute('src', /hqdefault/)
})

test('the image optimizer accepts YouTube thumbnail URLs', async ({
  request,
}) => {
  const url = encodeURIComponent(
    'https://i.ytimg.com/vi/i_i4imzYTeE/hqdefault.jpg'
  )
  const response = await request.get(`/_next/image?url=${url}&w=640&q=75`)
  // 400 means the host is missing from images.remotePatterns.
  expect(response.status()).not.toBe(400)
})
