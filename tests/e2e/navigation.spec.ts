import { test, expect } from '@playwright/test'

test.use({ viewport: { width: 390, height: 844 } })

test('mobile menu closes after navigating', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Toggle menu' }).click()
  await page.getByRole('menu').getByText('Projects').click()

  await expect(page).toHaveURL(/\/projects$/)
  await expect(page.getByRole('menu')).toBeHidden()
  await expect(page.locator('body')).not.toHaveCSS('pointer-events', 'none')
})

test('mobile menu has one pointer-cursor item per nav link', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Toggle menu' }).click()

  const items = page.getByRole('menu').getByRole('menuitem')
  await expect(items).toHaveText(['Projects', 'About', 'Read'])
  for (const item of await items.all()) {
    await expect(item).toHaveCSS('cursor', 'pointer')
  }
})

test('mobile menu navigates and closes from the keyboard', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Toggle menu' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('menu')).toBeVisible()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('menuitem', { name: 'About' })).toBeFocused()
  await page.keyboard.press('Enter')

  await expect(page).toHaveURL(/\/about$/)
  await expect(page.getByRole('menu')).toBeHidden()
})
