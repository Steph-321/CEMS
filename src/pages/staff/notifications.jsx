import StaffLayout, { StaffIcon } from './StaffLayout.jsx'
import StaffReportCard from './StaffReportCard.jsx'
import { initialTickets } from '../admin/adminData.jsx'

function Notifications({ setPath, reportId }) {
  const needsAction = initialTickets.filter((ticket) => ticket.status === 'Unassigned')
  const recentReports = [...initialTickets].sort((first, second) => new Date(second.date) - new Date(first.date))
  const selectedReport = initialTickets.find((ticket) => ticket.id === reportId)

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  const viewReport = (ticketId) => navigate(`/staff/notifications/${ticketId}`)

  if (reportId) {
    return (
      <StaffLayout setPath={setPath} activePath="notifications">
        <div className="staff-report-detail-enter">
          <div className="staff-report-detail-actions">
            <button className="staff-report-back" type="button" onClick={() => navigate('/staff/notifications')}>
              <span aria-hidden="true">←</span> All reports
            </button>
            <button className="staff-report-new-issue" type="button" onClick={() => navigate('/staff/scan')}>
              <StaffIcon name="scan" /> Report an issue
            </button>
          </div>
          {selectedReport ? (
            <div className="staff-view-heading staff-report-detail-heading">
              <div>
                <span className="staff-eyebrow">MAINTENANCE REPORT</span>
                <h1>Report details</h1>
                <p>{selectedReport.id} · Reported {selectedReport.date}</p>
              </div>
            </div>
          ) : (
            <div className="staff-report-not-found">
              <span className="staff-empty-icon"><StaffIcon name="bell" /></span>
              <h1>Report not found</h1>
              <p>This sample report may no longer be available.</p>
              <button type="button" onClick={() => navigate('/staff/notifications')}>Back to notifications</button>
            </div>
          )}
          {selectedReport && (
            <>
              <section className={`staff-report-detail-card staff-report-detail-status-${selectedReport.status.toLowerCase()}`}>
                <div className="staff-report-card-top">
                  <span className="staff-report-id">{selectedReport.id}</span>
                  <span className={`staff-report-status-badge ${selectedReport.status.toLowerCase()}`}>
                    {selectedReport.status === 'Unassigned' ? 'Needs assignment' : selectedReport.status}
                  </span>
                </div>
                <h2>{selectedReport.asset}</h2>
                <p>{selectedReport.issue} · {selectedReport.assetId}</p>
                <div className="staff-report-detail-description">
                  <span>Reported details</span>
                  <p>{selectedReport.description || 'No description supplied.'}</p>
                </div>
              </section>

              <section className="staff-report-detail-card staff-report-status-card">
                <span className="staff-eyebrow">CURRENT STATUS</span>
                <h2>{selectedReport.status === 'Unassigned' ? 'Needs assignment' : selectedReport.status}</h2>
                <div className="staff-report-detail-fields">
                  <div><span>Severity</span><strong>{selectedReport.severity}</strong></div>
                  <div><span>Reported by</span><strong>{selectedReport.reporter}</strong></div>
                  <div><span>Assigned technician</span><strong>{selectedReport.technician}</strong></div>
                  <div><span>Report date</span><strong>{selectedReport.date}</strong></div>
                </div>
              </section>
            </>
          )}
        </div>
      </StaffLayout>
    )
  }

  return (
    <StaffLayout setPath={setPath} activePath="notifications">
      <div className="staff-view-heading">
        <div>
          <span className="staff-eyebrow">UPDATES</span>
          <h1>Notifications</h1>
          <p>Sample maintenance reports and items that need attention.</p>
        </div>
      </div>

      <section className="staff-notice-section">
        <div className="staff-notice-heading">
          <div><span className="staff-eyebrow">FOLLOW-UP</span><h2>Needs action</h2></div>
          <span className="staff-notice-count">{needsAction.length}</span>
        </div>
        {needsAction.length ? (
          <div className="staff-report-list">
            {needsAction.map((ticket) => (
              <StaffReportCard key={ticket.id} ticket={ticket} needsAction onView={viewReport} />
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
            <StaffReportCard key={ticket.id} ticket={ticket} onView={viewReport} />
          ))}
        </div>
      </section>

      <button className="staff-notice-cta" type="button" onClick={() => navigate('/staff/scan')}>
        <StaffIcon name="scan" />
        Report an equipment issue
      </button>
    </StaffLayout>
  )
}

export default Notifications
