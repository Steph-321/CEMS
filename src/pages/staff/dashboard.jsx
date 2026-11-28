import StaffLayout, { StaffIcon } from './StaffLayout.jsx'
import StaffReportCard from './StaffReportCard.jsx'
import { getStaffTickets } from './staffMaintenance.js'
import { getCurrentUser } from '../auth/localAuth.js'

function Dashboard({ setPath }) {
  const tickets = getStaffTickets()
  const firstName = getCurrentUser()?.name?.trim().split(/\s+/)[0]
  const today = new Date()
  const todayLabel = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(today)
  const todayDateTime = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const needsAction = tickets.filter((ticket) => ticket.status === 'Unassigned')
  const recentReports = [...tickets].sort((first, second) => new Date(second.date) - new Date(first.date))

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  const viewReport = (ticketId) => navigate(`/staff/notifications/${ticketId}`)

  return (
    <StaffLayout setPath={setPath} activePath="dashboard">
      <section className="staff-welcome-card">
        <span className="staff-eyebrow">YOUR STAFF WORKSPACE</span>
        <h1>Good day{firstName ? `, ${firstName}` : ''}</h1>
        <p>Keep track of campus equipment and stay up to date.</p>
        <div className="staff-welcome-today">
          <span className="staff-welcome-date-icon"><StaffIcon name="calendar" /></span>
          <span><small>TODAY</small><time dateTime={todayDateTime}>{todayLabel}</time></span>
        </div>
        <span className="staff-welcome-orb" aria-hidden="true" />
      </section>

      <section className="staff-report-metrics" aria-label="Report overview">
        <article className="staff-report-metric">
          <span className="staff-report-metric-icon"><StaffIcon name="inventory" /></span>
          <span><small>Sample reports</small><strong>{recentReports.length}</strong></span>
          <span className="staff-report-metric-accent" aria-hidden="true">↗</span>
        </article>
        <article className="staff-report-metric attention">
          <span className="staff-report-metric-icon"><StaffIcon name="bell" /></span>
          <span><small>Needs follow-up</small><strong>{needsAction.length}</strong></span>
          <span className="staff-report-metric-accent" aria-hidden="true">!</span>
        </article>
      </section>

      <section className="staff-notice-section">
        <div className="staff-notice-heading">
          <div><span className="staff-eyebrow">FOLLOW-UP</span><h2>Needs action</h2></div>
          <span className="staff-notice-count">{needsAction.length}</span>
        </div>
        {needsAction.length ? (
          <div className="staff-report-list">
            {needsAction.map((ticket) => (
              <StaffReportCard
                key={ticket.id}
                ticket={ticket}
                onView={viewReport}
                needsAction
              />
            ))}
          </div>
        ) : (
          <div className="staff-notice-empty">
            <span className="staff-empty-icon"><StaffIcon name="bell" /></span>
            <strong>No reports need action</strong>
            <p>Items requiring follow-up will appear here.</p>
          </div>
        )}
      </section>

      <section className="staff-notice-section staff-recent-section">
        <div className="staff-notice-heading">
          <div><span className="staff-eyebrow">SAMPLE MAINTENANCE</span><h2>Recent reports</h2></div>
          <span className="staff-notice-total">{recentReports.length} reports</span>
        </div>
        <div className="staff-report-list">
          {recentReports.map((ticket) => (
            <StaffReportCard
              key={ticket.id}
              ticket={ticket}
              onView={viewReport}
            />
          ))}
        </div>
      </section>
    </StaffLayout>
  )
}

export default Dashboard
