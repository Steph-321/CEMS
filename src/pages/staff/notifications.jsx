import { useState } from 'react'
import { createPortal } from 'react-dom'
import StaffLayout, { StaffIcon } from './StaffLayout.jsx'
import StaffReportCard from './StaffReportCard.jsx'
import EquipmentUpdateButton from './EquipmentUpdateButton.jsx'
import { getStaffEquipment, getStaffTickets } from './staffMaintenance.js'

function Notifications({ setPath, reportId }) {
  const tickets = getStaffTickets()
  const [equipmentList, setEquipmentList] = useState(getStaffEquipment)
  const needsAction = tickets.filter((ticket) => ticket.status === 'Unassigned')
  const recentReports = [...tickets].sort((first, second) => new Date(second.date) - new Date(first.date))
  const selectedReport = tickets.find((ticket) => ticket.id === reportId)
  const selectedEquipment = selectedReport && equipmentList.find((asset) => asset.id === selectedReport.assetId)

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  const viewReport = (ticketId) => navigate(`/staff/notifications/${ticketId}`)
  const openRepairDetails = (ticketId) => navigate(`/staff/repair/${ticketId}`)

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
              <StaffReportCard
                key={ticket.id}
                ticket={ticket}
                needsAction
                onView={viewReport}
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

      <button className="staff-notice-cta" type="button" onClick={() => navigate('/staff/scan')}>
        <StaffIcon name="scan" />
        Report an equipment issue
      </button>
      {reportId && createPortal(
        <div className="staff-report-view-modal-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) navigate('/staff/notifications') }}>
          <section className="staff-report-view-modal" role="dialog" aria-modal="true" aria-labelledby="staff-report-view-modal-title">
            <button type="button" className="staff-repair-modal-close" aria-label="Close report details" onClick={() => navigate('/staff/notifications')}>×</button>
            {selectedReport ? (
              <>
                <span className="staff-eyebrow">MAINTENANCE REPORT</span>
                <h2 id="staff-report-view-modal-title">Report details</h2>
                <p className="staff-report-view-modal-reference">{selectedReport.id} · Reported {selectedReport.date}</p>

                <section className={`staff-report-detail-card staff-report-detail-status-${selectedReport.status.toLowerCase()}`}>
                  <div className="staff-report-card-top">
                    <span className="staff-report-id">{selectedReport.id}</span>
                    <span className={`staff-report-status-badge ${selectedReport.status.toLowerCase()}`}>
                      {selectedReport.status === 'Unassigned' ? 'Needs assignment' : selectedReport.status}
                    </span>
                  </div>
                  <h3>{selectedReport.asset}</h3>
                  <p>{selectedReport.issue} · {selectedReport.assetId}</p>
                  <div className="staff-report-detail-description">
                    <span>Reported details</span>
                    <p>{selectedReport.description || 'No description supplied.'}</p>
                  </div>
                </section>

                <section className="staff-report-detail-card staff-report-status-card">
                  <span className="staff-eyebrow">CURRENT STATUS</span>
                  <h3>{selectedReport.status === 'Unassigned' ? 'Needs assignment' : selectedReport.status}</h3>
                  <div className="staff-report-detail-fields">
                    <div><span>Severity</span><strong>{selectedReport.severity}</strong></div>
                    <div><span>Reported by</span><strong>{selectedReport.reporter}</strong></div>
                    <div><span>Assigned technician</span><strong>{selectedReport.technician}</strong></div>
                    <div><span>Report date</span><strong>{selectedReport.date}</strong></div>
                    {selectedEquipment && <div><span>Asset availability</span><strong>{selectedEquipment.status}</strong></div>}
                  </div>
                </section>

                <div className="staff-report-view-modal-actions">
                  {selectedEquipment ? (
                    <EquipmentUpdateButton
                      asset={selectedEquipment}
                      className="staff-task-update-button"
                      label="Update asset"
                      onUpdated={() => setEquipmentList(getStaffEquipment())}
                      relatedTasks={tickets.filter((ticket) => ticket.assetId === selectedReport.assetId)}
                      onOpenRepair={openRepairDetails}
                    />
                  ) : (
                    <button type="button" className="staff-task-update-button" disabled title="This task's asset is not registered in Inventory.">
                      Update asset
                    </button>
                  )}
                  <button
                    type="button"
                    className="staff-repair-details-button"
                    disabled={selectedReport.status === 'Unassigned'}
                    title={selectedReport.status === 'Unassigned' ? 'Assign this task before entering repair details.' : undefined}
                    onClick={() => openRepairDetails(selectedReport.id)}
                  >
                    {selectedReport.status === 'Unassigned'
                      ? 'Repair not assigned'
                      : ['Completed', 'Unserviceable'].includes(selectedReport.status) ? 'View repair details' : 'Staff Repair Details'}
                    {selectedReport.status !== 'Unassigned' && <span aria-hidden="true">→</span>}
                  </button>
                </div>
              </>
            ) : (
              <div className="staff-report-not-found">
                <span className="staff-empty-icon"><StaffIcon name="bell" /></span>
                <h2 id="staff-report-view-modal-title">Report not found</h2>
                <p>This maintenance report may no longer be available.</p>
              </div>
            )}
          </section>
        </div>,
        document.body
      )}
    </StaffLayout>
  )
}

export default Notifications
