import { useState } from 'react'
import AdminLayout from './adminLayout.jsx'
import { generateTemporaryPassword } from './temporaryPassword.js'
import { generateStaffTemporaryPassword } from '../staff/staffTemporaryPassword.js'
import { createLocalPasswordCredential } from '../auth/localAuth.js'

function AddUser({ setPath }) {
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [role, setRole] = useState('Staff')
  const [password, setPassword] = useState(generateStaffTemporaryPassword)

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  const submit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const username = String(form.get('username')).trim().replace(/^@+/, '')
    let credential
    try {
      credential = await createLocalPasswordCredential(password)
    } catch (saveError) {
      console.error('Unable to secure the new account password.', saveError)
      setError('Could not securely save the password. Please try again.')
      return
    }

    const user = {
      id: String(Date.now()).slice(-3),
      name: String(form.get('name')).trim(),
      username: `@${username}`,
      email: String(form.get('email')).trim(),
      role,
      status: form.get('active') ? 'Active' : 'Deactivated',
      lastLogin: 'Never',
      ...credential,
    }
    let users
    try {
      users = JSON.parse(localStorage.getItem('cems-admin-users') || '[]')
      if (!Array.isArray(users)) throw new Error('Saved user accounts are not in the expected format.')
    } catch (loadError) {
      console.error('Unable to read saved user accounts.', loadError)
      setError('Could not load user accounts. Please check the saved account data.')
      return
    }
    try {
      localStorage.setItem('cems-admin-users', JSON.stringify([user, ...users]))
    } catch (storageError) {
      console.error('Unable to save the new user account.', storageError)
      setError('Could not save the new user account. Please try again.')
      return
    }
    setSaved(true)
    window.setTimeout(() => navigate('/admin/users'), 500)
  }

  return (
    <AdminLayout setPath={setPath} active="users" title="Add New User">
      <section className="admin-panel">
        <div className="page-toolbar"><div><h2>Add New User</h2><p>User Management / Create account</p></div><button className="secondary-action" onClick={() => navigate('/admin/users')}>← Back</button></div>
        {saved && <p className="save-message">User created. Returning to User Management...</p>}
        {error && <p className="login-error" role="alert">{error}</p>}
        <form className="admin-form" onSubmit={submit}>
          <div className="admin-form-grid">
            <div className="subpanel">
              <h3>Staff Information</h3>
              <label>Full Name *<input name="name" placeholder="Enter full name" required /></label>
              <label>Email Address *<input name="email" type="email" placeholder="name@ctu.edu.ph" required /></label>
              <label>Role *<select name="role" required value={role} onChange={(event) => {
                const nextRole = event.target.value
                setRole(nextRole)
                setPassword(nextRole === 'Staff'
                  ? generateStaffTemporaryPassword(password)
                  : generateTemporaryPassword(password))
              }}><option>Staff</option><option>Administrator</option></select></label>
            </div>
            <div className="subpanel">
              <h3>Account Setting</h3>
              <label>Username *<input name="username" placeholder="@admin" required /></label>
              <label>{role === 'Staff' ? 'Staff Temporary Password *' : 'Temporary Password *'}<input name="password" type="text" autoComplete="new-password" minLength="8" value={password} onChange={(event) => setPassword(event.target.value)} readOnly={role === 'Staff'} required /></label>
              <button type="button" className="secondary-action" onClick={() => setPassword(role === 'Staff'
                ? generateStaffTemporaryPassword(password)
                : generateTemporaryPassword(password))}>Generate New Password</button>
              <label className="check-row"><input type="checkbox" name="active" defaultChecked /> Set Active Status</label>
              <span className="status-badge user-active">Active</span>
            </div>
          </div>
          <p className="form-note">Use a username such as @staff and enter a valid email separately. Staff temporary passwords are unique from admin-generated passwords. Share the generated password with the user; it is securely hashed for demo sign-in.</p>
          <div className="form-actions"><button type="button" className="secondary-action" onClick={() => navigate('/admin/users')}>Cancel</button><button type="submit" className="primary-action">Save &amp; Create User</button></div>
        </form>
      </section>
    </AdminLayout>
  )
}

export default AddUser
