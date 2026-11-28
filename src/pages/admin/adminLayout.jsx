import { useState } from 'react'
import seal from '../../assets/campus-seal.png'
import { getAccountProfileStorageKey, getCurrentUser, saveCurrentUser, clearCurrentUser } from '../auth/localAuth.js'

const profileStorageKey = 'cems-admin-profile'
const defaultProfile = {
  name: 'Administrator',
  username: '@admin',
  email: 'admin@cems.edu',
  role: 'Administrator',
  status: 'Active',
}

function readProfile() {
  try {
    const currentUser = getCurrentUser()
    const saved = localStorage.getItem(currentUser ? getAccountProfileStorageKey(currentUser.id) : profileStorageKey)
    if (!saved) {
      if (!currentUser) return { profile: defaultProfile, error: '' }
      return {
        profile: Object.fromEntries(Object.keys(defaultProfile).map((field) => [field, currentUser[field]])),
        error: '',
      }
    }

    const parsed = JSON.parse(saved)
    const fields = Object.keys(defaultProfile)
    if (!parsed || typeof parsed !== 'object' || fields.some((field) => typeof parsed[field] !== 'string')) {
      throw new Error('Saved administrator profile has an invalid format.')
    }

    return { profile: Object.fromEntries(fields.map((field) => [field, parsed[field]])), error: '' }
  } catch (error) {
    console.error('Unable to load administrator profile.', error)
    return { profile: defaultProfile, error: 'Could not load the saved profile. Your edits may not be retained.' }
  }
}

const navigation = [
  ['dashboard', 'Dashboard', 'dashboard', '/admin/dashboard'],
  ['equipment', 'Asset Inventory', 'inventory', '/admin/equipment'],
  ['maintenance', 'Maintenance', 'maintenance', '/admin/maintenance'],
  ['schedule', 'Equipment Calendar', 'calendar', '/admin/schedule'],
  ['reports', 'Reports & Analytics', 'reports', '/admin/reports'],
  ['users', 'User Management', 'users', '/admin/users'],
]

const iconPaths = {
  dashboard: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
  inventory: <><path d="M4 7h16v13H4z" /><path d="M8 7V4h8v3M4 11h16" /></>,
  maintenance: <><path d="M14.5 6.5a5 5 0 0 0-6.8 6.8L3 18l3 3 4.7-4.7a5 5 0 0 0 6.8-6.8L14 12l-3-3z" /><path d="m15 4 5 5" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M7 14h3M14 14h3M7 17h3" /></>,
  reports: <><path d="M4 20V4M4 20h17" /><path d="m7 15 4-4 3 2 5-7" /></>,
  users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-1a6 6 0 0 1 12 0v1zM16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 5v1" /></>,
  bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3" /><path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7" /></>,
}

function SidebarIcon({ name }) {
  return <svg className="admin-nav-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{iconPaths[name]}</svg>
}

function AdminLayout({ setPath, active, title, children }) {
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileState, setProfileState] = useState(readProfile)
  const { profile, error: profileError } = profileState
  const [profileSaved, setProfileSaved] = useState(false)
  const initials = profile.name === 'Administrator'
    ? 'AD'
    : profile.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  const logout = () => {
    clearCurrentUser()
    navigate('/admin')
  }

  const saveProfile = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const updatedProfile = {
      ...profile,
      name: String(form.get('name')).trim(),
      username: String(form.get('username')).trim(),
      email: String(form.get('email')).trim(),
    }

    if (!updatedProfile.name || !updatedProfile.username || !updatedProfile.email) {
      setProfileState((current) => ({ ...current, error: 'Name, username, and email are required.' }))
      setProfileSaved(false)
      return
    }

    try {
      const currentUser = getCurrentUser()
      localStorage.setItem(
        currentUser ? getAccountProfileStorageKey(currentUser.id) : profileStorageKey,
        JSON.stringify(updatedProfile),
      )
      if (currentUser) saveCurrentUser({ ...currentUser, ...updatedProfile })
      setProfileState({ profile: updatedProfile, error: '' })
      setProfileSaved(true)
    } catch (error) {
      console.error('Unable to save administrator profile.', error)
      setProfileState((current) => ({ ...current, error: 'Could not save your profile. Please try again.' }))
      setProfileSaved(false)
    }
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <img src={seal} alt="Campus seal" />
          <div><strong>CEMS</strong><span>COTE</span></div>
        </div>

        <nav className="admin-navigation" aria-label="Admin pages">
          {navigation.map(([id, label, icon, path]) => (
            <button key={id} className={active === id ? 'active' : ''} aria-label={label} title={label} onClick={() => navigate(path)}>
              <span className="nav-icon"><SidebarIcon name={icon} /></span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <button className={`admin-side-link ${active === 'notifications' ? 'active' : ''}`} aria-label="Notifications" title="Notifications" onClick={() => navigate('/admin/notifications')}>
            <span className="nav-icon"><SidebarIcon name="bell" /></span><span>Notifications</span>
          </button>
          <button className="admin-logout" aria-label="Logout" title="Logout" onClick={logout}><span className="nav-icon"><SidebarIcon name="logout" /></span><span>Logout</span></button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <span className="breadcrumb">CEMS / {profileOpen ? 'My Profile' : title}</span>
            <h1>{profileOpen ? 'My Profile' : title}</h1>
          </div>
          <div className="header-actions">
            <button aria-label="Notifications" className="header-bell" onClick={() => navigate('/admin/notifications')}><SidebarIcon name="bell" /></button>
            <div className="admin-profile">
              <button className="admin-profile-trigger" onClick={() => { setProfileOpen((open) => !open); setProfileSaved(false) }} aria-label={`Open ${profile.name} profile`} aria-expanded={profileOpen}>
                <span className="admin-profile-avatar">{initials}</span>
                <span className="admin-profile-copy"><strong>{profile.name}</strong><small>{profile.role}</small></span>
              </button>
            </div>
          </div>
        </header>

        <div className="admin-content">
          {profileOpen ? (
            <section className="profile-view">
              <div className="page-toolbar">
                <div><h2>{profile.role} Profile</h2><p>View and update your account information.</p></div>
                <button className="secondary-action" onClick={() => { setProfileOpen(false); setProfileSaved(false) }}>← Back to {title}</button>
              </div>
              <div className="profile-layout">
                <section className="admin-panel profile-summary">
                  <div className="profile-large-avatar">{initials}</div>
                  <h2>{profile.name}</h2>
                  <p>{profile.email}</p>
                  <span className="role-pill">{profile.role}</span>
                  <div className="profile-summary-details">
                    <div><span>Account status</span><strong className="status-badge user-active">{profile.status}</strong></div>
                    <div><span>Username</span><strong>{profile.username}</strong></div>
                  </div>
                </section>
                <section className="admin-panel">
                  <div className="panel-heading"><div><h2>Personal Information</h2><p>Keep your administrator contact details up to date.</p></div></div>
                  {profileSaved && <p className="save-message">Profile changes saved.</p>}
                  {profileError && <p className="save-error" role="alert">{profileError}</p>}
                  <form className="admin-form" onSubmit={saveProfile}>
                    <div className="admin-form-grid">
                      <label>Full Name *<input name="name" defaultValue={profile.name} required /></label>
                      <label>Username *<input name="username" defaultValue={profile.username} required /></label>
                      <label className="form-span-2">Email Address *<input name="email" type="email" defaultValue={profile.email} required /></label>
                      <label>Role<input value={profile.role} readOnly /></label>
                      <label>Account Status<input value={profile.status} readOnly /></label>
                    </div>
                    <div className="form-actions"><button type="button" className="secondary-action" onClick={() => { setProfileOpen(false); setProfileSaved(false) }}>Cancel</button><button type="submit" className="primary-action">Save Changes</button></div>
                  </form>
                </section>
              </div>
            </section>
          ) : children}
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
