import { test, expect } from '@playwright/test'

test.describe('Problem 09 - Role-Scoped Work-Order Queue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders only work orders from the current tenant', async ({ page }) => {
    await expect(page.locator('[data-testid="work-order-row"]')).toHaveCount(3)
    await expect(page.locator('body')).toContainText('Replace valve')
    await expect(page.locator('body')).not.toContainText('Prepare invoice')
  })

  test('searches by title or customer', async ({ page }) => {
    await page.getByTestId('search-input').fill('harbor')
    await expect(page.locator('[data-testid="work-order-row"]')).toHaveCount(1)
    await expect(page.locator('body')).toContainText('Inspect site')
  })

  test('filters by status and shows a count', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Showing 3 work orders')
    await page.getByTestId('filter-status').selectOption('blocked')
    await expect(page.locator('[data-testid="work-order-row"]')).toHaveCount(1)
    await expect(page.locator('body')).toContainText('Showing 1 work orders')
  })

  test('optimistically updates status and shows an in-flight indicator', async ({ page }) => {
    const firstRow = page.locator('[data-testid="work-order-row"]').first()
    const statusSelect = firstRow.getByTestId('status-select')
    await statusSelect.selectOption('in_progress')
    await expect(firstRow.getByTestId('status-label')).toHaveText('in_progress')
    await expect(firstRow.getByTestId('save-spinner')).toBeVisible()
    await expect(statusSelect).toBeDisabled()
    await expect(firstRow.getByTestId('save-spinner')).toBeHidden({ timeout: 1_000 })
    await expect(statusSelect).toBeEnabled()
  })
})