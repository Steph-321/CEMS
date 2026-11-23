import AdminLayout from './adminLayout.jsx'

function Settings({ setPath }) {
  return (
    <AdminLayout setPath={setPath} active="settings" title="Settings">
      <section className="admin-panel"><div className="panel-heading"><div><h2>Settings</h2><p>Campus system configuration</p></div></div><div className="settings-form"><label>Organization name<input defaultValue="CEMS Campus" /></label><label>System email<input defaultValue="admin@cems.edu" /></label><label>Maintenance reminder<select defaultValue="7"><option value="7">7 days before schedule</option><option value="14">14 days before schedule</option><option value="30">30 days before schedule</option></select></label><button className="primary-action">Save changes</button></div></section>
    </AdminLayout>
  )
}
export default Settings
