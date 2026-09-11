/**
 * =============================================================================
 * INTERVIEW PROBLEM 09: Role-Scoped Work-Order Queue
 * Difficulty: Senior Software Engineer | Estimated time: 45 minutes
 * =============================================================================
 *
 * Build a work-order queue for a multi-tenant workflow product.
 *
 * PART 1 - Visibility
 * Render only work orders belonging to CURRENT_CONTEXT. Every row must include
 * the title, customer, priority, and current status. Use
 * data-testid="work-order-row" on each visible row.
 *
 * PART 2 - Search and filtering
 * Add a text search by title or customer and a status select with All, open,
 * in_progress, and blocked. Show "Showing N work orders".
 *
 * PART 3 - Optimistic status updates
 * Add a status select to every row. Changing it should optimistically update
 * the row, show data-testid="save-spinner" while updateWorkOrderStatus is in
 * flight, disable the control during the request, and roll back with an error
 * message if the request fails. Invalidate or reconcile derived views after a
 * successful update.
 *
 * In a real application, CURRENT_CONTEXT would come from authenticated
 * identity and updateWorkOrderStatus would be an API mutation.
 */

export const CURRENT_CONTEXT = { tenantId: 'org-a', role: 'dispatcher' }

export const SEED_WORK_ORDERS = [
  { id: 'wo-1', tenantId: 'org-a', title: 'Replace valve', customer: 'Northside Supply', priority: 'high', status: 'open' },
  { id: 'wo-2', tenantId: 'org-a', title: 'Confirm delivery', customer: 'Main Street Plumbing', priority: 'medium', status: 'in_progress' },
  { id: 'wo-3', tenantId: 'org-a', title: 'Inspect site', customer: 'Harbor Mechanical', priority: 'low', status: 'blocked' },
  { id: 'wo-4', tenantId: 'org-b', title: 'Prepare invoice', customer: 'West End HVAC', priority: 'high', status: 'open' },
]

export function updateWorkOrderStatus(workOrderId, status) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ workOrderId, status }), 300)
  })
}

export default function App() {
  throw new Error('Not implemented - replace this with your solution.')
}