import { useMemo, useState } from 'react'
import AdminLayout from './adminLayout.jsx'
import { initialNotifications } from './adminData.jsx'

function Notifications({ setPath }) {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [filter, setFilter] = useState('All')
  const [selectedId, setSelectedId] = useState(null)
  const selected = notifications.find((item) => item.id === selectedId)
  const visible = useMemo(() => notifications.filter((item) => filter === 'All' || (filter === 'Unread' ? !item.read : item.read)), [notifications, filter])

  const open = (item) => {
    setSelectedId(item.id)
    setNotifications((current) => current.map((notice) => notice.id === item.id ? { ...notice, read: true } : notice))
  }

  const markAllRead = () => setNotifications((current) => current.map((item) => ({ ...item, read: true })))
  const goInventory = () => setPath('/admin/equipment')

  return (
    <AdminLayout setPath={setPath} active="notifications" title={selected ? selected.kind === 'warranty' ? 'Warranty Alert & Affected Assets' : 'Notification Details' : 'Notifications Center'}>
      {!selected ? (
        <>
          <div className="notification-toolbar">
            <div className="filter-pills">{['All', 'Unread', 'Read'].map((option) => <button key={option} className={filter === option ? 'active' : ''} onClick={() => setFilter(option)}>{option}{option === 'Unread' ? ` (${notifications.filter((item) => !item.read).length})` : ''}</button>)}</div>
            <button className="secondary-action" onClick={markAllRead}>✓ Mark All as Read</button>
          </div>
          {visible.some((item) => !item.read) && <div className="notification-group-label">Urgent Alerts</div>}
          <div className="notification-items">
            {visible.filter((item) => !item.read).map((item) => <NotificationItem key={item.id} item={item} onClick={() => open(item)} />)}
          </div>
          {visible.some((item) => item.read) && <div className="notification-group-label past-label">Past Notifications</div>}
          <div className="notification-items">
            {visible.filter((item) => item.read).map((item) => <NotificationItem key={item.id} item={item} onClick={() => open(item)} />)}
          </div>
          {!visible.length && <section className="admin-panel empty-state">No {filter.toLowerCase()} notifications.</section>}
        </>
      ) : selected.kind === 'warranty' ? (
        <div className="warranty-detail">
          <button className="detail-back" onClick={() => setSelectedId(null)}>←</button>
          <section className="admin-panel">
            <div className="detail-labels"><span>Historical snapshot</span><span className="status-badge user-active">Read</span></div>
            <h2>10x Dell OptiPlex Laptops warranties will expire in 14 days (November 15, 2026).</h2>
            <p className="form-note">Original alert wording retained. This page reflects an earlier, not current, date.</p>
            <div className="inventory-summary">
              <article><span>Affected quantity</span><strong>10 laptops</strong><small>Recorded Dell OptiPlex group</small></article>
              <article><span>Recorded warranty deadline</span><strong>Nov 15, 2026</strong><small>Historical deadline</small></article>
              <article><span>Lead time at alert</span><strong>14 days</strong><small>Source notification: 1 day ago</small></article>
            </div>
            <div className="form-section-title">Affected asset group</div>
            <div className="data-table"><table><thead><tr><th>RECORDED GROUP</th><th>QUANTITY</th><th>ASSET TAGS</th><th>SERIAL NUMBERS</th><th>DEADLINE</th></tr></thead><tbody><tr><td>Dell OptiPlex laptops</td><td>10</td><td>Not recorded</td><td>Not recorded</td><td>Sep 23, 2026</td></tr></tbody></table></div>
            <div className="alert-strip">Individual asset records unavailable. No individual tags or serial numbers are supplied for these 10 laptops.</div>
          </section>
          <div className="two-column-layout">
            <section className="admin-panel"><div className="form-section-title">Warranty review follow-up</div><p className="form-note">Verify the 10 laptop records against warranty documentation. Confirm serial numbers, coverage terms, and any renewal or extension. Record the verified warranty outcome in Asset Inventory.</p><button className="primary-action" onClick={goInventory}>View Asset Inventory</button></section>
            <section className="admin-panel"><div className="form-section-title">Source boundaries</div><p className="form-note">Current warranty / renewal status: Not recorded. This notification group references a historical expiration notice and does not establish a current warranty status.</p></section>
          </div>
        </div>
      ) : (
        <>
          <button className="detail-back" onClick={() => setSelectedId(null)}>← Back to Notifications</button>
          <section className="admin-panel"><div className="detail-banner"><div><span className="status-badge inspection">Critical</span> <span className="status-badge user-inactive">Unread at entry</span><h2>{selected.title}</h2><p>{selected.message} · Reported by {selected.reporter}</p></div><small>{selected.time}</small></div></section>
          <div className="two-column-layout">
            <section className="admin-panel"><div className="form-section-title">Reported issue</div><div className="detail-pairs"><div><span>Category</span><strong>{selected.category}</strong></div><div><span>Severity</span><strong>{selected.severity}</strong></div><div><span>Reported by</span><strong>{selected.reporter}</strong></div><div><span>Location</span><strong>Room 301</strong></div></div><div className="detail-description"><span>Reported description</span><p>{selected.message}</p><small>Issue narrative; no additional evidence is supplied.</small></div><button className="primary-action" onClick={() => setPath('/admin/maintenance')}>Assign Maintenance Staff</button></section>
            <section className="admin-panel"><div className="form-section-title">Notification metadata</div><div className="detail-pairs single"><div><span>Assignment</span><strong>Unassigned</strong></div><div><span>Asset tag</span><strong>Not recorded</strong></div><div><span>Ticket ID</span><strong>Not recorded</strong></div><div><span>Reported date / time</span><strong>Not recorded</strong></div></div></section>
          </div>
          <section className="admin-panel"><div className="form-section-title">Linked context - incoming AC Room 301 issue</div><p className="form-note">The linked context is the reported room, issue, and reporter above. No asset tag or ticket link is established. This notice is not automatically associated with any asset.</p></section>
        </>
      )}
    </AdminLayout>
  )
}

function NotificationItem({ item, onClick }) {
  const symbol = item.kind === 'maintenance' ? '⚒' : item.kind === 'warranty' ? '▤' : '▣'
  return (
    <button className={`notification-item ${item.read ? '' : 'unread'}`} onClick={onClick}>
      <span className="notification-symbol">{symbol}</span><span><strong>{item.title}</strong><span className="status-badge user-active">{item.read ? 'Read' : 'Unread'}</span><p>{item.message}{item.kind === 'maintenance' && <> Category: <b>{item.category}</b> | Severity: <b className="text-danger">{item.severity}</b> | Reported by: {item.reporter}</>}</p></span><small>{item.time}</small>
    </button>
  )
}

export default Notifications
