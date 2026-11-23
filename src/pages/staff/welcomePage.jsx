import { useEffect, useState } from 'react'
import seal from '../../assets/campus-seal.png'

function StaffWelcome({ setPath }) {
  const [equipment, setEquipment] = useState([])

  useEffect(() => {
    fetch('/api/Equipment')
      .then((response) => response.ok ? response.json() : [])
      .then((data) => setEquipment(Array.isArray(data) ? data : []))
      .catch(() => setEquipment([]))
  }, [])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  const attention = equipment.filter((item) => item.status !== 'Usable').length

  return (
    <div className="staff-app">
      <header className="staff-header">
        <div className="role-brand">
          <img src={seal} alt="" />
          <span>Campus Equipment<strong>Management System</strong></span>
        </div>
        <button className="notification-button" aria-label="Notifications">♢</button>
      </header>

      <main className="staff-main">
        <p className="staff-welcome">Welcome to CEMS</p>
        <h1>Staff dashboard</h1>

        <section className="staff-summary">
          <div><span>Registered equipment</span><strong>{equipment.length}</strong></div>
          <div><span>Needs attention</span><strong>{attention}</strong></div>
        </section>

        <nav className="staff-actions" aria-label="Staff actions">
          <button><span className="staff-action-icon">▣</span><span>Inventory</span></button>
          <button><span className="staff-action-icon">⌗</span><span>Scan</span></button>
          <button><span className="staff-action-icon">▤</span><span>Maintenance</span></button>
          <button><span className="staff-action-icon">□</span><span>Calendar</span></button>
        </nav>
      </main>

      <button className="staff-signout" onClick={() => navigate('/')}>Log out</button>
    </div>
  )
}

export default StaffWelcome