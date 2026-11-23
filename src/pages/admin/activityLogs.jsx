import AdminLayout from './adminLayout.jsx'

function ActivityLogs({ setPath }) {
  const rows = [['Administrator', 'Added equipment CEMS-PC-006', 'Today, 10:24 AM'], ['Administrator', 'Updated inspection INS-002', 'Today, 9:10 AM'], ['Administrator', 'Created maintenance request MR-002', 'Yesterday, 4:48 PM']]
  return (
    <AdminLayout setPath={setPath} active="activity" title="Activity Logs">
      <section className="admin-panel"><div className="panel-heading"><div><h2>Activity Logs</h2><p>Recent system activity</p></div></div><div className="data-table"><table><thead><tr><th>User</th><th>Activity</th><th>Date</th></tr></thead><tbody>{rows.map((row) => <tr key={row[1]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div></section>
    </AdminLayout>
  )
}
export default ActivityLogs
