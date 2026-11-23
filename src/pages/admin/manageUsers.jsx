import { useMemo, useState } from 'react'
import AdminLayout from './adminLayout.jsx'
import { initialUsers } from './adminData.jsx'
import { generateTemporaryPassword } from './temporaryPassword.js'

function readUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem('cems-admin-users') || '[]')
    return [...saved, ...initialUsers]
  } catch {
    return initialUsers
  }
}

function ManageUsers({ setPath }) {
  const [users, setUsers] = useState(readUsers)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('All Roles')
  const [status, setStatus] = useState('All Status')
  const [selectedId, setSelectedId] = useState(null)
  const [mode, setMode] = useState('list')
  const [newPassword, setNewPassword] = useState('')
  const [confirmDeactivate, setConfirmDeactivate] = useState(false)
  const selected = users.find((user) => user.id === selectedId)
  const visible = useMemo(() => users.filter((user) => {
    const matchSearch = `${user.name} ${user.username} ${user.email}`.toLowerCase().includes(search.toLowerCase())
    return matchSearch && (role === 'All Roles' || user.role === role) && (status === 'All Status' || user.status === status)
  }), [users, search, role, status])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  const saveEdit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const edited = { ...selected, name: String(form.get('name')), username: String(form.get('username')), email: String(form.get('email')), role: String(form.get('role')), status: String(form.get('status')) }
    setUsers((current) => current.map((user) => user.id === selectedId ? edited : user))
    setNewPassword('')
    setMode('detail')
  }

  const toggleStatus = () => {
    if (!selected) return
    const nextStatus = selected.status === 'Active' ? 'Deactivated' : 'Active'
    setUsers((current) => current.map((user) => user.id === selectedId ? { ...user, status: nextStatus } : user))
    setConfirmDeactivate(false)
    setMode('list')
  }

  return (
    <AdminLayout setPath={setPath} active="users" title={mode === 'list' ? 'User Management' : mode === 'edit' ? 'Edit User' : 'Selected user'}>
      {mode === 'list' && (
        <>
          <div className="page-toolbar"><div><h2>User Management</h2><p>Manage system users and their access levels.</p></div><button className="primary-action" onClick={() => navigate('/admin/users/add')}>＋ Add New User</button></div>
          <div className="user-filter-bar">
            <label>SEARCH<input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name, username, or email..." /></label>
            <label>ROLE<select value={role} onChange={(event) => setRole(event.target.value)}><option>All Roles</option><option>Administrator</option><option>Staff</option></select></label>
            <label>STATUS<select value={status} onChange={(event) => setStatus(event.target.value)}><option>All Status</option><option>Active</option><option>Deactivated</option></select></label>
            <button className="secondary-action" onClick={() => { setSearch(''); setRole('All Roles'); setStatus('All Status') }}>⟳ Reset Filters</button>
          </div>
          <section className="admin-panel user-list-panel">
            <div className="panel-heading"><div><h2>User List</h2></div></div>
            <div className="data-table">
              <table>
                <thead><tr><th><input type="checkbox" aria-label="Select all users" /></th><th>USER ID</th><th>FULL NAME</th><th>USERNAME</th><th>EMAIL ADDRESS</th><th>ROLE</th><th>STATUS</th><th>LAST LOGIN</th><th>ACTIONS</th></tr></thead>
                <tbody>{visible.map((user) => (
                  <tr key={user.id}>
                    <td><input type="checkbox" aria-label={`Select ${user.name}`} /></td><td>{user.id}</td><td><strong>{user.name}</strong></td><td>{user.username}</td><td>{user.email}</td>
                    <td><span className={`role-pill ${user.role === 'Staff' ? 'staff' : ''}`}>{user.role}</span></td>
                    <td><span className={`status-badge ${user.status === 'Active' ? 'user-active' : 'user-inactive'}`}>{user.status}</span></td><td>{user.lastLogin || 'Never'}</td>
                    <td><div className="row-actions"><button className="icon-button" aria-label={`Edit ${user.name}`} onClick={() => { setSelectedId(user.id); setNewPassword(''); setMode('edit') }}><RowActionIcon name="edit" /></button><button className="icon-button danger" aria-label={`${user.status === 'Active' ? 'Deactivate' : 'Activate'} ${user.name}`} onClick={() => { setSelectedId(user.id); setConfirmDeactivate(true) }}><RowActionIcon name="delete" /></button></div></td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div className="table-footer"><span>Showing 1 - {visible.length} of {users.length} users</span><div className="pagination"><button>‹</button><button className="active">1</button><button>›</button></div></div>
          </section>
        </>
      )}

      {mode === 'edit' && selected && (
        <section className="admin-panel">
          <div className="page-toolbar"><div><h2>Edit User</h2><p>User Management / {selected.name} / {selected.id}</p></div><button className="secondary-action" onClick={() => setMode('list')}>← Back</button></div>
          <form className="admin-form" onSubmit={saveEdit}>
            <div className="admin-form-grid">
              <div className="subpanel"><h3>Staff Information</h3><label>Full Name *<input name="name" defaultValue={selected.name} required /></label><label>Email Address *<input name="email" type="email" defaultValue={selected.email} required /></label><label>Role *<select name="role" defaultValue={selected.role}><option>Staff</option><option>Administrator</option></select></label></div>
              <div className="subpanel"><h3>Account Setting</h3><label>Username *<input name="username" defaultValue={selected.username} required /></label><label>New Temporary Password<input name="password" type="text" minLength="8" placeholder="Leave blank to keep unchanged" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label><button type="button" className="secondary-action" onClick={() => setNewPassword(generateTemporaryPassword(newPassword))}>Generate New Password</button><label>Status *<select name="status" defaultValue={selected.status} required><option>Active</option><option>Deactivated</option></select></label></div>
            </div>
            <p className="form-note">Leave blank to keep the current password. Generated passwords are unique, but this demo does not yet connect password changes to authentication.</p>
            <div className="form-actions"><button type="button" className="secondary-action" onClick={() => setMode('list')}>Cancel</button><button className="primary-action">Save Changes</button></div>
          </form>
        </section>
      )}

      {mode === 'detail' && selected && (
        <section className="admin-panel"><div className="page-toolbar"><div><h2>Selected user</h2><p>{selected.name} · {selected.id}</p></div><button className="secondary-action" onClick={() => setMode('list')}>← Back</button></div><div className="detail-pairs"><div><span>Staff account</span><strong>{selected.name}</strong></div><div><span>Email</span><strong>{selected.email}</strong></div><div><span>Username</span><strong>{selected.username}</strong></div><div><span>Role</span><strong>{selected.role}</strong></div><div><span>Status</span><strong>{selected.status}</strong></div></div></section>
      )}

      {confirmDeactivate && selected && (
        <div className="modal-scrim" role="presentation" onMouseDown={() => setConfirmDeactivate(false)}>
          <section className="admin-dialog" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <div className="dialog-heading"><div><h2>{selected.status === 'Active' ? `Deactivate ${selected.name}?` : `Activate ${selected.name}?`}</h2><p>User Management / {selected.name}</p></div><button className="dialog-close" onClick={() => setConfirmDeactivate(false)}>×</button></div>
            <div className="info-callout danger-callout">Account access will be {selected.status === 'Active' ? 'disabled' : 'restored'}. Maintenance records and audit history will be preserved.</div>
            <div className="form-actions"><button className="secondary-action" onClick={() => setConfirmDeactivate(false)}>Cancel</button><button className="primary-action" onClick={toggleStatus}>{selected.status === 'Active' ? 'Deactivate User' : 'Activate User'}</button></div>
          </section>
        </div>
      )}
    </AdminLayout>
  )
}

function RowActionIcon({ name }) {
  return name === 'edit' ? (
    <svg className="row-action-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.8 3.2 12.8 6.2M2.5 13.5l3.2-.7 7.1-7.1a1.6 1.6 0 0 0-2.3-2.3l-7.1 7.1-.9 3z" /><path d="M8.5 13.5h5" /></svg>
  ) : (
    <svg className="row-action-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 4.5h10M6 4.5V3h4v1.5M4.5 4.5l.6 9h5.8l.6-9M6.5 7v4M9.5 7v4" /></svg>
  )
}

export default ManageUsers
