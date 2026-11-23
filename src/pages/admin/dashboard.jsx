import AdminLayout from './adminLayout.jsx'
import { initialEquipment, initialTickets, initialSchedules } from './adminData.jsx'

const monthlyCosts = [
  ['Jan', 28], ['Feb', 52], ['Mar', 34], ['Apr', 82], ['May', 65], ['Jun', 92],
]

function Dashboard({ setPath }) {
  const available = initialEquipment.filter((asset) => asset.status === 'Available').length
  const inRepair = initialEquipment.filter((asset) => asset.status === 'Under Maintenance').length
  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  return (
    <AdminLayout setPath={setPath} active="dashboard" title="Department Overview">
      <div className="dashboard-page">
      <div className="dashboard-context"><span>Real-time equipment status and lifecycle analytics</span><select defaultValue="2026" aria-label="Academic year"><option value="2026">1st Sem AY 2026-2027</option><option>1st Sem AY 2025-2026</option></select></div>
      <div className="stat-grid dashboard-kpis">
        <article><div><span>Total Assets</span><strong>1,240</strong><small className="trend-positive">↑ 12 this month</small></div></article>
        <article><div><span>Currently in Use</span><strong>184</strong><small>14.8% active</small></div></article>
        <article><div><span>Maintenance Flags</span><strong>12</strong><small className="trend-warning">3 needs review</small></div></article>
        <article><div><span>Portfolio Valuation</span><strong>₱4,850,000.00</strong><small>Depreciated value</small></div></article>
      </div>

      <div className="dashboard-columns">
        <div className="dashboard-primary-column">
          <section className="admin-panel chart-panel">
            <div className="panel-heading"><div><h2>Monthly Repair Expenses</h2><p>₱50k · reported expenses by month</p></div><button onClick={() => navigate('/admin/reports')}>View Reports</button></div>
            <div className="bar-chart">{monthlyCosts.map(([month, height]) => <div className="bar-column" key={month}><i style={{ height: `${height}%` }} /><span>{month}</span></div>)}</div>
          </section>
          <section className="admin-panel">
            <div className="panel-heading"><div><h2>Recent Activity Feed</h2><p>Latest changes and reports</p></div><button onClick={() => navigate('/admin/maintenance')}>View all</button></div>
            <div className="data-table"><table><thead><tr><th>TICKET ID</th><th>ASSET NAME</th><th>DESCRIPTION</th><th>STATUS</th><th>TIMESTAMP</th></tr></thead><tbody>{initialTickets.map((ticket) => <tr key={ticket.id}><td>{ticket.id}</td><td>{ticket.asset}</td><td>{ticket.issue}</td><td><span className={`status-badge ${ticket.status === 'Completed' ? 'available' : ticket.status === 'Assigned' ? 'maintenance' : 'inspection'}`}>{ticket.status}</span></td><td>{ticket.date}</td></tr>)}</tbody></table></div>
          </section>
        </div>
        <aside className="dashboard-side-column">
          <section className="admin-panel action-required">
            <div className="panel-heading"><div><h2>⚠ Action Required</h2></div></div>
            <button className="action-notice" onClick={() => navigate('/admin/maintenance')}><span>⚒</span><div><strong>New Report: AC in Room 301</strong><small>Air Conditioner Unit needs repair</small></div><b>›</b></button>
            <button className="action-notice" onClick={() => navigate('/admin/notifications')}><span>▤</span><div><strong>Warranty Expiring: 5 Laptops</strong><small>Laptops warranty expires in 14 days</small></div><b>›</b></button>
            <div className="alert-strip">⚠ 2 items exceed 50% purchase cost threshold</div>
          </section>
          <section className="admin-panel system-health-panel">
            <div className="panel-heading"><div><h2>System Health</h2></div></div>
            <div className="system-health-list">
              <div><span className="health-dot"></span><div><strong>Inventory records</strong><small>Last synced today</small></div></div>
              <div><span className="health-dot"></span><div><strong>{available} assets available</strong><small>{inRepair} currently in maintenance</small></div></div>
            </div>
          </section>
          <section className="admin-panel calendar-summary-panel">
            <div className="panel-heading"><div><h2>Upcoming Schedules</h2></div><button onClick={() => navigate('/admin/schedule')}>View Calendar</button></div>
            {initialSchedules.slice(0, 2).map((schedule) => (
              <button className="schedule-summary" key={schedule.id} onClick={() => navigate('/admin/schedule')}>
                <time>{schedule.date.slice(-2)}</time>
                <div><strong>{schedule.title}</strong><small>{schedule.start} - {schedule.end}</small></div>
              </button>
            ))}
          </section>
        </aside>
      </div>
      </div>
    </AdminLayout>
  )
}

export default Dashboard
