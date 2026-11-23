import { useState } from 'react'
import AdminLayout from './adminLayout.jsx'
import { generateTemporaryPassword } from './temporaryPassword.js'

function AddUser({ setPath }) {
  const [saved, setSaved] = useState(false)
  const [password, setPassword] = useState(generateTemporaryPassword)

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  const submit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const username = String(form.get('username')).trim().replace(/^@+/, '')
    const user = {
      id: String(Date.now()).slice(-3),
      name: String(form.get('name')).trim(),
      username: `@${username}`,
      email: String(form.get('email')).trim(),
      role: String(form.get('role')),
      status: form.get('active') ? 'Active' : 'Deactivated',
      lastLogin: 'Never',
    }
    let users
    try {
      users = JSON.parse(localStorage.getItem('cems-admin-users') || '[]')
      if (!Array.isArray(users)) users = []
    } catch {
      users = []
    }
    localStorage.setItem('cems-admin-users', JSON.stringify([user, ...users]))
    setSaved(true)
    window.setTimeout(() => navigate('/admin/users'), 500)
  }

  return (
    <AdminLayout setPath={setPath} active="users" title="Add New User">
      <section className="admin-panel">
        <div className="page-toolbar"><div><h2>Add New User</h2><p>User Management / Create account</p></div><button className="secondary-action" onClick={() => navigate('/admin/users')}>← Back</button></div>
        {saved && <p className="save-message">User created. Returning to User Management...</p>}
        <form className="admin-form add-user-form" onSubmit={submit}>
          <div className="admin-form-grid">
            <div className="subpanel">
              <h3>Staff Information</h3>
              <label>Full Name *<input name="name" placeholder="Enter full name" required /></label>
              <label>Email Address *<input name="email" type="email" placeholder="name@ctu.edu.ph" required /></label>
              <label>Role *<select name="role" required defaultValue="Staff"><option>Staff</option><option>Administrator</option></select></label>
            </div>
            <div className="subpanel">
              <h3>Account Setting</h3>
              <label>Username *<input name="username" placeholder="@admin" required /></label>
              <label>Temporary Password *<input name="password" type="text" autoComplete="new-password" minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
              <button type="button" className="secondary-action" onClick={() => setPassword(generateTemporaryPassword(password))}>Generate New Password</button>
              <label className="check-row"><input type="checkbox" name="active" defaultChecked /> Set Active Status</label>
              <span className="status-badge user-active">Active</span>
            </div>
          </div>
          <p className="form-note">Use a username such as @admin and enter a valid email separately. The random temporary password is editable but is not saved for authentication in this demo.</p>
          <div className="form-actions"><button type="button" className="secondary-action" onClick={() => navigate('/admin/users')}>Cancel</button><button type="submit" className="primary-action">Save &amp; Create User</button></div>
        </form>
      </section>
    </AdminLayout>
  )
}

export default AddUser
