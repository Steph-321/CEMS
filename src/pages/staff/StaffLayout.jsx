import seal from '../../assets/campus-seal.png'

export function StaffIcon({ name }) {
  const icons = {
    home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h5v-6h4v6h5V10" /></>,
    inventory: <><path d="M4 7h16v13H4z" /><path d="M8 7V4h8v3M4 11h16" /></>,
    computer: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4M7 8h7v5H7zM17 8h1M17 11h1" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 10h18M7 14h3M14 14h3M7 17h3" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    scan: <><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4z" /><path d="M6.5 6.5h2v2h-2zM15.5 6.5h2v2h-2zM6.5 15.5h2v2h-2zM14 14h2v2h-2zM18 14v2M14 18h2M18 18h2v2h-2z" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4.5 4.5" /></>,
    filter: <><path d="M4 6h16M7 12h10M10 18h4" /><circle cx="8" cy="6" r="1.5" /><circle cx="15" cy="12" r="1.5" /><circle cx="12" cy="18" r="1.5" /></>,
  }
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{icons[name]}</svg>
}

function StaffLayout({ setPath, activePath, children, onContentScroll, floatingAction }) {
  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  return (
    <div className="staff-dashboard-stage">
      <div className="staff-dashboard">
        <header className="staff-dashboard-header">
          <div className="staff-brand staff-header-brand">
            <img src={seal} alt="" />
            <span>Campus Equipment<strong>Management System</strong></span>
          </div>
          <div className="staff-header-actions">
            <span className="staff-portal-label">STAFF PORTAL</span>
            <button type="button" className={`staff-notification-button ${activePath === 'notifications' ? 'active' : ''}`} aria-label="Notifications" aria-current={activePath === 'notifications' ? 'page' : undefined} onClick={() => navigate('/staff/notifications')}><StaffIcon name="bell" /></button>
          </div>
        </header>

        <main
          key={window.location.pathname}
          className="staff-notifications"
          onScroll={onContentScroll}
        >
          {children}
        </main>

        {floatingAction}

        <nav className="staff-bottom-nav" aria-label="Staff navigation">
          <div className="staff-brand staff-sidebar-brand" role="img" aria-label="Campus Equipment Management System">
            <img src={seal} alt="" />
            <span>Campus Equipment<strong>Management System</strong></span>
          </div>
          <span className="staff-nav-section-label">WORKSPACE</span>
          <button type="button" className={activePath === 'dashboard' ? 'active' : ''} aria-label="Home" title="Home" aria-current={activePath === 'dashboard' ? 'page' : undefined} onClick={() => navigate('/staff/dashboard')}><span><StaffIcon name="home" /></span><small>Home</small></button>
          <button type="button" className={activePath === 'inventory' ? 'active' : ''} aria-label="Inventory" title="Inventory" aria-current={activePath === 'inventory' ? 'page' : undefined} onClick={() => navigate('/staff/inventory')}><span><StaffIcon name="inventory" /></span><small>Inventory</small></button>
          <button type="button" className={`staff-nav-add ${activePath === 'scan' ? 'active' : ''}`} aria-label="Scan equipment" title="Scan equipment" aria-current={activePath === 'scan' ? 'page' : undefined} onClick={() => navigate('/staff/scan')}><span><StaffIcon name="scan" /></span><small>Scan</small></button>
          <button type="button" className={activePath === 'calendar' ? 'active' : ''} aria-label="Calendar" title="Calendar" aria-current={activePath === 'calendar' ? 'page' : undefined} onClick={() => navigate('/staff/calendar')}><span><StaffIcon name="calendar" /></span><small>Calendar</small></button>
          <button type="button" className={activePath === 'profile' ? 'active' : ''} aria-label="Profile" title="Profile" aria-current={activePath === 'profile' ? 'page' : undefined} onClick={() => navigate('/staff/profile')}><span><StaffIcon name="profile" /></span><small>Profile</small></button>
        </nav>
      </div>
    </div>
  )
}

export default StaffLayout
