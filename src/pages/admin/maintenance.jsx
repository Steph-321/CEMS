import { useMemo, useState } from 'react'
import AdminLayout from './adminLayout.jsx'
import { getStaffTickets, saveStaffTickets } from '../staff/staffMaintenance.js'

function Maintenance({ setPath }) {
  const [tickets, setTickets] = useState(getStaffTickets)
  const [tab, setTab] = useState('Incoming')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [mode, setMode] = useState('queue')
  const [saved, setSaved] = useState(false)
  const [draft, setDraft] = useState({ asset: '', issue: 'Hardware Failure', severity: 'Medium', description: '' })
  const [technician, setTechnician] = useState('Sear Cleve Dalubatan')
  const selected = tickets.find((ticket) => ticket.id === selectedId)
  const visible = useMemo(() => tickets.filter((ticket) => {
    const matchesTab = tab === 'Incoming' ? ticket.status === 'Unassigned' : tab === 'Assigned' ? ticket.status === 'Assigned' : ticket.status === 'Completed' || ticket.status === 'Unserviceable'
    return matchesTab && `${ticket.id} ${ticket.asset} ${ticket.assetId} ${ticket.issue}`.toLowerCase().includes(search.toLowerCase())
  }), [tickets, tab, search])

  const updateAnyTicket = (ticketId, updates) => {
    const savedUpdates = {
      ...updates,
      updatedAt: new Date().toISOString(),
      ...(['Completed', 'Unserviceable'].includes(updates.status) ? { repairDate: new Date().toLocaleDateString() } : {}),
    }
    const updated = tickets.map((ticket) => ticket.id === ticketId ? { ...ticket, ...savedUpdates } : ticket)
    saveStaffTickets(updated)
    setTickets(updated)
  }

  const updateTicket = (updates) => updateAnyTicket(selectedId, updates)

  const submitIssue = (event) => {
    event.preventDefault()
    const ticket = { id: `TASK-${String(tickets.length + 1).padStart(3, '0')}`, assetId: draft.asset.split(' - ')[0], asset: draft.asset.split(' - ')[1] || draft.asset, issue: draft.issue, severity: draft.severity, status: 'Unassigned', reporter: 'Administrator', technician: 'Unassigned', description: draft.description, date: new Date().toLocaleDateString() }
    const updated = [ticket, ...tickets]
    saveStaffTickets(updated)
    setTickets(updated)
    setDraft({ asset: '', issue: 'Hardware Failure', severity: 'Medium', description: '' })
    setSaved(true)
    setTab('Incoming')
  }

  const goBack = () => {
    setMode('queue')
    setSelectedId(null)
    setSaved(false)
  }

  return (
    <AdminLayout setPath={setPath} active="maintenance" title={mode === 'queue' ? 'Maintenance' : mode === 'workshop' ? 'Maintenance Workshop Log' : mode === 'issue' ? 'Log Maintenance Issue' : mode === 'assign' ? 'Assign Maintenance Staff' : mode === 'review' ? 'Repair Review' : mode === 'outcome' ? 'Repair Outcome' : 'Ticket Details'}>
      {mode === 'queue' && (
        <>
          <div className="inventory-summary">
            <article><span>Total Cost (in ₱)</span><strong>₱1,815.00</strong><small>Recorded workshop costs</small></article>
            <article><span>Currently Under Repair</span><strong>{tickets.filter((item) => item.status === 'Assigned').length} Assets</strong><small>Assigned for repair</small></article>
            <article><span>Avg. Turnaround Duration</span><strong>Not recorded</strong><small>No completion dates supplied</small></article>
            <article><span>SLA Met</span><strong>Not recorded</strong><small>Target not specified</small></article>
          </div>
          <section className="admin-panel">
            <div className="page-toolbar"><div><h2>Issue Reports</h2><p>Maintenance / Incoming staff reports and assignment register</p></div><div className="action-row"><button className="secondary-action" onClick={() => setMode('workshop')}>View Workshop Log</button><button className="primary-action" onClick={() => setMode('issue')}>Log Maintenance Issue</button></div></div>
            <div className="maintenance-toolbar"><div className="status-tabs">{['Incoming', 'Assigned', 'Completed'].map((name) => <button key={name} className={tab === name ? 'active' : ''} onClick={() => { setTab(name); setSelectedId(null) }}>{name} ({tickets.filter((ticket) => name === 'Incoming' ? ticket.status === 'Unassigned' : name === 'Assigned' ? ticket.status === 'Assigned' : ['Completed', 'Unserviceable'].includes(ticket.status)).length})</button>)}</div><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search reports" /><select><option>Severity: All</option><option>Critical</option><option>High</option><option>Medium</option><option>Low</option></select></div>
            {saved && <p className="save-message">Maintenance issue was added to Incoming reports.</p>}
            <div className="ticket-list">{visible.map((ticket) => <article className="ticket-card" key={ticket.id}><div className="ticket-heading"><div><strong>{ticket.id} · {ticket.asset}</strong><small>{ticket.assetId} · {ticket.issue} · {ticket.severity}</small></div><span className={`status-badge ${ticket.status === 'Completed' ? 'available' : ticket.status === 'Unassigned' ? 'inspection' : 'maintenance'}`}>{ticket.status}</span></div><div className="ticket-meta"><span>Report date<br /><b>{ticket.date}</b></span><span>Reporter<br /><b>{ticket.reporter}</b></span><span>Assigned technician<br /><b>{ticket.technician}</b></span></div><div className="ticket-source-note">Source completeness: {ticket.description} No additional evidence supplied.</div><div className="action-row"><button className="primary-action" onClick={() => { setSelectedId(ticket.id); setMode('detail') }}>View {tab === 'Completed' ? 'Item Report' : 'Ticket'}</button>{ticket.status === 'Unassigned' && <button className="secondary-action" onClick={() => { setSelectedId(ticket.id); setMode('assign') }}>Assign staff</button>}</div></article>)}</div>
            {!visible.length && <div className="empty-state">No {tab.toLowerCase()} maintenance reports found.</div>}
          </section>
        </>
      )}

      {mode === 'issue' && (
        <section className="admin-panel">
          <div className="page-toolbar"><div><h2>Log Maintenance Issue</h2><p>Maintenance / Issue Reports / Intake</p></div><button className="secondary-action" onClick={goBack}>← Back</button></div>
          <form className="admin-form" onSubmit={submitIssue}><div className="admin-form-grid">
            <label>Selected asset<input list="cems-assets" value={draft.asset} onChange={(event) => setDraft({ ...draft, asset: event.target.value })} placeholder="Select asset (asset ID - name)" required /><datalist id="cems-assets"><option value="AST-001 - Dell Latitude" /><option value="AC-301 - Air Conditioner Unit (Room 301)" /><option value="AST-009 - Keyboard and Mouse" /></datalist></label>
            <label>Issue category<select value={draft.issue} onChange={(event) => setDraft({ ...draft, issue: event.target.value })}><option>Hardware Failure</option><option>Software Issue</option><option>Preventive Maintenance</option><option>Other</option></select></label>
            <label>Severity<select value={draft.severity} onChange={(event) => setDraft({ ...draft, severity: event.target.value })}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label>
            <label className="form-span-2">Describe issue<textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} placeholder="Describe the reported issue..." required /></label>
            <div className="alert-strip form-span-2">Staff report source fields are not supplied here. No attachment, ticket, or asset association will be inferred unless entered.</div>
          </div><div className="form-actions"><button type="button" className="secondary-action" onClick={goBack}>Cancel</button><button className="primary-action">Log Maintenance Issue</button></div></form>
        </section>
      )}

      {mode === 'detail' && selected && (
        <>
          <button className="detail-back" onClick={goBack}>← Back to Issue Reports</button>
          <div className="two-column-layout">
            <section className="admin-panel"><div className="page-toolbar"><div><h2>Ticket Details</h2><p>Maintenance / {selected.id} / {selected.assetId}</p></div><span className="status-badge maintenance">{selected.status}</span></div><div className="detail-pairs"><div><span>Asset tag</span><strong>{selected.assetId}</strong></div><div><span>Category / severity</span><strong>{selected.issue} · {selected.severity}</strong></div><div><span>Report date</span><strong>{selected.date}</strong></div><div><span>Assigned technician</span><strong>{selected.technician}</strong></div></div><div className="detail-description"><span>Reported description - read-only</span><p>{selected.description || 'Not supplied in staff report.'}</p><small>No new issue narrative was supplied in the source ticket.</small></div><div className="action-row">{selected.status === 'Unassigned' && <button className="primary-action" onClick={() => setMode('assign')}>Assign Maintenance Staff</button>}<button className="secondary-action" onClick={() => setMode('review')}>Review Repair Details</button></div></section>
            <section className="admin-panel"><div className="form-section-title">Related report · separate asset</div><span className="status-badge inspection">Critical</span><p className="form-note">Incoming AC Room 301 report</p><div className="detail-pairs single"><div><span>Asset</span><strong>Air Conditioner Unit (Room 301)</strong></div><div><span>Reported by</span><strong>Engr. Santos</strong></div><div><span>Issue / severity</span><strong>Hardware Failure · Critical</strong></div></div><div className="info-callout">Related issue only. This report is not linked to {selected.assetId}.</div><button className="secondary-action" onClick={() => { const related = tickets.find((ticket) => ticket.assetId === 'AC-301'); if (related) { setSelectedId(related.id); setMode('detail') } }}>View Related Report</button></section>
          </div>
        </>
      )}

      {mode === 'assign' && selected && (
        <div className="two-column-layout">
          <section className="admin-panel"><div className="page-toolbar"><div><h2>Assign Maintenance Staff</h2><p>Maintenance / {selected.id} / {selected.asset}</p></div><button className="secondary-action" onClick={() => setMode('detail')}>← Back</button></div><div className="detail-pairs"><div><span>Task summary</span><strong>{selected.id} · {selected.issue} · {selected.severity} · {selected.assetId}</strong></div><div><span>Staff choices</span><strong>Workshop technicians</strong></div></div><form className="admin-form" onSubmit={(event) => { event.preventDefault(); updateTicket({ technician, status: 'Assigned' }); setMode('detail') }}><label>Maintenance staff<select value={technician} onChange={(event) => setTechnician(event.target.value)}><option>Sear Cleve Dalubatan</option><option>Daniel Dino Marzon</option><option>Joana Arranguez</option></select></label><label>Assigned date<input type="date" /></label><div className="form-actions"><button type="button" className="secondary-action" onClick={() => setMode('detail')}>Cancel</button><button className="primary-action">Save Assignment</button></div></form></section>
          <section className="admin-panel"><div className="form-section-title">Assignment result preview</div><div className="info-callout"><strong>Assigned · {selected.id}</strong> The task will be assigned to {technician} for {selected.asset}.</div><p className="form-note">This only changes the selected ticket assignment. Room-based report details remain separate.</p></section>
        </div>
      )}

      {mode === 'review' && selected && (
        <div className="two-column-layout">
          <section className="admin-panel"><div className="page-toolbar"><div><h2>Repair Review</h2><p>Maintenance / {selected.id} / Technician repair submission</p></div><button className="secondary-action" onClick={() => setMode('detail')}>← Back</button></div><div className="form-section-title">Submission details - read-only</div><div className="detail-pairs"><div><span>Technician / equipment</span><strong>{selected.technician} · {selected.assetId}</strong></div><div><span>Steps taken to resolve issue</span><strong>Not supplied — staff repair form shows guidance only.</strong></div></div><label className="admin-form">Parts replaced<textarea placeholder="Not supplied in the staff repair submission." /></label><label className="admin-form">Repair cost (₱)<input type="number" min="0" placeholder="Not supplied" /></label><div className="info-callout">Verify technician submission. Confirm actual steps, parts, and cost before recording an outcome.</div></section>
          <section className="admin-panel"><div className="form-section-title">Record repair outcome</div><div className="info-callout">Review is limited to the information supplied. No unsupported cost or repair details will be added.</div><button className="primary-action full-action" onClick={() => setMode('outcome')}>Record Outcome</button><p className="form-note">Outcome choices must be verified before an asset status is changed.</p></section>
        </div>
      )}

      {mode === 'outcome' && selected && (
        <section className="admin-panel"><div className="page-toolbar"><div><h2>Repair Outcome</h2><p>Maintenance / {selected.id} / Verified destinations</p></div><button className="secondary-action" onClick={() => setMode('review')}>← Back</button></div><p className="form-note">{selected.id} · {selected.asset}. Select the verified result; do not infer missing parts, cost, or repair details.</p><div className="report-cards"><article className="outcome-card"><h3>Completed repair — outcome preview</h3><div className="info-callout success-callout">Repaired · Completed<br />After marking as repaired, the repair record becomes read-only.</div><p className="form-note">Equipment availability may return to Available after verification.</p><button className="primary-action" onClick={() => { updateTicket({ status: 'Completed' }); setMode('queue'); setTab('Completed'); setSelectedId(null) }}>Mark as Repaired</button></article><article className="outcome-card"><h3>Alternate outcome — unserviceable</h3><div className="info-callout danger-callout">Unserviceable · Out of service<br />Alternative destination after marking as unserviceable.</div><p className="form-note">Keep maintenance history and mark the asset out of service.</p><button className="secondary-action" onClick={() => { updateTicket({ status: 'Unserviceable' }); setMode('queue'); setTab('Completed'); setSelectedId(null) }}>Mark as Unserviceable</button></article></div></section>
      )}

      {mode === 'workshop' && (
        <>
          <button className="detail-back" onClick={goBack}>← Back to Maintenance</button>
          <section className="admin-panel"><div className="page-toolbar"><div><h2>Maintenance Workshop Log</h2><p>Track equipment and cost history.</p></div><button className="primary-action">＋ Log Maintenance</button></div><div className="inventory-summary"><article><span>Total Cost (in ₱)</span><strong>₱1,815.00</strong></article><article><span>Currently Under Repair</span><strong>{tickets.filter((ticket) => ticket.status === 'Assigned').length} Assets</strong></article><article><span>Avg. Turnaround Duration</span><strong>Not recorded</strong></article><article><span>SLA Met</span><strong>Not recorded</strong></article></div><div className="table-toolbar"><select><option>Technician: All</option><option>Sear Cleve Dalubatan</option></select><select><option>Status: All</option><option>Assigned</option><option>Completed</option></select><input placeholder="Search" /></div><div className="data-table"><table><thead><tr><th>LOG ID</th><th>ASSET ID</th><th>ASSET NAME</th><th>ACTION PERFORMED</th><th>TECHNICIAN</th><th>COST</th><th>STATUS</th></tr></thead><tbody>{tickets.map((ticket, index) => <tr key={ticket.id}><td>MNT-{208 - index}</td><td>{ticket.assetId}</td><td>{ticket.asset}</td><td>{ticket.issue}</td><td>{ticket.technician}</td><td>{index === 0 ? '₱1,815.00' : 'Not supplied'}</td><td><span className="status-badge maintenance">{ticket.status}</span></td></tr>)}</tbody></table></div></section>
        </>
      )}
    </AdminLayout>
  )
}

export default Maintenance
