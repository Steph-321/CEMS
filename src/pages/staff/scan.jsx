import { useState } from 'react'
import StaffLayout, { StaffIcon } from './StaffLayout.jsx'
import { initialEquipment } from '../admin/adminData.jsx'
import { createStaffTicket } from './staffMaintenance.js'

const severityOptions = ['Low', 'Medium', 'High', 'Critical']

function Scan({ setPath }) {
  const [assetTag, setAssetTag] = useState('')
  const [asset, setAsset] = useState(null)
  const [lookupMessage, setLookupMessage] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [assetName, setAssetName] = useState('')
  const [issue, setIssue] = useState('Hardware Failure')
  const [severity, setSeverity] = useState('Medium')
  const [description, setDescription] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [additionalOpen, setAdditionalOpen] = useState(false)
  const [attachmentName, setAttachmentName] = useState('')
  const [reportError, setReportError] = useState('')

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  const lookupAsset = (event) => {
    event.preventDefault()
    const query = assetTag.trim().toLowerCase()
    const match = initialEquipment.find((item) => (
      item.id.toLowerCase() === query || item.serial.toLowerCase() === query
    ))

    setAsset(match || null)
    setLookupMessage(match
      ? `${match.name} found in ${match.location}.`
      : query ? `No equipment found for “${assetTag.trim()}”. You can still enter its details below.` : 'Enter an asset ID or serial number to search.')
    if (match) {
      setAssetName(match.name)
      setAssetTag(match.id)
      setReportOpen(true)
    }
  }

  const saveReport = (event) => {
    event.preventDefault()
    setReportError('')
    try {
      const ticket = createStaffTicket({
        asset: assetName,
        assetId: assetTag,
        issue,
        severity,
        description: [description.trim(), additionalDetails.trim()].filter(Boolean).join('\n\n'),
        attachmentName,
      })
      navigate(`/staff/notifications/${ticket.id}`)
    } catch (error) {
      setReportError(error instanceof Error ? error.message : 'The maintenance request could not be saved.')
    }
  }

  return (
    <StaffLayout setPath={setPath} activePath="scan">
      <div className="staff-view-heading">
        <div><span className="staff-eyebrow">EQUIPMENT SUPPORT</span><h1>Report an issue</h1><p>Look up equipment and submit a maintenance request.</p></div>
      </div>
      <section className="staff-scan-preview">
        <span className="staff-scan-frame"><StaffIcon name="scan" /></span>
        <strong>Scan equipment QR code</strong>
        <p>Camera scanning is not connected yet. Enter an asset ID or serial number below.</p>
      </section>
      <form className="staff-report-form staff-scan-form" onSubmit={lookupAsset}>
        <label>Asset ID or serial number
          <div className="staff-scan-lookup">
            <input value={assetTag} onChange={(event) => { setAssetTag(event.target.value); setLookupMessage(''); setAsset(null) }} placeholder="e.g. AST-001" />
            <button type="submit">Look up</button>
          </div>
        </label>
      </form>
      {lookupMessage && <p className="staff-scan-message" role="status">{lookupMessage}</p>}

      {asset && (
        <section className="staff-scan-asset-card" aria-label="Equipment found">
          <span className="staff-scan-asset-icon"><StaffIcon name="computer" /></span>
          <div><strong>{asset.name}</strong><small>{asset.id} · {asset.location}</small></div>
          <span className={`staff-inventory-status status-${asset.status.toLowerCase().replaceAll(' ', '-')}`}>{asset.status}</span>
        </section>
      )}

      <button
        type="button"
        className="staff-scan-report-trigger"
        onClick={() => { setReportOpen((open) => !open); setReportError('') }}
      >
        {reportOpen ? 'Close issue report' : 'Report an issue'}
      </button>
      {reportOpen && (
        <section className="staff-scan-report">
          <form className="staff-report-form" onSubmit={saveReport}>
            <div className="staff-scan-form-heading"><strong>Report details</strong><small>Required fields are marked with *</small></div>
            <label>Equipment name *
              <input value={assetName} onChange={(event) => setAssetName(event.target.value)} placeholder="Enter equipment name" required />
            </label>
            <label>Asset tag
              <input value={assetTag} onChange={(event) => setAssetTag(event.target.value)} placeholder="e.g. AST-001" />
            </label>
            <label>Issue category *
              <select value={issue} onChange={(event) => setIssue(event.target.value)}>
                <option>Hardware Failure</option><option>Damage</option><option>Software Issue</option><option>Preventive Maintenance</option><option>Other</option>
              </select>
            </label>
            <fieldset className="staff-scan-severity">
              <legend>Severity level *</legend>
              <div role="radiogroup" aria-label="Severity level">
                {severityOptions.map((option) => (
                  <button
                    type="button"
                    key={option}
                    role="radio"
                    aria-checked={severity === option}
                    className={`severity-${option.toLowerCase()} ${severity === option ? 'selected' : ''}`}
                    onClick={() => setSeverity(option)}
                  >{option}</button>
                ))}
              </div>
            </fieldset>
            <label>Describe the issue *
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe what happened and any visible damage" required />
            </label>
            {additionalOpen && (
              <label>Additional details
                <textarea value={additionalDetails} onChange={(event) => setAdditionalDetails(event.target.value)} placeholder="Add any other useful information" />
              </label>
            )}
            <label className="staff-scan-attachment">Photo capture / attachment
              <input type="file" accept="image/*" capture="environment" onChange={(event) => setAttachmentName(event.target.files?.[0]?.name || '')} />
              <small>{attachmentName ? `Selected: ${attachmentName} (file upload is not connected)` : 'Choose or capture an image; uploads require a connected service.'}</small>
            </label>
            {reportError && <p className="staff-scan-error" role="alert">{reportError}</p>}
            <button type="submit">Log Maintenance Request</button>
            <button type="button" className="staff-scan-more-details" onClick={() => setAdditionalOpen((open) => !open)}>
              {additionalOpen ? 'Hide additional details' : 'Provide further details'}
            </button>
          </form>
        </section>
      )}
    </StaffLayout>
  )
}

export default Scan
