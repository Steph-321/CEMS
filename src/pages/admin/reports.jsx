import { useMemo, useState } from 'react'
import AdminLayout from './adminLayout.jsx'
import { initialEquipment, initialTickets } from './adminData.jsx'

const reportKinds = [
  ['inventory', 'Inventory & Condition Report', 'Asset inventory overview, availability summary and recorded asset detail'],
  ['maintenance', 'Maintenance Performance Report', 'Repair activity, workshop cost and reported completion'],
  ['financial', 'Financial & Retirement Analysis', 'Purchase cost, repair cost and retirement assessment'],
  ['depreciation', 'Depreciation Schedule', 'Category-level carrying value and available depreciation inputs'],
]

function Reports({ setPath }) {
  const [mode, setMode] = useState('home')
  const [report, setReport] = useState('inventory')
  const [period, setPeriod] = useState('FY 2026')
  const [category, setCategory] = useState('All recorded categories')
  const totalCost = initialEquipment.reduce((sum, item) => sum + Number(item.cost || 0), 0)
  const shown = useMemo(() => initialEquipment.filter((item) => category === 'All recorded categories' || item.category === category), [category])
  const selected = reportKinds.find(([id]) => id === report)

  const openReport = (id) => {
    setReport(id)
    setMode('detail')
  }

  return (
    <AdminLayout setPath={setPath} active="reports" title={mode === 'home' ? 'Reports & Analytics' : mode === 'export' ? 'Export PDF' : selected?.[1] || 'Report'}>
      {mode === 'home' && (
        <>
          <div className="page-toolbar"><div><h2>Financial &amp; Retirement Analysis</h2><p>Reports &amp; Analytics / Financial &amp; Retirement</p></div><button className="primary-action" onClick={() => setMode('export')}>Export PDF</button></div>
          <section className="admin-panel">
            <div className="report-filter"><label>REPORTING PERIOD<select value={period} onChange={(event) => setPeriod(event.target.value)}><option>FY 2026</option><option>FY 2025</option><option>Academic Year 2026</option></select></label><label>DECISION FILTER<select><option>All assets</option><option>Above 50% repair threshold</option></select></label><span className="form-note">Reporting period: {period} · Source: available asset register</span></div>
            <div className="report-summary"><article><span>Total Purchase Cost</span><strong>₱{totalCost.toLocaleString()}</strong><small>Recorded asset purchase amounts</small></article><article><span>Cumulative Repair Cost</span><strong>₱52,500</strong><small>Repair amount; source incomplete</small></article><article><span>Weighted Repair Ratio</span><strong>54.12%</strong><small>Subject to review</small></article><article><span>Recommended for Retirement</span><strong>2 assets</strong><small>Assessment recommended</small></article></div>
            <section className="admin-panel nested-panel"><div className="panel-heading"><div><h2>Asset-level financial decisions</h2><p>Repair ratio and recommendation are not a completed disposal or replacement approval.</p></div></div><div className="data-table"><table><thead><tr><th>ASSET / ASSET ID</th><th>PURCHASE</th><th>CUM. REPAIRS</th><th>RATIO</th><th>RECOMMENDATION</th></tr></thead><tbody><tr><td>CTU-001-014 · Dell OptiPlex PC #14</td><td>₱45,000</td><td>₱24,500</td><td>54.44%</td><td><span className="status-badge inspection">Flag for Review</span></td></tr><tr><td>CTU-001-008 · Carrier AC Unit 301</td><td>₱52,000</td><td>₱28,000</td><td>53.85%</td><td><span className="status-badge inspection">Flag for Review</span></td></tr></tbody></table></div></section>
          </section>
          <div className="report-cards">{reportKinds.map(([id, title, description]) => <button className="report-card-link" key={id} onClick={() => openReport(id)}><strong>{title}</strong><span>{description}</span><b>View Report →</b></button>)}</div>
        </>
      )}

      {mode === 'detail' && report === 'inventory' && (
        <section className="admin-panel">
          <div className="page-toolbar"><div><h2>Inventory &amp; Condition Report</h2><p>Asset Inventory / {shown.length} records · Availability summary and recorded asset detail</p></div><div className="action-row"><button className="secondary-action" onClick={() => setMode('home')}>Back to Reports</button><button className="primary-action" onClick={() => setMode('export')}>Export PDF</button></div></div>
          <div className="report-filter"><label>SOURCE SCOPE<select><option>Asset Inventory / {shown.length} records</option></select></label><label>PERIOD<select><option>Source snapshot - date not recorded</option></select></label><label>CATEGORY<select value={category} onChange={(event) => setCategory(event.target.value)}><option>All recorded categories</option>{[...new Set(initialEquipment.map((item) => item.category))].map((item) => <option key={item}>{item}</option>)}</select></label><label>STATUS<select><option>All statuses</option></select></label></div>
          <div className="report-summary"><article><span>Assets in this view</span><strong>{shown.length}</strong><small>Count of inventory records</small></article><article><span>Available</span><strong>{shown.filter((item) => item.status === 'Available').length}</strong><small>Source summary: ready for use</small></article><article><span>Under maintenance</span><strong>{shown.filter((item) => item.status === 'Under Maintenance').length}</strong><small>Source summary: servicing</small></article><article><span>Out of service</span><strong>{shown.filter((item) => item.status === 'Out of Service').length}</strong><small>None recorded</small></article></div>
          <section className="admin-panel nested-panel"><div className="panel-heading"><div><h2>Asset register</h2><p>{shown.length} records shown · asset-level values available for this report</p></div></div><div className="data-table"><table><thead><tr><th>ASSET ID</th><th>ASSET NAME</th><th>CATEGORY</th><th>ADDED ASSET DATE</th><th>STATUS</th><th>WARRANTY EXPIRY</th></tr></thead><tbody>{shown.map((asset) => <tr key={asset.id}><td>{asset.id}</td><td>{asset.name}</td><td>{asset.category}</td><td>{asset.date}</td><td><span className={`status-badge ${asset.status === 'Available' ? 'available' : 'maintenance'}`}>{asset.status}</span></td><td>{asset.warrantyExpiry || 'Not recorded'}</td></tr>)}</tbody></table></div></section>
          <p className="form-note">Data completeness: location records exist for {initialEquipment.length} items. Warranty availability does not establish a current warranty status.</p>
        </section>
      )}

      {mode === 'detail' && report === 'maintenance' && (
        <section className="admin-panel">
          <div className="page-toolbar"><div><h2>Maintenance Performance Report</h2><p>Maintenance / Workshop log / Performance summary</p></div><div className="action-row"><button className="secondary-action" onClick={() => setMode('home')}>Back to Reports</button><button className="primary-action" onClick={() => setMode('export')}>Export PDF</button></div></div>
          <div className="report-summary"><article><span>Work orders</span><strong>{initialTickets.length}</strong></article><article><span>Completed</span><strong>{initialTickets.filter((item) => item.status === 'Completed').length}</strong></article><article><span>Under repair</span><strong>{initialTickets.filter((item) => item.status === 'Assigned').length}</strong></article><article><span>Recorded cost</span><strong>₱1,815</strong></article></div>
          <div className="info-callout">Completion dates and technician costs were not provided for all work orders. Turnaround and SLA metrics cannot be inferred.</div>
          <div className="data-table"><table><thead><tr><th>WORK ORDER</th><th>ASSET</th><th>ISSUE</th><th>TECHNICIAN</th><th>COST</th><th>STATUS</th></tr></thead><tbody>{initialTickets.map((ticket) => <tr key={ticket.id}><td>{ticket.id}</td><td>{ticket.asset}</td><td>{ticket.issue}</td><td>{ticket.technician}</td><td>Not recorded</td><td>{ticket.status}</td></tr>)}</tbody></table></div>
        </section>
      )}

      {mode === 'detail' && report === 'financial' && (
        <section className="admin-panel"><div className="page-toolbar"><div><h2>Financial &amp; Retirement Analysis</h2><p>{period} · Financial review of registered assets</p></div><button className="primary-action" onClick={() => setMode('export')}>Export PDF</button></div><div className="report-summary"><article><span>Total Purchase Cost</span><strong>₱{totalCost.toLocaleString()}</strong></article><article><span>Cumulative Repair Cost</span><strong>₱52,500</strong></article><article><span>Weighted Repair Ratio</span><strong>54.12%</strong></article><article><span>Retirement Recommendations</span><strong>2</strong></article></div><div className="info-callout">Recommendation is not a completed disposal or replacement approval. Final decisions require an authorized review.</div><div className="data-table"><table><thead><tr><th>ASSET / ASSET ID</th><th>PURCHASE COST</th><th>CUM. REPAIRS</th><th>RATIO</th><th>RECOMMENDATION</th></tr></thead><tbody><tr><td>CTU-001-014 · Dell OptiPlex PC #14</td><td>₱45,000</td><td>₱24,500</td><td>54.44%</td><td>Assessment recommended</td></tr><tr><td>CTU-001-008 · Carrier AC Unit 301</td><td>₱52,000</td><td>₱28,000</td><td>53.85%</td><td>Assessment recommended</td></tr></tbody></table></div><button className="secondary-action" onClick={() => setMode('home')}>Back to Reports</button></section>
      )}

      {mode === 'detail' && report === 'depreciation' && (
        <section className="admin-panel"><div className="page-toolbar"><div><h2>Depreciation Schedule</h2><p>Category-level carrying values · source inputs are incomplete</p></div><button className="primary-action" onClick={() => setMode('export')}>Export PDF</button></div><div className="report-filter"><label>REPORT CONTEXT<select><option>FY 2026 · source not supplied</option></select></label><label>CATEGORY SCOPE<select><option>All recorded categories</option></select></label><span className="form-note">Valuation date: Not recorded. This report cannot calculate depreciation without original cost and service date inputs.</span></div><div className="report-summary"><article><span>Original Cost</span><strong>₱4,250,000</strong></article><article><span>Current Carrying Value</span><strong>₱2,305,000</strong></article><article><span>Accumulated Depreciation</span><strong>₱1,945,000</strong></article></div><div className="data-table"><table><thead><tr><th>ASSET CATEGORY</th><th>ORIGINAL COST</th><th>CURRENT VALUE</th><th>ACCUM. DEPRECIATION</th><th>USEFUL LIFE</th></tr></thead><tbody><tr><td>IT Equipment</td><td>₱3,600,000</td><td>₱1,960,000</td><td>₱1,640,000</td><td>5 years</td></tr><tr><td>Laboratory Hardware</td><td>₱400,000</td><td>₱220,000</td><td>₱180,000</td><td>5 years</td></tr><tr><td>Presentation Equipment</td><td>₱250,000</td><td>₱125,000</td><td>₱125,000</td><td>5 years</td></tr></tbody></table></div><div className="info-callout">Annual charge and projection unavailable: recorded purchase date, useful life and residual value are not supplied for these source totals.</div><button className="secondary-action" onClick={() => setMode('home')}>Back to Reports</button></section>
      )}

      {mode === 'export' && (
        <section className="admin-panel">
          <div className="page-toolbar"><div><h2>Export PDF</h2><p>Reports &amp; Analytics / Read-only financial and completed audit reports</p></div><button className="secondary-action" onClick={() => setMode(report === 'inventory' ? 'home' : 'detail')}>← Back</button></div>
          <div className="report-filter"><label>REPORT TYPE<select value={report} onChange={(event) => setReport(event.target.value)}>{reportKinds.map(([id, name]) => <option value={id} key={id}>{name}</option>)}</select></label><label>REPORTING PERIOD<select value={period} onChange={(event) => setPeriod(event.target.value)}><option>FY 2026</option><option>FY 2025</option></select></label><label>SCOPE<select><option>All registered assets</option><option>Available assets</option></select></label><label>FORMAT<select><option>PDF</option><option>Print</option></select></label></div>
          <div className="export-options"><label className="check-row"><input type="checkbox" defaultChecked /> Asset rows</label><label className="check-row"><input type="checkbox" defaultChecked /> Totals</label><label className="check-row"><input type="checkbox" defaultChecked /> Retirement notes</label><label className="check-row"><input type="checkbox" defaultChecked /> Source summary</label><button className="primary-action" onClick={() => window.print()}>Export PDF</button></div>
          <section className="admin-panel nested-panel"><div className="panel-heading"><div><h2>{reportKinds.find(([id]) => id === report)?.[1]} preview</h2><p>{period} · Report preview</p></div></div><div className="data-table"><table><thead><tr><th>ASSET</th><th>PURCHASE COST</th><th>REPAIR COST</th><th>RATIO / STATUS</th></tr></thead><tbody>{initialEquipment.slice(0, 5).map((asset) => <tr key={asset.id}><td>{asset.id} · {asset.name}</td><td>₱{Number(asset.cost).toLocaleString()}</td><td>Not recorded</td><td>{asset.status}</td></tr>)}</tbody></table></div></section>
        </section>
      )}
    </AdminLayout>
  )
}

export default Reports
