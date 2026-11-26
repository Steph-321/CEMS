import { useState } from 'react'
import StaffLayout, { StaffIcon } from './StaffLayout.jsx'

function Scan({ setPath }) {
  const [assetTag, setAssetTag] = useState('')
  const [message, setMessage] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [reportSaved, setReportSaved] = useState(false)

  const lookupAsset = (event) => {
    event.preventDefault()
    setMessage(assetTag.trim() ? `No equipment found for “${assetTag.trim()}”.` : 'Enter an equipment tag to search.')
  }

  const saveReport = (event) => {
    event.preventDefault()
    setReportSaved(true)
  }

  return (
    <StaffLayout setPath={setPath} activePath="scan">
      <div className="staff-view-heading"><h1>Scan</h1><span>Equipment tag</span></div>
      <section className="staff-scan-preview">
        <span className="staff-scan-frame"><StaffIcon name="scan" /></span>
        <strong>Scan equipment QR code</strong>
        <p>Camera scanning will be available when scanning is connected.</p>
      </section>
      <form className="staff-report-form staff-scan-form" onSubmit={lookupAsset}>
        <label>Or enter an asset tag
          <input value={assetTag} onChange={(event) => { setAssetTag(event.target.value); setMessage('') }} placeholder="e.g. CEMS-001" />
        </label>
        <button type="submit">Look up equipment</button>
      </form>
      {message && <p className="staff-scan-message" role="status">{message}</p>}
      <button type="button" className="staff-scan-report-trigger" onClick={() => { setReportOpen((open) => !open); setReportSaved(false) }}>
        {reportOpen ? 'Cancel issue report' : 'Report an issue'}
      </button>
      {reportOpen && (
        <section className="staff-scan-report">
          {reportSaved ? (
            <div className="staff-report-success" role="status">
              <strong>Report ready</strong>
              <p>This report will be submitted when a database is connected.</p>
            </div>
          ) : (
            <form className="staff-report-form" onSubmit={saveReport}>
              <label>Equipment name<input name="equipment" defaultValue={assetTag} placeholder="Enter equipment name" required /></label>
              <label>Issue type<select name="issue"><option>Hardware failure</option><option>Missing equipment</option><option>Other</option></select></label>
              <label>Details<textarea name="details" placeholder="Describe the issue" required /></label>
              <button type="submit">Save report</button>
            </form>
          )}
        </section>
      )}
    </StaffLayout>
  )
}

export default Scan
