import AdminLayout from './adminLayout.jsx'

function EquipmentStatus({ setPath }) {
  const rows = [['Desktop Computer', 'CEMS-PC-001', 'Computer Lab 1', 'Good', 'Available'], ['LCD Monitor', 'CEMS-MON-014', 'Computer Lab 2', 'Fair', 'Needs Inspection'], ['Projector', 'CEMS-PRO-008', 'Computer Lab 3', 'Needs Repair', 'Under Maintenance']]
  return (
    <AdminLayout setPath={setPath} active="status" title="Equipment Status">
      <section className="admin-panel"><div className="panel-heading"><div><h2>Equipment Status</h2><p>Availability and condition monitoring</p></div></div><div className="data-table"><table><thead><tr><th>Equipment</th><th>Asset Code</th><th>Laboratory</th><th>Condition</th><th>Status</th></tr></thead><tbody>{rows.map((row) => <tr key={row[1]}>{row.map((cell, index) => <td key={cell}>{index === 0 ? <strong>{cell}</strong> : index === 4 ? <span className={`status-badge ${cell === 'Available' ? 'available' : cell === 'Under Maintenance' ? 'maintenance' : 'inspection'}`}>{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div></section>
    </AdminLayout>
  )
}
export default EquipmentStatus
