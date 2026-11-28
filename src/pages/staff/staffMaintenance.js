import { initialEquipment, initialTickets } from '../admin/adminData.jsx'

const staffTicketsStorageKey = 'cems-staff-maintenance-tickets'
const staffEquipmentStorageKey = 'cems-staff-equipment-updates'

function getEquipmentOverrides() {
  const saved = localStorage.getItem(staffEquipmentStorageKey)
  return saved ? JSON.parse(saved) : {}
}

export function getStaffTickets() {
  const saved = localStorage.getItem(staffTicketsStorageKey)
  return saved ? JSON.parse(saved) : initialTickets
}

export function saveStaffTickets(tickets) {
  localStorage.setItem(staffTicketsStorageKey, JSON.stringify(tickets))
}

export function createStaffTicket({ asset, assetId, issue, severity, description, attachmentName }) {
  const tickets = getStaffTickets()
  const nextNumber = tickets.reduce((highest, ticket) => {
    const number = Number(ticket.id.match(/^TASK-(\d+)$/)?.[1] || 0)
    return Math.max(highest, number)
  }, 0) + 1
  const ticket = {
    id: `TASK-${String(nextNumber).padStart(3, '0')}`,
    assetId: assetId.trim() || 'Not supplied',
    asset: asset.trim(),
    issue,
    severity,
    status: 'Unassigned',
    reporter: 'Staff',
    technician: 'Unassigned',
    description: attachmentName ? `${description}\nAttachment selected: ${attachmentName}` : description,
    date: new Date().toLocaleDateString(),
  }
  saveStaffTickets([ticket, ...tickets])
  return ticket
}

export function updateStaffTicket(ticketId, updates) {
  const tickets = getStaffTickets()
  const found = tickets.some((ticket) => ticket.id === ticketId)
  if (!found) throw new Error(`Maintenance task ${ticketId} could not be found.`)

  const updatedTickets = tickets.map((ticket) => (
    ticket.id === ticketId ? { ...ticket, ...updates, updatedAt: new Date().toISOString() } : ticket
  ))
  saveStaffTickets(updatedTickets)
  return updatedTickets.find((ticket) => ticket.id === ticketId)
}

export function getStaffEquipment() {
  const equipmentOverrides = getEquipmentOverrides()
  const statusTasks = getStaffTickets()
    .filter((ticket) => ticket.status === 'Assigned' || (['Completed', 'Unserviceable'].includes(ticket.status) && ticket.repairDate))
    .sort((first, second) => Date.parse(second.updatedAt || second.repairDate || second.date) - Date.parse(first.updatedAt || first.repairDate || first.date))

  return initialEquipment.map((asset) => {
    const latestTask = statusTasks.find((ticket) => ticket.assetId === asset.id)
    const manualUpdate = equipmentOverrides[asset.id]
    const taskUpdatedAt = latestTask ? Date.parse(latestTask.updatedAt || latestTask.repairDate || latestTask.date) : 0
    const manualUpdatedAt = manualUpdate ? Date.parse(manualUpdate.updatedAt) : 0
    if (manualUpdate && (!latestTask || manualUpdatedAt >= taskUpdatedAt)) {
      return { ...asset, ...manualUpdate }
    }
    if (!latestTask) return asset
    if (latestTask.status === 'Assigned') {
      return { ...asset, status: 'Under Maintenance' }
    }

    return {
      ...asset,
      status: latestTask.status === 'Unserviceable' ? 'Out of Service' : 'Available',
      condition: latestTask.status === 'Unserviceable' ? 'Unserviceable' : 'Good / Working',
    }
  })
}

export function updateStaffEquipment(assetId, updates) {
  if (!initialEquipment.some((asset) => asset.id === assetId)) {
    throw new Error(`Equipment ${assetId} could not be found.`)
  }
  if (!['Available', 'Under Maintenance', 'Out of Service'].includes(updates.status)) {
    throw new Error('Choose a valid equipment status.')
  }
  if (!updates.condition.trim()) {
    throw new Error('Enter an equipment condition.')
  }

  const equipmentOverrides = getEquipmentOverrides()
  equipmentOverrides[assetId] = {
    status: updates.status,
    condition: updates.condition.trim(),
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(staffEquipmentStorageKey, JSON.stringify(equipmentOverrides))
}
