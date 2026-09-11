/**
 * =============================================================================
 * INTERVIEW PROBLEM 09: Role-Scoped Work-Order Queue
 * Difficulty: Senior Software Engineer | Estimated time: 45 min
 * =============================================================================
 *
 * CONTEXT
 * -------
 * Build a work-order queue for a multi-tenant workflow product. Dispatchers
 * coordinate work, technicians update assigned orders, and managers monitor
 * the full tenant queue.
 *
 * =============================================================================
 * PART 1 — Role-scoped visibility
 * =============================================================================
 *
 * Render work orders from SEED_WORK_ORDERS for the active viewing role. Add a
 * <select data-testid="role-select"> that defaults to CURRENT_CONTEXT.role and
 * lets a reviewer simulate the authenticated identity. In a real application,
 * this identity would come from the auth provider; this select exists only to
 * make the role rules exercisable.
 *
 * Visibility rules:
 *   • Dispatchers and managers see every order in their own tenant.
 *   • Technicians see only orders in their tenant whose assignedRole is
 *     "technician".
 *   • Orders from other tenants are never visible to anyone.
 *
 * Each row must show the title, customer, priority, and current status. Use
 * PRIORITY_COLORS and STATUS_COLORS as available styling helpers.
 *
 * =============================================================================
 * PART 2 — Search and status filtering
 * =============================================================================
 *
 * Add a title/customer search box with placeholder="Search work orders" and a
 * status filter. The status filter options have values "all", "open",
 * "in_progress", and "blocked", with visible labels All, Open, In progress,
 * and Blocked. Combine the active role, search, and status filters, preferably
 * with useMemo. The summary must read exactly "Showing N work orders".
 *
 * =============================================================================
 * PART 3 — Optimistic status updates
 * =============================================================================
 *
 * Add a status select to every visible row. Changing it must immediately update
 * that row in local state, call updateWorkOrderStatus, and disable only that
 * row's select while the mutation is in flight. Render a spinner only inside
 * the saving row. On failure, roll the status back and show the error in an
 * element with role="alert". Successful changes must remain reflected in any
 * derived filtered view.
 * Changing the active role does not cancel in-flight mutations and does not reset
 * the search or status filters. A mutation updates the canonical work-order state
 * even if its row is no longer visible; a hidden row shows no spinner. If the row
 * becomes visible again, it reflects the settled result.
 *
 * TEST CONTRACT
 * -------------
 * Playwright uses seed-data text and visible labels first, then the following
 * structural selectors where necessary:
 *   • data-testid="role-select"       — identity/role switcher
 *   • data-testid="filter-status"     — status filter select
 *   • data-testid="work-order-row"    — each visible row
 *   • data-testid="status-label"      — current status string exactly:
 *                                         open, in_progress, or blocked
 *   • data-testid="status-select"     — per-row status control
 *   • data-testid="save-spinner"      — inside a row only while it saves
 *   • role="alert"                    — failed mutation error
 *
 * =============================================================================
 */

// =============================================================================
// PROVIDED — DO NOT MODIFY
// =============================================================================

export const CURRENT_CONTEXT = { tenantId: 'org-a', role: 'dispatcher' }

export const ROLES = ['dispatcher', 'technician', 'manager']

export const SEED_WORK_ORDERS = [
  { id: 'wo-1', tenantId: 'org-a', assignedRole: 'dispatcher', title: 'Replace valve', customer: 'Northside Supply', priority: 'high', status: 'open' },
  { id: 'wo-2', tenantId: 'org-a', assignedRole: 'technician', title: 'Confirm delivery', customer: 'Main Street Plumbing', priority: 'medium', status: 'in_progress' },
  { id: 'wo-3', tenantId: 'org-a', assignedRole: 'technician', title: 'Inspect site', customer: 'Harbor Mechanical', priority: 'low', status: 'blocked' },
  { id: 'wo-4', tenantId: 'org-b', assignedRole: 'manager', title: 'Prepare invoice', customer: 'West End HVAC', priority: 'high', status: 'open' },
  { id: 'wo-5', tenantId: 'org-a', assignedRole: 'technician', title: 'Service valve manifold', customer: 'Harbor Mechanical', priority: 'medium', status: 'open' },
]

export const PRIORITY_COLORS = { high: '#ef4444', medium: '#f59e0b', low: '#94a3b8' }
export const STATUS_COLORS = { open: '#3b82f6', in_progress: '#8b5cf6', blocked: '#ef4444' }

/**
 * Simulates a PATCH /work-orders/:id API call.
 * Resolves after ~300 ms for "open" and "in_progress". Deterministically
 * rejects "blocked" with "Blocked work orders require supervisor review." so
 * rollback is reliably testable rather than dependent on random failure.
 *
 * @param {string} workOrderId
 * @param {string} status
 * @returns {Promise<{ workOrderId: string, status: string }>}
 */
export function updateWorkOrderStatus(workOrderId, status) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (status === 'blocked') {
        reject(new Error('Blocked work orders require supervisor review.'))
        return
      }
      resolve({ workOrderId, status })
    }, 300)
  })
}

// =============================================================================
// YOUR WORK STARTS HERE
// =============================================================================

// -----------------------------------------------------------------------------
// Suggested sub-components (optional — structure however you like)
// -----------------------------------------------------------------------------

// function WorkOrderRow({ workOrder, onStatusChange, saving }) { ... }
// function QueueToolbar({ role, search, status, onChange }) { ... }

export default function App() {
  throw new Error('Not implemented — replace this with your solution.')
}
