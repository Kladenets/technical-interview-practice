import { test, expect } from '@playwright/test'

// Run from react/:
// PRACTICE_ANSWER=practice_problem_answers/kk_answer_09_work_order_queue \
//   npx playwright test tests/test_problem_09_work_order_queue.spec.js

test.describe('Problem 09 — Role-Scoped Work-Order Queue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // ── Part 1: role-scoped visibility ────────────────────────────────────────

  test('default dispatcher sees the four org-a orders, never org-b', async ({ page }) => {
    const rows = page.getByTestId('work-order-row')
    await expect(rows).toHaveCount(4, { timeout: 1_000 })
    await expect(rows.filter({ hasText: 'Replace valve' })).toHaveCount(1, { timeout: 1_000 })
    await expect(rows.filter({ hasText: 'Confirm delivery' })).toHaveCount(1, { timeout: 1_000 })
    await expect(rows.filter({ hasText: 'Inspect site' })).toHaveCount(1, { timeout: 1_000 })
    await expect(rows.filter({ hasText: 'Service valve manifold' })).toHaveCount(1, { timeout: 1_000 })
    await expect(page.locator('body')).not.toContainText('Prepare invoice', { timeout: 1_000 })
  })

  test('each row shows title, customer, priority, and status', async ({ page }) => {
    const row = page.getByTestId('work-order-row').filter({ hasText: 'Replace valve' })
    await expect(row).toContainText('Northside Supply', { timeout: 1_000 })
    await expect(row).toContainText('high', { timeout: 1_000 })
    await expect(row.getByTestId('status-label')).toHaveText('open', { timeout: 1_000 })
    const secondRow = page.getByTestId('work-order-row').filter({ hasText: 'Confirm delivery' })
    await expect(secondRow).toContainText('Main Street Plumbing', { timeout: 1_000 })
    await expect(secondRow).toContainText('medium', { timeout: 1_000 })
    await expect(secondRow.getByTestId('status-label')).toHaveText('in_progress', { timeout: 1_000 })
  })

  test('technician sees only technician-assigned org-a orders', async ({ page }) => {
    await page.getByTestId('role-select').selectOption('technician')
    const rows = page.getByTestId('work-order-row')
    await expect(rows).toHaveCount(3, { timeout: 1_000 })
    await expect(rows.filter({ hasText: 'Confirm delivery' })).toHaveCount(1, { timeout: 1_000 })
    const inspectSite = rows.filter({ hasText: 'Inspect site' })
    await expect(inspectSite).toContainText('Harbor Mechanical', { timeout: 1_000 })
    await expect(inspectSite).toContainText('low', { timeout: 1_000 })
    await expect(inspectSite.getByTestId('status-label')).toHaveText('blocked', { timeout: 1_000 })
    await expect(rows.filter({ hasText: 'Service valve manifold' })).toHaveCount(1, { timeout: 1_000 })
    await expect(page.locator('body')).not.toContainText('Replace valve', { timeout: 1_000 })
  })

  test('manager sees all org-a orders and org-b remains hidden in every role', async ({ page }) => {
    for (const role of ['dispatcher', 'technician', 'manager']) {
      await page.getByTestId('role-select').selectOption(role)
      await expect(page.locator('body')).not.toContainText('Prepare invoice', { timeout: 1_000 })
    }
    await expect(page.locator('[data-testid="work-order-row"]')).toHaveCount(4, { timeout: 1_000 })
  })

  // ── Part 2: search and filtering ──────────────────────────────────────────

  test('searches by title and customer, case-insensitively', async ({ page }) => {
    const search = page.getByPlaceholder('Search work orders')
    await search.fill('VALVE')
    await expect(page.getByTestId('work-order-row')).toHaveCount(2, { timeout: 1_000 })
    await search.fill('harbor')
    const rows = page.getByTestId('work-order-row')
    await expect(rows).toHaveCount(2, { timeout: 1_000 })
    await expect(rows.filter({ hasText: 'Inspect site' })).toHaveCount(1, { timeout: 1_000 })
    await expect(rows.filter({ hasText: 'Service valve manifold' })).toHaveCount(1, { timeout: 1_000 })
  })

  test('no-match search shows zero rows and clearing restores four', async ({ page }) => {
    const search = page.getByPlaceholder('Search work orders')
    await search.fill('no matching order')
    await expect(page.locator('[data-testid="work-order-row"]')).toHaveCount(0, { timeout: 1_000 })
    await expect(page.locator('body')).toContainText('Showing 0 work orders', { timeout: 1_000 })
    await search.fill('')
    await expect(page.locator('[data-testid="work-order-row"]')).toHaveCount(4, { timeout: 1_000 })
  })

  test('filtering by blocked yields one row', async ({ page }) => {
    await page.getByTestId('filter-status').selectOption('blocked')
    await expect(page.locator('[data-testid="work-order-row"]')).toHaveCount(1, { timeout: 1_000 })
    await expect(page.getByTestId('work-order-row').filter({ hasText: 'Inspect site' })).toHaveCount(1, { timeout: 1_000 })
  })

  test('combines status filtering and search with AND semantics', async ({ page }) => {
    await page.getByTestId('filter-status').selectOption('blocked')
    await page.getByPlaceholder('Search work orders').fill('harbor')
    await expect(page.locator('[data-testid="work-order-row"]')).toHaveCount(1, { timeout: 1_000 })
    await expect(page.getByTestId('work-order-row').filter({ hasText: 'Inspect site' })).toHaveCount(1, { timeout: 1_000 })
  })

  test('status filter returns every matching open order', async ({ page }) => {
    await page.getByTestId('filter-status').selectOption('open')
    await expect(page.getByTestId('work-order-row')).toHaveCount(2, { timeout: 1_000 })
  })

  test('role visibility composes with status filtering', async ({ page }) => {
    await page.getByTestId('role-select').selectOption('technician')
    await page.getByTestId('filter-status').selectOption('open')
    const rows = page.getByTestId('work-order-row')
    await expect(rows).toHaveCount(1, { timeout: 1_000 })
    await expect(rows.filter({ hasText: 'Service valve manifold' })).toHaveCount(1, { timeout: 1_000 })
  })

  test('updates the exact work-order count summary', async ({ page }) => {
    await expect(page.locator('body')).toContainText('Showing 4 work orders', { timeout: 1_000 })
    await page.getByTestId('filter-status').selectOption('open')
    await expect(page.locator('body')).toContainText('Showing 2 work orders', { timeout: 1_000 })
  })

  // ── Part 3: optimistic status updates ──────────────────────────────────────

  test('optimistically updates only the saving row and persists on success', async ({ page }) => {
    const row = page.getByTestId('work-order-row').filter({ hasText: 'Replace valve' })
    const statusSelect = row.getByTestId('status-select')
    await statusSelect.selectOption('in_progress')
    await expect(row.getByTestId('save-spinner')).toBeVisible({ timeout: 1_000 })
    await expect(statusSelect).toBeDisabled({ timeout: 1_000 })
    await expect(row.getByTestId('status-label')).toHaveText('in_progress', { timeout: 1_000 })
    await expect(row.getByTestId('save-spinner')).toBeHidden({ timeout: 1_000 })
    await expect(statusSelect).toBeEnabled({ timeout: 1_000 })
    await expect(statusSelect).toHaveValue('in_progress', { timeout: 1_000 })
  })

  test('rejected blocked update rolls back and surfaces supervisor-review error', async ({ page }) => {
    const row = page.getByTestId('work-order-row').filter({ hasText: 'Replace valve' })
    await row.getByTestId('status-select').selectOption('blocked')
    await expect(row.getByTestId('save-spinner')).toBeVisible({ timeout: 1_000 })
    await expect(row.getByTestId('status-select')).toBeDisabled({ timeout: 1_000 })
    await expect(row.getByTestId('status-label')).toHaveText('blocked', { timeout: 1_000 })
    await expect(row.getByTestId('status-label')).toHaveText('open', { timeout: 1_000 })
    await expect(page.getByRole('alert')).toContainText('supervisor review', { timeout: 1_000 })
    await expect(row.getByTestId('status-select')).toHaveValue('open', { timeout: 1_000 })
    await expect(row.getByTestId('status-select')).toBeEnabled({ timeout: 1_000 })
    await expect(row.getByTestId('save-spinner')).toBeHidden({ timeout: 1_000 })
  })

  test('a successful update is removed from an active derived filter', async ({ page }) => {
    await page.getByTestId('filter-status').selectOption('open')
    const row = page.getByTestId('work-order-row').filter({ hasText: 'Replace valve' })
    await row.getByTestId('status-select').selectOption('in_progress')
    await expect(page.getByTestId('work-order-row')).toHaveCount(1, { timeout: 1_000 })
    await expect(page.locator('body')).toContainText('Showing 1 work orders', { timeout: 1_000 })
  })
})
