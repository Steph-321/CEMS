import { useMemo, useState } from 'react'
import AdminLayout from './adminLayout.jsx'
import { initialSchedules, labs } from './adminData.jsx'

const viewNames = ['Month', 'Week', 'Agenda']
const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function Schedule({ setPath }) {
  const [schedules, setSchedules] = useState(initialSchedules)
  const [view, setView] = useState('Month')
  const [month, setMonth] = useState(new Date(2026, 9, 1))
  const [selectedId, setSelectedId] = useState(null)
  const [mode, setMode] = useState('calendar')
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [draft, setDraft] = useState(null)
  const selected = schedules.find((item) => item.id === selectedId)
  const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const cells = useMemo(() => {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1)
    const offset = (firstDay.getDay() + 6) % 7
    const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    const previousCount = new Date(month.getFullYear(), month.getMonth(), 0).getDate()
    const cellCount = Math.ceil((offset + count) / 7) * 7
    return Array.from({ length: cellCount }, (_, index) => {
      const day = index - offset + 1
      return day < 1 ? { day: previousCount + day, outside: true, date: '' } : day > count ? { day: day - count, outside: true, date: '' } : { day, outside: false, date: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` }
    })
  }, [month])

  const navigateMonth = (amount) => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1))
  const startCreate = () => {
    setSelectedId(null)
    setDraft({ title: '', equipment: '', type: 'Equipment session', date: '2026-10-24', start: '09:00', end: '10:00', location: labs[0], coordinator: '', status: 'Scheduled', description: '' })
    setMode('form')
  }
  const startEdit = () => {
    setDraft({ ...selected })
    setMode('form')
  }
  const saveSchedule = (event) => {
    event.preventDefault()
    if (selectedId) setSchedules((current) => current.map((item) => item.id === selectedId ? draft : item))
    else {
      const item = { ...draft, id: `SCH-${String(schedules.length + 1).padStart(3, '0')}` }
      setSchedules((current) => [...current, item])
      setSelectedId(item.id)
    }
    setMode(selectedId ? 'detail' : 'calendar')
  }

  const open = (item) => { setSelectedId(item.id); setMode('detail') }
  const cancel = () => {
    if (!selected) return
    setSchedules((current) => current.map((item) => item.id === selected.id ? { ...item, status: 'Cancelled' } : item))
    setConfirmCancel(false)
    setMode('detail')
  }
  const eventsFor = (date) => schedules.filter((item) => item.date === date)

  return (
    <AdminLayout setPath={setPath} active="schedule" title={mode === 'calendar' ? 'Equipment Calendar' : mode === 'detail' ? `Schedule Details${selected?.status === 'Cancelled' ? ' — Cancelled' : ''}` : mode === 'form' ? `${selectedId ? 'Edit' : 'Create'} Schedule` : 'Cancel Schedule'}>
      {mode === 'calendar' && (
        <section className="admin-panel calendar-panel">
          <div className="calendar-toolbar"><h2>{monthLabel}</h2><div className="calendar-controls"><button onClick={() => navigateMonth(-1)}>‹</button><button onClick={() => navigateMonth(1)}>›</button><button onClick={() => setMonth(new Date(2026, 9, 1))}>Today</button><div className="status-tabs">{viewNames.map((name) => <button key={name} className={view === name ? 'active' : ''} onClick={() => setView(name)}>{name}</button>)}</div><button className="primary-action" onClick={startCreate}>＋ Create Schedule</button></div></div>
          <div className="calendar-legend"><span>Session</span><span>Appointment</span><span>Room</span><span>Maintenance</span></div>
          {view === 'Month' && <div className="calendar-grid">{weekdays.map((day) => <div className="calendar-day-name" key={day}>{day}</div>)}{cells.map((cell, index) => <div className={`calendar-day ${cell.outside ? 'muted' : ''}`} key={index}><span>{cell.day}</span>{!cell.outside && eventsFor(cell.date).map((event) => <button key={event.id} className={`calendar-event ${event.status === 'Confirmed' ? 'blue' : event.status === 'Approved' ? 'green' : ''}`} onClick={() => open(event)}>{event.title}</button>)}</div>)}</div>}
          {view === 'Week' && <div className="week-grid"><div></div>{weekdays.slice(0, 5).map((day) => <div key={day}><strong>{day}</strong><br />{day === 'Mon' ? '19' : day === 'Tue' ? '20' : day === 'Wed' ? '21' : day === 'Thu' ? '22' : '23'} Oct</div>)}{['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM'].map((time, index) => <><div key={`${time}-label`}>{time}</div>{weekdays.slice(0, 5).map((day, dayIndex) => <div key={`${time}-${day}`}>{index === 0 && dayIndex === 1 ? <button className="calendar-event" onClick={() => open(schedules[0])}>Computer Lab Maintenance</button> : index === 4 && dayIndex === 1 ? <button className="calendar-event blue" onClick={() => open(schedules[1])}>Projector Session</button> : null}</div>)}</>)}</div>}
          {view === 'Agenda' && <div className="agenda-list">{schedules.slice().sort((a, b) => a.date.localeCompare(b.date)).map((item) => <button className="agenda-event" key={item.id} onClick={() => open(item)}><span>{new Date(`${item.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</span><div><strong>{item.title}</strong><small>{item.equipment} · {item.location}</small></div><b className="status-badge maintenance">{item.status}</b><span>{item.start}–{item.end}</span><span>View Details →</span></button>)}</div>}
        </section>
      )}

      {mode === 'form' && draft && (
        <section className="admin-panel"><div className="page-toolbar"><div><h2>{selectedId ? 'Edit Schedule' : 'Create Schedule'}</h2><p>Equipment Calendar / {draft.title || 'Schedule information'}</p></div><button className="secondary-action" onClick={() => setMode(selectedId ? 'detail' : 'calendar')}>← Back</button></div><form className="admin-form" onSubmit={saveSchedule}><div className="admin-form-grid">
          <label>Title *<input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} required /></label><label>Schedule type *<select value={draft.type} onChange={(event) => setDraft({ ...draft, type: event.target.value })}><option>Equipment session</option><option>Maintenance</option><option>Inspection</option><option>Appointment</option></select></label>
          <label>Equipment *<select value={draft.equipment} onChange={(event) => setDraft({ ...draft, equipment: event.target.value })} required><option value="">Select equipment</option><option>Epson projector · PRJ-014</option><option>Dell Latitude · LAP-001</option><option>Desktop Computer · PC-021</option></select></label><label>Date *<input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} required /></label>
          <label>Start time *<input type="time" value={draft.start} onChange={(event) => setDraft({ ...draft, start: event.target.value })} required /></label><label>End time *<input type="time" value={draft.end} onChange={(event) => setDraft({ ...draft, end: event.target.value })} required /></label>
          <label>Location *<select value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })}>{labs.map((lab) => <option key={lab}>{lab}</option>)}</select></label><label>Coordinator / assigned technician *<input value={draft.coordinator} onChange={(event) => setDraft({ ...draft, coordinator: event.target.value })} required /></label>
          <label className="form-span-2">Description (optional)<textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></label>
        </div><div className="form-actions"><button type="button" className="secondary-action" onClick={() => setMode(selectedId ? 'detail' : 'calendar')}>Cancel</button><button className="primary-action">Save Schedule</button></div></form></section>
      )}

      {mode === 'detail' && selected && (
        <>
          <button className="detail-back" onClick={() => setMode('calendar')}>← Back to Calendar</button>
          <div className="two-column-layout">
            <section className="admin-panel">
              <div className="form-section-title">{selected.title}<span className={`status-badge ${selected.status === 'Cancelled' ? 'inspection' : 'available'}`}>{selected.status}</span></div>
              <div className="detail-pairs"><div><span>Equipment</span><strong>{selected.equipment}</strong></div><div><span>Schedule type</span><strong>{selected.type}</strong></div><div><span>Date</span><strong>{new Date(`${selected.date}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' })}</strong></div><div><span>Time</span><strong>{selected.start}–{selected.end}</strong></div><div><span>Location</span><strong>{selected.location}</strong></div><div><span>Coordinator</span><strong>{selected.status === 'Cancelled' ? 'Verification needed' : selected.coordinator}</strong></div><div className="form-span-2"><span>Description</span><strong>{selected.description || 'Not supplied.'}</strong></div></div>
              {selected.status === 'Cancelled' ? <div className="info-callout">Reservation released. The session remains in history; the asset and maintenance history are unchanged.</div> : <div className="info-callout">Session record. No equipment checkout or return is recorded by this schedule entry.</div>}
              <div className="action-row"><button className="primary-action" onClick={startEdit}>Edit Schedule</button>{selected.status !== 'Cancelled' && <button className="secondary-action" onClick={() => setConfirmCancel(true)}>Cancel Schedule</button>}</div>
            </section>
            {selected.status === 'Cancelled' && <section className="admin-panel"><div className="form-section-title">Coordinator verification</div><div className="info-callout"><strong>Conflicting source values</strong>Schedule Details: Maria Santos<br />Create or Edit Schedule: Joana Arranguez</div><p className="form-note">Verify the coordinator against the reservation source. No name has been silently chosen for this cancelled result.</p><p className="form-note">Cancellation date / reason: Not recorded.</p></section>}
            {selected.status !== 'Cancelled' && <section className="admin-panel"><div className="form-section-title">Schedule status</div><p className="form-note">Check the event details and coordinator with the reservation source.</p></section>}
          </div>
        </>
      )}

      {confirmCancel && selected && <div className="modal-scrim" role="presentation" onMouseDown={() => setConfirmCancel(false)}><section className="admin-dialog" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}><div className="dialog-heading"><div><h2>Cancel this schedule?</h2><p>{selected.title} · {selected.id}</p></div><button className="dialog-close" onClick={() => setConfirmCancel(false)}>×</button></div><div className="info-callout">Only this reservation will be marked Cancelled. Asset condition and maintenance history will remain unchanged.</div><label className="admin-form">Cancellation date / reason<input placeholder="Not recorded" /></label><div className="form-actions"><button className="secondary-action" onClick={() => setConfirmCancel(false)}>Keep Schedule</button><button className="primary-action" onClick={cancel}>Confirm Cancellation</button></div></section></div>}
    </AdminLayout>
  )
}

export default Schedule
