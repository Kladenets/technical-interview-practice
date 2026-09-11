import { useMemo, useState } from 'react'

const CONTEXT = { tenantId: 'org-a', role: 'dispatcher' }
const INITIAL_ORDERS = [
  { id: 'wo-1', tenantId: 'org-a', title: 'Replace valve', customer: 'Northside Supply', priority: 'high', status: 'open' },
  { id: 'wo-2', tenantId: 'org-a', title: 'Confirm delivery', customer: 'Main Street Plumbing', priority: 'medium', status: 'in_progress' },
  { id: 'wo-3', tenantId: 'org-a', title: 'Inspect site', customer: 'Harbor Mechanical', priority: 'low', status: 'blocked' },
  { id: 'wo-4', tenantId: 'org-b', title: 'Prepare invoice', customer: 'West End HVAC', priority: 'high', status: 'open' },
]

function updateWorkOrderStatus(workOrderId, status) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ workOrderId, status }), 300)
  })
}

export default function App() {
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [savingId, setSavingId] = useState(null)
  const [error, setError] = useState('')

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase()
    return orders.filter((order) => {
      if (order.tenantId !== CONTEXT.tenantId) return false
      if (statusFilter !== 'all' && order.status !== statusFilter) return false
      if (query && !`${order.title} ${order.customer}`.toLowerCase().includes(query)) return false
      return true
    })
  }, [orders, search, statusFilter])

  async function changeStatus(orderId, nextStatus) {
    const previous = orders.find((order) => order.id === orderId)?.status
    if (!previous || previous === nextStatus) return
    setError('')
    setSavingId(orderId)
    setOrders((current) => current.map((order) => (
      order.id === orderId ? { ...order, status: nextStatus } : order
    )))
    try {
      await updateWorkOrderStatus(orderId, nextStatus)
    } catch (requestError) {
      setOrders((current) => current.map((order) => (
        order.id === orderId ? { ...order, status: previous } : order
      )))
      setError(requestError.message)
    } finally {
      setSavingId(null)
    }
  }

  return (
    <main>
      <h1>Work orders</h1>
      <label>
        Search
        <input
          data-testid="search-input"
          placeholder="Search work orders"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>
      <label>
        Status
        <select data-testid="filter-status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="blocked">Blocked</option>
        </select>
      </label>
      <p>Showing {visibleOrders.length} work orders</p>
      {error && <p role="alert">{error}</p>}
      <section>
        {visibleOrders.map((order) => (
          <article data-testid="work-order-row" key={order.id}>
            <h2>{order.title}</h2>
            <p>{order.customer}</p>
            <p>Priority: {order.priority}</p>
            <span data-testid="status-label">{order.status}</span>
            <select
              data-testid="status-select"
              value={order.status}
              disabled={savingId === order.id}
              onChange={(event) => changeStatus(order.id, event.target.value)}
            >
              <option value="open">Open</option>
              <option value="in_progress">In progress</option>
              <option value="blocked">Blocked</option>
            </select>
            {savingId === order.id && <span data-testid="save-spinner">Saving...</span>}
          </article>
        ))}
      </section>
    </main>
  )
}