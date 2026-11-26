import { useState } from 'react'
import StaffLayout, { StaffIcon } from './StaffLayout.jsx'

function Dashboard({ setPath }) {
  const [filter, setFilter] = useState('All')
  const [allRead, setAllRead] = useState(false)

  return (
    <StaffLayout setPath={setPath} activePath="dashboard">
      <div className="notifications-heading">
        <h1>Notifications</h1>
        <button type="button" onClick={() => setAllRead(true)} disabled={allRead}>{allRead ? 'All read' : 'Mark all as read'}</button>
      </div>

      <nav className="notification-filter" aria-label="Notification filters">
        {['All', 'Overdue', 'Recent'].map((option) => (
          <button key={option} className={filter === option ? 'active' : ''} type="button" onClick={() => setFilter(option)}>
            {option}
            {option !== 'All' && <span className="filter-dot" />}
          </button>
        ))}
      </nav>

      <section className="notification-empty" aria-live="polite">
        <span className="empty-bell"><StaffIcon name="bell" /></span>
        <strong>{allRead ? 'No unread notifications' : 'No notifications'}</strong>
        <p>{allRead ? 'You are all caught up.' : 'New alerts and updates will appear here.'}</p>
      </section>
    </StaffLayout>
  )
}

export default Dashboard
