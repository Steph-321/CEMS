import seal from '../../assets/campus-seal.png'

export function StaffIcon({ name }) {
  const icons = {
    home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h5v-6h4v6h5V10" /></>,
    inventory: <><path d="M4 7h16v13H4z" /><path d="M8 7V4h8v3M4 11h16" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M7 14h3M14 14h3M7 17h3" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    scan: <><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4z" /><path d="M6.5 6.5h2v2h-2zM15.5 6.5h2v2h-2zM6.5 15.5h2v2h-2zM14 14h2v2h-2zM18 14v2M14 18h2M18 18h2v2h-2z" /></>,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>
}

function StaffLayout({ setPath, activePath, children }) {
  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  return (
    <div className="staff-dashboard-stage">
      <div className="staff-dashboard">
        <div className="phone-status" aria-hidden="true">
          <time>9:30</time>
          <div className="phone-status-icons"><span className="signal-bars">▮▮▮</span><span className="status-bell">●</span></div>
        </div>

        <header className="staff-dashboard-header">
          <div className="staff-brand">
            <img src={seal} alt="" />
            <span>Campus Equipment<strong>Management System</strong></span>
          </div>
          <button className="staff-notification-button" aria-label="Notifications" onClick={() => navigate('/staff/dashboard')}><StaffIcon name="bell" /></button>
        </header>

        <main className="staff-notifications">{children}</main>

        <nav className="staff-bottom-nav" aria-label="Staff navigation">
          <button type="button" className={activePath === 'dashboard' ? 'active' : ''} onClick={() => navigate('/staff/dashboard')}><span><StaffIcon name="home" /></span><small>Dashboard</small></button>
          <button type="button" className={activePath === 'inventory' ? 'active' : ''} onClick={() => navigate('/staff/inventory')}><span><StaffIcon name="inventory" /></span><small>Inventory</small></button>
          <button type="button" className={`staff-nav-add ${activePath === 'scan' ? 'active' : ''}`} aria-label="Scan equipment" onClick={() => navigate('/staff/scan')}><span><StaffIcon name="scan" /></span></button>
          <button type="button" className={activePath === 'calendar' ? 'active' : ''} onClick={() => navigate('/staff/calendar')}><span><StaffIcon name="calendar" /></span><small>Calendar</small></button>
          <button type="button" className={activePath === 'profile' ? 'active' : ''} onClick={() => navigate('/staff/profile')}><span><StaffIcon name="profile" /></span><small>Profile</small></button>
        </nav>

      </div>
    </div>
  )
}

export default StaffLayout
