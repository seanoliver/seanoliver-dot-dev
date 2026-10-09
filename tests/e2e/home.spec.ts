import { test, expect } from '@playwright/test'

test('homepage lists every featured project under Now building', async ({
  page,
}) => {
  await page.goto('/')

  const card = page.locator('article').filter({ hasText: 'Bay Ballot' })
  await expect(card).toBeVisible()
  for (const [name, href] of [
    ['Bay Ballot', 'https://bayballot.com'],
    ['Sudoku', 'https://sudoku.seanoliver.dev'],
    ['Solstice', /chromewebstore\.google\.com/],
  ] as const) {
    await expect(
      card.getByRole('link', { name: `Open ${name}` })
    ).toHaveAttribute('href', href)
  }
  for (const [name, repo] of [
    ['Bay Ballot', 'bay-ballot'],
    ['Sudoku', 'sudoku'],
    ['Solstice', 'solstice'],
  ] as const) {
    await expect(
      card.getByRole('link', { name: `View ${name} on GitHub` })
    ).toHaveAttribute('href', `https://github.com/seanoliver/${repo}`)
  }
})

test('footer links to the writing index', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Writing', exact: true }).click()
  await expect(page).toHaveURL(/\/writing$/)
})
