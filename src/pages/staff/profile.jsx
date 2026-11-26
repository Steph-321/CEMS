import { useState } from 'react'
import StaffLayout from './StaffLayout.jsx'
import { clearCurrentUser, getCurrentUser } from '../auth/localAuth.js'

function Profile({ setPath }) {
  const [currentUser] = useState(() => getCurrentUser())
  const name = currentUser?.name || 'Staff Member'
  const initials = name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  const logout = () => {
    clearCurrentUser()
    window.history.pushState({}, '', '/')
    setPath('/')
  }

  return (
    <StaffLayout setPath={setPath} activePath="profile">
      <div className="staff-view-heading"><div><span className="staff-eyebrow">YOUR ACCOUNT</span><h1>Profile</h1><p>Manage your staff account details.</p></div></div>
      <section className="staff-profile-card">
        <div className="staff-profile-identity">
          <div className="staff-profile-avatar">{initials}</div>
          <div><h2>{name}</h2><p>{currentUser?.email || 'Campus Equipment Management System'}</p></div>
        </div>
        <span className="staff-profile-role">{currentUser?.role || 'Staff'} account</span>
        <div className="staff-profile-details">
          <div><span>Account type</span><strong>{currentUser?.role || 'Staff'}</strong></div>
          <div><span>Workspace</span><strong>Campus equipment</strong></div>
        </div>
      </section>
      <section className="staff-profile-note">
        <span className="staff-profile-note-icon" aria-hidden="true">✓</span>
        <div><strong>Staff access</strong><p>Your account is set up for campus equipment tasks.</p></div>
      </section>
      <button type="button" className="staff-logout-button" onClick={logout}><span aria-hidden="true">↗</span> Log out</button>
    </StaffLayout>
  )
}

export default Profile
