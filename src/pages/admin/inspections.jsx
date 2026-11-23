import AdminLayout from './adminLayout.jsx'

function Inspections({ setPath }) {
  const rows = [['INS-001', 'Desktop Computer', 'November 24, 2026', 'Passed', 'December 24, 2026'], ['INS-002', 'LCD Monitor', 'November 23, 2026', 'Pending', 'February 23, 2027']]
  return (
    <AdminLayout setPath={setPath} active="inspections" title="Inspections">
      <section className="admin-panel"><div className="panel-heading"><div><h2>Inspections</h2><p>Scheduled and completed inspections</p></div><button className="primary-action">+ Schedule Inspection</button></div><div className="data-table"><table><thead><tr><th>Inspection</th><th>Equipment</th><th>Scheduled</th><th>Outcome</th><th>Next Inspection</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}>{index === 3 ? <span className="status-badge maintenance">{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div></section>
    </AdminLayout>
  )
}
export default Inspections
