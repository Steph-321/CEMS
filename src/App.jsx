import { useEffect, useState } from 'react'
import Login from './pages/auth/login.jsx'
import AdminDashboard from './pages/admin/dashboard.jsx'
import ManageEquipment from './pages/admin/manageEquipment.jsx'
import EquipmentCategories from './pages/admin/equipmentCategories.jsx'
import EquipmentStatus from './pages/admin/equipmentStatus.jsx'
import Maintenance from './pages/admin/maintenance.jsx'
import Inspections from './pages/admin/inspections.jsx'
import Schedule from './pages/admin/schedule.jsx'
import Reports from './pages/admin/reports.jsx'
import RetirementAssessment from './pages/admin/retirementAssessment.jsx'
import ActivityLogs from './pages/admin/activityLogs.jsx'
import Notifications from './pages/admin/notifications.jsx'
import ManageUsers from './pages/admin/manageUsers.jsx'
import AddUser from './pages/admin/addUser.jsx'
import Settings from './pages/admin/settings.jsx'
import StaffWelcome from './pages/staff/welcomePage.jsx'
import './App.css'

function App() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  if (path === '/admin' || path === '/admin/dashboard') return <AdminDashboard setPath={setPath} />
  if (path === '/admin/equipment') return <ManageEquipment setPath={setPath} />
  if (path === '/admin/categories') return <EquipmentCategories setPath={setPath} />
  if (path === '/admin/status') return <EquipmentStatus setPath={setPath} />
  if (path === '/admin/maintenance') return <Maintenance setPath={setPath} />
  if (path === '/admin/inspections') return <Inspections setPath={setPath} />
  if (path === '/admin/schedule') return <Schedule setPath={setPath} />
  if (path === '/admin/reports') return <Reports setPath={setPath} />
  if (path === '/admin/retirement') return <RetirementAssessment setPath={setPath} />
  if (path === '/admin/activity') return <ActivityLogs setPath={setPath} />
  if (path === '/admin/notifications') return <Notifications setPath={setPath} />
  if (path === '/admin/users/add') return <AddUser setPath={setPath} />
  if (path === '/admin/users') return <ManageUsers setPath={setPath} />
  if (path === '/admin/settings') return <Settings setPath={setPath} />
  if (path.startsWith('/staff')) return <StaffWelcome setPath={setPath} />
  return <Login setPath={setPath} />
}

export default App
