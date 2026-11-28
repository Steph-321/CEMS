import { useState } from 'react'
import StaffLayout, { StaffIcon } from './StaffLayout.jsx'
import EquipmentUpdateButton from './EquipmentUpdateButton.jsx'
import { getStaffEquipment, getStaffTickets, updateStaffTicket } from './staffMaintenance.js'

function StaffRepair({ setPath, ticketId, showResult = false }) {
  const task = getStaffTickets().find((ticket) => ticket.id === ticketId)
  const [equipmentList, setEquipmentList] = useState(getStaffEquipment)
  const equipment = equipmentList.find((asset) => asset.id === task?.assetId)
  const [steps, setSteps] = useState(task?.repairSteps || '')
  const [cost, setCost] = useState(task?.repairCost || '')
  const [parts, setParts] = useState(task?.partsReplaced || '')
  const [reason, setReason] = useState(task?.unserviceableReason || '')
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  const saveOutcome = (status) => {
    setError('')
    try {
      updateStaffTicket(ticketId, {
        status,
        repairSteps: steps.trim(),
        repairCost: cost.trim(),
        partsReplaced: parts.trim(),
        unserviceableReason: reason.trim(),
        repairDate: new Date().toLocaleDateString(),
      })
      setConfirmation('')
      navigate(`/staff/repair/${ticketId}/result`)
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Repair details could not be saved.')
    }
  }

  const viewAsset = () => {
    if (equipment) {
      navigate(`/staff/inventory/${task.assetId}`)
    } else {
      navigate('/staff/inventory')
    }
  }

  if (!task) {
    return (
      <StaffLayout setPath={setPath} activePath="notifications">
        <section className="staff-repair-not-found">
          <h1>Task not found</h1>
          <p>This maintenance task is not available.</p>
          <button type="button" onClick={() => navigate('/staff/notifications')}>Back to tasks</button>
        </section>
      </StaffLayout>
    )
  }

  if (showResult && !['Completed', 'Unserviceable'].includes(task.status)) {
    return (
      <StaffLayout setPath={setPath} activePath="notifications">
        <section className="staff-repair-not-found">
          <h1>No repair outcome yet</h1>
          <p>Save a verified repair outcome before viewing the result.</p>
          <button type="button" onClick={() => navigate(`/staff/repair/${task.id}`)}>Enter repair details</button>
        </section>
      </StaffLayout>
    )
  }

  if (showResult || ['Completed', 'Unserviceable'].includes(task.status)) {
    const unserviceable = task.status === 'Unserviceable'
    return (
      <StaffLayout setPath={setPath} activePath="notifications">
        <div className="staff-repair-page">
          <button type="button" className="staff-report-back staff-repair-back" onClick={() => navigate(`/staff/notifications/${task.id}`)}>
            <span aria-hidden="true">←</span> Task details
          </button>
          <section className={`staff-repair-result ${unserviceable ? 'unserviceable' : 'completed'}`}>
            <span className="staff-repair-result-icon">{unserviceable ? '!' : '✓'}</span>
            <span className="staff-eyebrow">{unserviceable ? 'OUT OF SERVICE' : 'POST-MAINTENANCE'}</span>
            <h1>{unserviceable ? 'Asset marked unserviceable' : 'Repair documented'}</h1>
            <p>{task.asset} · {task.assetId}</p>
            <span className={`staff-report-status-badge ${unserviceable ? 'unserviceable' : 'completed'}`}>
              {unserviceable ? 'Unserviceable' : 'Repaired · Completed'}
            </span>
          </section>

          <section className="staff-repair-result-card">
            <h2>{unserviceable ? 'Assessment details' : 'Repair details'}</h2>
            {unserviceable && <div><span>Reason</span><strong>{task.unserviceableReason || 'No reason recorded.'}</strong></div>}
            {!unserviceable && <div><span>Steps taken</span><strong>{task.repairSteps || 'Not recorded.'}</strong></div>}
            {!unserviceable && <div><span>Parts replaced</span><strong>{task.partsReplaced || 'None recorded.'}</strong></div>}
            <div><span>Repair cost</span><strong>{task.repairCost ? `₱${task.repairCost}` : 'Not recorded'}</strong></div>
            <div><span>Assigned technician</span><strong>{task.technician}</strong></div>
            <div><span>Recorded date</span><strong>{task.repairDate || task.updatedAt || task.date}</strong></div>
            {equipment && <div><span>Asset availability</span><strong>{equipment.status}</strong></div>}
          </section>
          {equipment && (
            <EquipmentUpdateButton
              asset={equipment}
              className="staff-repair-update-button"
              label="Update asset"
              onUpdated={() => setEquipmentList(getStaffEquipment())}
            />
          )}

          <p className="staff-repair-readonly-note">
            This record is read-only. Any further work should be recorded as a new maintenance task.
          </p>
          <div className="staff-repair-result-actions">
            <button type="button" className="staff-repair-primary" onClick={viewAsset}>View asset</button>
            <button type="button" className="staff-repair-secondary" onClick={() => navigate('/staff/notifications')}>Back to tasks</button>
          </div>
        </div>
      </StaffLayout>
    )
  }

  if (task.status !== 'Assigned') {
    return (
      <StaffLayout setPath={setPath} activePath="notifications">
        <section className="staff-repair-not-found">
          <h1>Repair not assigned</h1>
          <p>This task must be assigned to a technician before repair details can be submitted.</p>
          <button type="button" onClick={() => navigate(`/staff/notifications/${task.id}`)}>Back to task</button>
        </section>
      </StaffLayout>
    )
  }

  return (
    <StaffLayout setPath={setPath} activePath="notifications">
      <div className="staff-repair-page">
        <button type="button" className="staff-report-back staff-repair-back" onClick={() => navigate(`/staff/notifications/${task.id}`)}>
          <span aria-hidden="true">←</span> Task issue details
        </button>
        <div className="staff-view-heading staff-repair-heading">
          <div><span className="staff-eyebrow">TASK ISSUE / REPAIR</span><h1>Repair details</h1><p>{task.id} · Assigned to {task.technician}</p></div>
        </div>

        <section className="staff-repair-overview">
          <div className="staff-repair-section-heading"><span>Task & issue overview</span><span className="staff-report-status-badge assigned">Assigned</span></div>
          <div className="staff-repair-overview-grid">
            <div><span>Task ID</span><strong>{task.id}</strong></div>
            <div><span>Asset tag</span><strong>{task.assetId}</strong></div>
            <div><span>Equipment</span><strong>{task.asset}</strong></div>
            <div><span>Issue / severity</span><strong>{task.issue} · {task.severity}</strong></div>
            <div><span>Assigned technician</span><strong>{task.technician}</strong></div>
            <div><span>Reported date</span><strong>{task.date}</strong></div>
            {equipment && <div><span>Asset availability</span><strong>{equipment.status}</strong></div>}
          </div>
          {equipment && (
            <EquipmentUpdateButton
              asset={equipment}
              className="staff-repair-update-button"
              label="Update asset"
              onUpdated={() => setEquipmentList(getStaffEquipment())}
            />
          )}
          {error && <p className="staff-scan-error" role="alert">{error}</p>}
          <div className="staff-repair-reported-issue"><span>Reported issue</span><p>{task.description || 'No description supplied.'}</p></div>
        </section>

        <form className="staff-repair-form" onSubmit={(event) => { event.preventDefault(); setConfirmation('Completed') }}>
          <label>Steps taken to resolve issue *
            <textarea value={steps} onChange={(event) => setSteps(event.target.value)} placeholder="Describe the repair work performed" required />
          </label>
          <label>Repair cost (₱)
            <input type="number" min="0" step="0.01" value={cost} onChange={(event) => setCost(event.target.value)} placeholder="Enter amount or leave blank" />
          </label>
          <label>Parts replaced
            <textarea value={parts} onChange={(event) => setParts(event.target.value)} placeholder="List replaced parts, or leave blank if none" />
          </label>
          {error && <p className="staff-scan-error" role="alert">{error}</p>}
          <button type="submit" className="staff-repair-primary" disabled={!steps.trim()}>
            <StaffIcon name="inventory" /> Mark as Repaired
          </button>
          <button type="button" className="staff-repair-secondary" onClick={() => { setConfirmation('Unserviceable'); setError('') }}>
            Mark as Unserviceable
          </button>
        </form>

        {confirmation && (
          <div className="staff-repair-modal-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmation('') }}>
            <section className="staff-repair-modal" role="dialog" aria-modal="true" aria-labelledby="staff-repair-confirm-title">
              <button type="button" className="staff-repair-modal-close" aria-label="Close confirmation" onClick={() => setConfirmation('')}>×</button>
              <span className={`staff-repair-modal-icon ${confirmation === 'Unserviceable' ? 'warning' : ''}`}>{confirmation === 'Unserviceable' ? '!' : '✓'}</span>
              <h2 id="staff-repair-confirm-title">{confirmation === 'Unserviceable' ? 'Mark as Unserviceable?' : 'Mark as Repaired?'}</h2>
              <p>{task.id} · {task.asset} · {task.assetId}</p>
              {confirmation === 'Completed' ? (
                <div className="staff-repair-confirm-summary">
                  <div><span>Steps taken</span><strong>{steps}</strong></div>
                  <div><span>Repair cost</span><strong>{cost ? `₱${cost}` : 'Not recorded'}</strong></div>
                  <div><span>Parts replaced</span><strong>{parts || 'None recorded'}</strong></div>
                  <small>Confirm only after verifying the repair and details above.</small>
                </div>
              ) : (
                <label className="staff-repair-reason">Assessment reason *
                  <textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Explain why this asset cannot be repaired" required />
                  <small>The asset will be marked out of service. The assessment becomes read-only after confirmation.</small>
                </label>
              )}
              {error && <p className="staff-scan-error" role="alert">{error}</p>}
              <button
                type="button"
                className="staff-repair-primary"
                disabled={confirmation === 'Unserviceable' ? !reason.trim() : !steps.trim()}
                onClick={() => saveOutcome(confirmation)}
              >
                {confirmation === 'Unserviceable' ? 'Yes, Mark Unserviceable' : 'Confirm Repair'}
              </button>
              <button type="button" className="staff-repair-secondary" onClick={() => setConfirmation('')}>Keep editing</button>
            </section>
          </div>
        )}
      </div>
    </StaffLayout>
  )
}

export default StaffRepair
