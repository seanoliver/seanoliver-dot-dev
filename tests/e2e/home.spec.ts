import { test, expect } from '@playwright/test'

test('homepage leads with the featured Sudoku card', async ({ page }) => {
  await page.goto('/')

  const card = page.locator('article').filter({ hasText: 'Sudoku' })
  await expect(card).toBeVisible()
  await expect(card.getByRole('link', { name: 'Play Sudoku' })).toHaveAttribute(
    'href',
    'https://sudoku.seanoliver.dev'
  )
})

test('footer links to the writing index', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Writing', exact: true }).click()
  await expect(page).toHaveURL(/\/writing$/)
})
