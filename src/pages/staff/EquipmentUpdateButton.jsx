import { useState } from 'react'
import { createPortal } from 'react-dom'
import { updateStaffEquipment } from './staffMaintenance.js'

function EquipmentUpdateButton({ asset, className, label = 'Update', onUpdated, relatedTasks, onOpenRepair }) {
  const [isOpen, setIsOpen] = useState(false)
  const [status, setStatus] = useState(asset.status)
  const [condition, setCondition] = useState(asset.condition || '')
  const [error, setError] = useState('')

  const openEditor = () => {
    setStatus(asset.status)
    setCondition(asset.condition || '')
    setError('')
    setIsOpen(true)
  }

  const saveUpdate = (event) => {
    event.preventDefault()
    setError('')
    try {
      updateStaffEquipment(asset.id, { status, condition })
      setIsOpen(false)
      onUpdated?.()
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Equipment could not be updated.')
    }
  }

  return (
    <>
      <button type="button" className={className} onClick={openEditor}>
        {label}
      </button>
      {isOpen && createPortal(
        <div className="staff-inventory-update-scrim" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsOpen(false) }}>
          <form className="staff-inventory-update-modal" role="dialog" aria-modal="true" aria-labelledby={`equipment-update-${asset.id}`} onSubmit={saveUpdate}>
            <button type="button" className="staff-repair-modal-close" aria-label="Close update form" onClick={() => setIsOpen(false)}>×</button>
            <span className="staff-eyebrow">INVENTORY UPDATE</span>
            <h2 id={`equipment-update-${asset.id}`}>{asset.name}</h2>
            <p>{asset.id} · {asset.location}</p>
            <label>Availability status
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option>Available</option><option>Under Maintenance</option><option>Out of Service</option>
              </select>
            </label>
            <label>Condition
              <select value={condition} onChange={(event) => setCondition(event.target.value)} required>
                {[...new Set([asset.condition, 'Good / Working', 'Fair', 'Needs Repair', 'Unserviceable'].filter(Boolean))].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            {relatedTasks && (
              <section className="staff-inventory-update-repairs" aria-label="Staff repair details">
                <div className="staff-inventory-update-repairs-heading">
                  <span className="staff-eyebrow">STAFF REPAIR DETAILS</span>
                  <small>{relatedTasks.length} linked {relatedTasks.length === 1 ? 'task' : 'tasks'}</small>
                </div>
                {relatedTasks.length ? relatedTasks.map((task) => {
                  const isUnassigned = task.status === 'Unassigned'
                  const isFinal = ['Completed', 'Unserviceable'].includes(task.status)
                  return (
                    <article className="staff-inventory-update-repair" key={task.id}>
                      <div className="staff-inventory-update-repair-heading">
                        <strong>{task.id} · {task.issue}</strong>
                        <span>{task.status}</span>
                      </div>
                      <p>{task.description || 'No description supplied.'}</p>
                      {isFinal && (
                        <div className="staff-inventory-update-repair-summary">
                          {task.repairSteps && <span>Steps: {task.repairSteps}</span>}
                          {task.partsReplaced && <span>Parts: {task.partsReplaced}</span>}
                          {task.repairCost && <span>Cost: ₱{task.repairCost}</span>}
                          {task.unserviceableReason && <span>Assessment: {task.unserviceableReason}</span>}
                        </div>
                      )}
                      <button
                        type="button"
                        className="staff-inventory-update-repair-link"
                        disabled={isUnassigned}
                        title={isUnassigned ? 'Assign this task before entering repair details.' : undefined}
                        onClick={() => {
                          setIsOpen(false)
                          onOpenRepair?.(task.id)
                        }}
                      >
                        {isUnassigned ? 'Repair not assigned' : isFinal ? 'View repair details' : 'Staff Repair Details'}
                        {!isUnassigned && <span aria-hidden="true">→</span>}
                      </button>
                    </article>
                  )
                }) : (
                  <p className="staff-inventory-update-repairs-empty">No maintenance tasks are linked to this asset.</p>
                )}
              </section>
            )}
            {error && <p className="staff-scan-error" role="alert">{error}</p>}
            <button type="submit" className="staff-repair-primary">Save updates</button>
            <button type="button" className="staff-repair-secondary" onClick={() => setIsOpen(false)}>Cancel</button>
          </form>
        </div>,
        document.body
      )}
    </>
  )
}

export default EquipmentUpdateButton
