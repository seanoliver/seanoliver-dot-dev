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
