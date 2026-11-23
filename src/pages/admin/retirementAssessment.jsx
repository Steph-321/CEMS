import AdminLayout from './adminLayout.jsx'

function RetirementAssessment({ setPath }) {
  const rows = [['Desktop Computer', '2026', '₱48,000', '₱12,000', 'Repair cost acceptable', 'Review'], ['Projector', '2026', '₱75,000', '₱52,000', 'Consider replacement', 'Pending']]
  return (
    <AdminLayout setPath={setPath} active="retirement" title="Retirement Assessment">
      <section className="admin-panel"><div className="panel-heading"><div><h2>Retirement Assessments</h2><p>Repair cost and replacement reviews</p></div><button className="primary-action">+ New Assessment</button></div><div className="data-table"><table><thead><tr><th>Equipment</th><th>Period</th><th>Purchase Cost</th><th>Repair Cost</th><th>Recommendation</th><th>Decision</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((cell, index) => <td key={cell}>{index === 5 ? <span className="status-badge maintenance">{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div></section>
    </AdminLayout>
  )
}
export default RetirementAssessment
