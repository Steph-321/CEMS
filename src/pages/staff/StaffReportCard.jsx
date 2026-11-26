import { StaffIcon } from './StaffLayout.jsx'

function StaffReportCard({ ticket, onView, needsAction = false }) {
  const statusLabel = ticket.status === 'Unassigned' ? 'Needs assignment' : ticket.status
  const iconState = needsAction ? 'attention' : ticket.status.toLowerCase()
  const cardStateClass = needsAction
    ? 'staff-report-card-attention'
    : `staff-report-card-status-${ticket.status.toLowerCase()}`

  return (
    <article className={`staff-report-card ${cardStateClass}`}>
      <div className="staff-report-card-top">
        <span className="staff-report-ident">
          <span className={`staff-report-type-icon ${iconState}`}><StaffIcon name={needsAction ? 'bell' : 'inventory'} /></span>
          <span className="staff-report-id">{ticket.id}</span>
        </span>
        {needsAction ? (
          <span className="staff-report-severity">{ticket.severity} priority</span>
        ) : (
          <span className={`staff-report-status-badge ${ticket.status.toLowerCase()}`}>{ticket.status}</span>
        )}
      </div>
      <h3>{ticket.asset}</h3>
      <p>{ticket.issue} · {ticket.assetId}</p>
      <div className="staff-report-card-bottom">
        {needsAction ? (
          <span className="staff-report-status"><span />{statusLabel}</span>
        ) : (
          <span>{ticket.severity} priority</span>
        )}
        <small>{ticket.date}</small>
      </div>
      <button className="staff-report-view" type="button" onClick={() => onView(ticket.id)} aria-label={`View report ${ticket.id}`}>
        View report <span aria-hidden="true">→</span>
      </button>
    </article>
  )
}

export default StaffReportCard
