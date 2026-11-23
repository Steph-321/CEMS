export const initialEquipment = [
  { id: 'AST-001', name: 'Dell Latitude Laptop', category: 'Computer Equipment', location: 'BSIT Department / Faculty', condition: 'Good / Working', status: 'Available', date: 'Sep 08, 2026 08:42 AM', cost: 45000, warranty: 'Not recorded', model: 'Latitude 5440', serial: 'DL-5440-001' },
  { id: 'AST-002', name: 'PC', category: 'Computer Equipment', location: 'Computer Laboratory 1', condition: 'Good / Working', status: 'Available', date: 'Sep 08, 2026 08:30 AM', cost: 52000, warranty: 'Not recorded', model: 'OptiPlex 7010', serial: 'DELL-7010-02' },
  { id: 'AST-003', name: 'Epson Projector', category: 'Presentation Equipment', location: 'Computer Laboratory 1', condition: 'Good / Working', status: 'Available', date: 'Sep 07, 2026 02:15 PM', cost: 38000, warranty: 'Oct 20, 2026', model: 'EB-X06', serial: 'EP-X06-143' },
  { id: 'AST-004', name: 'Network Router', category: 'Networking Equipment', location: 'Computer Laboratory 2', condition: 'Good / Working', status: 'Available', date: 'Sep 06, 2026 10:00 AM', cost: 12500, warranty: 'Not recorded', model: 'Archer AX55', serial: 'TP-AX55-04' },
  { id: 'AST-005', name: 'Network Switch', category: 'Networking Equipment', location: 'Computer Laboratory 2', condition: 'Good / Working', status: 'Available', date: 'Sep 06, 2026 09:45 AM', cost: 19000, warranty: 'Not recorded', model: 'Cisco CBS250', serial: 'CS-CBS-05' },
  { id: 'AST-006', name: 'Canon EOS R5', category: 'Not categorized', location: 'Media Room', condition: 'Good / Working', status: 'Available', date: 'Sep 05, 2026 01:22 PM', cost: 165000, warranty: 'Not recorded', model: 'EOS R5', serial: 'CN-R5-006' },
  { id: 'AST-007', name: 'Computer Monitor', category: 'Computer Equipment', location: 'Computer Laboratory 1', condition: 'Good / Working', status: 'Available', date: 'Sep 04, 2026 11:10 AM', cost: 10500, warranty: 'Not recorded', model: 'P2422H', serial: 'DL-P24-007' },
  { id: 'AST-008', name: 'Ethernet Cable Tester', category: 'Networking Equipment', location: 'BSIT Department / Faculty', condition: 'Good / Working', status: 'Available', date: 'Sep 03, 2026 03:15 PM', cost: 3200, warranty: 'Not recorded', model: 'CableIQ', serial: 'FL-CQ-008' },
  { id: 'AST-009', name: 'Keyboard and Mouse', category: 'Computer Accessories', location: 'Computer Laboratory 3', condition: 'Good / Working', status: 'Under Maintenance', date: 'Sep 02, 2026 09:02 AM', cost: 1800, warranty: 'Not recorded', model: 'MK120', serial: 'LG-MK-009' },
  { id: 'AST-010', name: 'Flash Drive', category: 'Storage Device', location: 'BSIT Department / Faculty', condition: 'Good / Working', status: 'Available', date: 'Aug 30, 2026 08:30 AM', cost: 650, warranty: 'Not recorded', model: 'DataTraveler', serial: 'KT-010' },
]

export const initialUsers = [
  { id: '001', name: 'Stephanie Ong', username: '@Stephanie', email: 'ongsteph@ctu.edu.ph', role: 'Administrator', status: 'Deactivated', lastLogin: 'Aug 12, 2025 09:42 AM' },
  { id: '002', name: 'Daniel Dino Marzon', username: '@Dino Daniel', email: 'marzondino@ctu.edu.ph', role: 'Staff', status: 'Active', lastLogin: 'Aug 11, 2025 10:20 PM' },
  { id: '003', name: 'Sear Cleve Dalubatan', username: '@Sear Cleve', email: 'dalubatans@ctu.edu.ph', role: 'Staff', status: 'Active', lastLogin: 'Aug 10, 2025 11:15 AM' },
  { id: '004', name: 'Joana Arranguez', username: '@Joana', email: 'arranguezjo@ctu.edu.ph', role: 'Staff', status: 'Active', lastLogin: 'Aug 9, 2025 02:30 PM' },
  { id: '005', name: 'Wailhi', username: '@Wailhi', email: 'wailhi1@ctu.edu.ph', role: 'Staff', status: 'Active', lastLogin: 'Aug 8, 2025 10:12 AM' },
]

export const initialTickets = [
  { id: 'TASK-001', assetId: 'AST-001', asset: 'Dell Latitude', issue: 'Hardware Failure', severity: 'Medium', status: 'Assigned', reporter: 'Not supplied in staff report', technician: 'Sear Cleve Dalubatan', description: 'Staff report details were not supplied.', date: 'Oct 20, 2026' },
  { id: 'TASK-002', assetId: 'AC-301', asset: 'Air Conditioner Unit (Room 301)', issue: 'Hardware Failure', severity: 'Critical', status: 'Unassigned', reporter: 'Engr. Santos', technician: 'Unassigned', description: 'Compressor noise and insufficient cooling.', date: 'Oct 21, 2026' },
  { id: 'TASK-003', assetId: 'AST-009', asset: 'Keyboard and Mouse', issue: 'Peripheral failure', severity: 'Low', status: 'Completed', reporter: 'Lab staff', technician: 'Daniel Marzon', description: 'Keyboard was replaced and verified.', date: 'Oct 18, 2026' },
]

export const initialSchedules = [
  { id: 'SCH-001', title: 'Computer Laboratory Maintenance', equipment: 'Dell Latitude · LAP-001', type: 'Maintenance', date: '2026-10-20', start: '09:00', end: '11:00', location: 'Computer Laboratory 1', coordinator: 'Maria Santos', status: 'Scheduled', description: 'Routine computer laboratory maintenance.' },
  { id: 'PRJ-014', title: 'Projector Session', equipment: 'Epson projector · PRJ-014', type: 'Equipment session', date: '2026-10-20', start: '13:00', end: '15:00', location: 'Computer Laboratory 1', coordinator: 'Maria Santos', status: 'Cancelled', description: 'Projector for the afternoon laboratory lecture.' },
  { id: 'SCH-003', title: 'Laboratory Equipment Session', equipment: 'Dell workstation · PC-021', type: 'Appointment', date: '2026-10-21', start: '10:00', end: '12:00', location: 'Computer Laboratory 2', coordinator: 'Joana Arranguez', status: 'Confirmed', description: 'Scheduled laboratory session.' },
  { id: 'SCH-004', title: 'Computer Inspection', equipment: 'Desktop Computer', type: 'Inspection', date: '2026-10-22', start: '14:00', end: '16:00', location: 'Computer Laboratory 3', coordinator: 'Daniel Marzon', status: 'Approved', description: 'Quarterly equipment inspection.' },
  { id: 'SCH-005', title: 'Network Switch Inspection', equipment: 'Cisco network switch · NSW-008', type: 'Maintenance', date: '2026-10-23', start: '10:00', end: '11:30', location: 'Computer Laboratory 2', coordinator: 'Sear Cleve Dalubatan', status: 'Approved', description: 'Network switch inspection.' },
]

export const initialNotifications = [
  { id: 'N-001', title: 'NEW MAINTENANCE TICKET SUBMITTED', message: 'Air Conditioner Unit (Room 301) was flagged for repairs.', category: 'Hardware Failure', severity: 'Critical', reporter: 'Engr. Santos', time: '1 hour ago', read: false, kind: 'maintenance' },
  { id: 'N-002', title: 'WARRANTY EXPIRATION WARNING', message: '10x Dell OptiPlex Laptops warranties will expire in 14 days (Sept 23, 2026).', category: 'Warranty', severity: 'Warning', reporter: 'System', time: '1 day ago', read: true, kind: 'warranty' },
  { id: 'N-003', title: 'QUARTERLY INVENTORY AUDIT COMPLETED', message: 'All lab assets reconciled. 100% accountability score archived for Academic Year 2026 Q1.', category: 'Audit', severity: 'Info', reporter: 'System', time: '3 days ago', read: true, kind: 'audit' },
]

export const labs = ['Computer Laboratory 1', 'Computer Laboratory 2', 'Computer Laboratory 3', 'BSIT Department / Faculty']
