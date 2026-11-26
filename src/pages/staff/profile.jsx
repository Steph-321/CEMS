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
      <div className="staff-view-heading"><h1>Profile</h1></div>
      <section className="staff-profile-card">
        <div className="staff-profile-avatar">{initials}</div>
        <h2>{name}</h2>
        <p>{currentUser?.email || 'Campus Equipment Management System'}</p>
        <span>{currentUser?.role || 'Staff'}</span>
      </section>
      <button type="button" className="staff-logout-button" onClick={logout}>Log out</button>
    </StaffLayout>
  )
}

export default Profile
