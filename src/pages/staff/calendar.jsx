import { useMemo, useState } from 'react'
import { initialEquipment, initialSchedules, labs } from '../admin/adminData.jsx'
import StaffLayout, { StaffIcon } from './StaffLayout.jsx'

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const calendarViews = ['Month', 'Week', 'Agenda']
const firstScheduleDate = initialSchedules.map((schedule) => schedule.date).sort()[0]

function dateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseDate(value) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatDate(value, options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) {
  return parseDate(value).toLocaleDateString('en-US', options)
}

function formatTime(value) {
  const [hours, minutes] = value.split(':').map(Number)
  const suffix = hours >= 12 ? 'PM' : 'AM'
  return `${hours % 12 || 12}:${String(minutes).padStart(2, '0')} ${suffix}`
}

function eventClass(schedule) {
  if (schedule.status === 'Cancelled') return 'cancelled'
  if (schedule.type.toLowerCase().includes('maint')) return 'maintenance'
  if (schedule.type.toLowerCase().includes('appoint')) return 'appointment'
  return 'session'
}

function Calendar({ setPath }) {
  const [schedules, setSchedules] = useState(() => initialSchedules.map((schedule) => ({ ...schedule })))
  const [view, setView] = useState('Month')
  const [month, setMonth] = useState(() => {
    const seedDate = firstScheduleDate ? parseDate(firstScheduleDate) : new Date()
    return new Date(seedDate.getFullYear(), seedDate.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState(firstScheduleDate || dateKey(new Date()))
  const [mode, setMode] = useState('calendar')
  const [draft, setDraft] = useState(null)
  const [formError, setFormError] = useState('')
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const [savedSchedule, setSavedSchedule] = useState(null)
  const [selectedScheduleId, setSelectedScheduleId] = useState(null)

  const selectedSchedule = schedules.find((schedule) => schedule.id === selectedScheduleId)
  const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const monthCells = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1)
    const offset = (first.getDay() + 6) % 7
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    const cellCount = Math.ceil((offset + daysInMonth) / 7) * 7
    return Array.from({ length: cellCount }, (_, index) => new Date(month.getFullYear(), month.getMonth(), index - offset + 1))
  }, [month])

  const eventsByDate = useMemo(() => schedules.reduce((result, schedule) => {
    if (!result[schedule.date]) result[schedule.date] = []
    result[schedule.date].push(schedule)
    return result
  }, {}), [schedules])

  const selectedEvents = eventsByDate[selectedDate] || []
  const monthEvents = schedules
    .filter((schedule) => {
      const eventDate = parseDate(schedule.date)
      return eventDate.getFullYear() === month.getFullYear() && eventDate.getMonth() === month.getMonth()
    })
    .sort((first, second) => first.date.localeCompare(second.date) || first.start.localeCompare(second.start))

  const agendaGroups = monthEvents.reduce((result, schedule) => {
    if (!result[schedule.date]) result[schedule.date] = []
    result[schedule.date].push(schedule)
    return result
  }, {})

  const weekDays = useMemo(() => {
    const anchor = parseDate(selectedDate)
    const monday = new Date(anchor)
    monday.setDate(anchor.getDate() - ((anchor.getDay() + 6) % 7))
    return Array.from({ length: 5 }, (_, index) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index))
  }, [selectedDate])

  const navigateMonth = (amount) => {
    const nextMonth = new Date(month.getFullYear(), month.getMonth() + amount, 1)
    const currentDay = parseDate(selectedDate).getDate()
    const nextDay = Math.min(currentDay, new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate())
    setMonth(nextMonth)
    setSelectedDate(dateKey(new Date(nextMonth.getFullYear(), nextMonth.getMonth(), nextDay)))
  }

  const goToToday = () => {
    const today = new Date()
    setMonth(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDate(dateKey(today))
  }

  const selectDate = (date) => {
    setSelectedDate(dateKey(date))
    if (date.getMonth() !== month.getMonth() || date.getFullYear() !== month.getFullYear()) {
      setMonth(new Date(date.getFullYear(), date.getMonth(), 1))
    }
  }

  const startCreate = () => {
    setDraft({
      title: '',
      equipment: '',
      type: 'Inspection appointment',
      date: selectedDate || dateKey(new Date()),
      start: '09:00',
      end: '10:00',
      location: labs[0],
      coordinator: '',
      status: 'Scheduled',
      description: '',
    })
    setFormError('')
    setMode('form')
  }

  const updateDraft = (field, value) => {
    setDraft((current) => ({ ...current, [field]: value }))
    setFormError('')
  }

  const saveSchedule = (event) => {
    event.preventDefault()
    if (draft.end <= draft.start) {
      setFormError('End time must be later than start time.')
      return
    }

    const nextId = schedules.reduce((highest, schedule) => {
      const match = /^SCH-(\d+)$/.exec(schedule.id)
      return match ? Math.max(highest, Number(match[1])) : highest
    }, 0) + 1
    const saved = { ...draft, id: `SCH-${String(nextId).padStart(3, '0')}` }
    setSchedules((current) => [...current, saved])
    setSelectedDate(saved.date)
    const savedDate = parseDate(saved.date)
    setMonth(new Date(savedDate.getFullYear(), savedDate.getMonth(), 1))
    setSavedSchedule(saved)
    setDraft(null)
    setMode('calendar')
  }

  const discardDraft = () => {
    setConfirmDiscard(false)
    setDraft(null)
    setFormError('')
    setMode('calendar')
  }

  const openSchedule = (schedule) => {
    setSelectedScheduleId(schedule.id)
    setMode('detail')
  }

  return (
    <StaffLayout setPath={setPath} activePath="calendar">
      {mode === 'calendar' && (
        <div className="staff-schedule-page">
          <div className="staff-view-heading">
            <div><span className="staff-eyebrow">PLAN AHEAD</span><h1>Calendar</h1><p>Keep an eye on equipment events.</p></div>
            <button type="button" className="staff-schedule-create-button" onClick={startCreate}>
              <span aria-hidden="true">+</span> New schedule
            </button>
          </div>

          <section className="staff-schedule-calendar">
            <div className="staff-schedule-calendar-toolbar">
              <div className="staff-schedule-month-controls">
                <button type="button" aria-label="Previous month" onClick={() => navigateMonth(-1)}>‹</button>
                <h2>{monthLabel}</h2>
                <button type="button" aria-label="Next month" onClick={() => navigateMonth(1)}>›</button>
              </div>
              <div className="staff-schedule-view-controls">
                <div className="staff-schedule-view-switch" role="group" aria-label="Calendar view">
                  {calendarViews.map((calendarView) => (
                    <button
                      type="button"
                      key={calendarView}
                      className={view === calendarView ? 'active' : ''}
                      aria-pressed={view === calendarView}
                      onClick={() => setView(calendarView)}
                    >
                      {calendarView}
                    </button>
                  ))}
                </div>
                <button type="button" className="staff-schedule-today" onClick={goToToday}>Today</button>
              </div>
            </div>

            {view === 'Month' && (
              <div className="staff-schedule-month-grid" key={monthLabel} aria-label={`${monthLabel} calendar`}>
                {weekdays.map((weekday) => <span className="staff-schedule-weekday" key={weekday}>{weekday}</span>)}
                {monthCells.map((date) => {
                  const key = dateKey(date)
                  const dayEvents = eventsByDate[key] || []
                  const isCurrentMonth = date.getMonth() === month.getMonth()
                  const today = new Date()
                  const isToday = dateKey(today) === key
                  const dayClasses = [
                    'staff-schedule-day',
                    !isCurrentMonth && 'outside',
                    selectedDate === key && 'selected',
                    isToday && 'today',
                  ].filter(Boolean).join(' ')

                  return (
                    <button
                      type="button"
                      key={key}
                      className={dayClasses}
                      aria-label={`${formatDate(key)}${dayEvents.length ? `, ${dayEvents.length} scheduled ${dayEvents.length === 1 ? 'event' : 'events'}` : ''}`}
                      aria-pressed={selectedDate === key}
                      aria-current={isToday ? 'date' : undefined}
                      onClick={() => selectDate(date)}
                    >
                      <span className="staff-schedule-day-number">{date.getDate()}</span>
                      <span className="staff-schedule-day-events">
                        {dayEvents.slice(0, 2).map((schedule) => (
                          <span className={`staff-schedule-day-event ${eventClass(schedule)}`} key={schedule.id}>
                            {schedule.title}
                          </span>
                        ))}
                        {dayEvents.length > 2 && <span className="staff-schedule-day-more">+{dayEvents.length - 2} more</span>}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}

            {view === 'Week' && (
              <div className="staff-schedule-week-grid" key={dateKey(weekDays[0])}>
                {weekDays.map((date) => {
                  const key = dateKey(date)
                  const dayEvents = eventsByDate[key] || []
                  return (
                    <section className="staff-schedule-week-day" key={key}>
                      <button type="button" className={selectedDate === key ? 'active' : ''} onClick={() => selectDate(date)}>
                        <span>{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        <strong>{date.getDate()}</strong>
                      </button>
                      <div className="staff-schedule-week-events">
                        {dayEvents.length ? dayEvents.map((schedule) => (
                          <button
                            type="button"
                            className={`staff-schedule-week-event ${eventClass(schedule)}`}
                            key={schedule.id}
                            onClick={() => openSchedule(schedule)}
                          >
                            <strong>{schedule.title}</strong>
                            <span>{formatTime(schedule.start)}</span>
                          </button>
                        )) : <span className="staff-schedule-week-empty">No events</span>}
                      </div>
                    </section>
                  )
                })}
              </div>
            )}

            {view === 'Agenda' && (
              <div className="staff-schedule-agenda-list">
                {Object.entries(agendaGroups).length ? Object.entries(agendaGroups).map(([date, daySchedules]) => (
                  <section className="staff-schedule-agenda-day" key={date}>
                    <button type="button" className="staff-schedule-agenda-date" onClick={() => selectDate(parseDate(date))}>
                      <span>{formatDate(date, { weekday: 'long' })}</span>
                      <strong>{formatDate(date, { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
                    </button>
                    {daySchedules.map((schedule) => (
                      <ScheduleCard key={schedule.id} schedule={schedule} onClick={() => openSchedule(schedule)} />
                    ))}
                  </section>
                )) : <EmptyScheduleMessage message="No schedules this month." />}
              </div>
            )}
          </section>

          {view !== 'Agenda' && (
            <section className="staff-schedule-selected-agenda" aria-live="polite">
              <div className="staff-schedule-agenda-heading">
                <div><span>DAILY AGENDA</span><h2>{formatDate(selectedDate)}</h2></div>
                <span className="staff-schedule-event-count">{selectedEvents.length} {selectedEvents.length === 1 ? 'event' : 'events'}</span>
              </div>
              {selectedEvents.length ? selectedEvents.map((schedule) => (
                <ScheduleCard key={schedule.id} schedule={schedule} onClick={() => openSchedule(schedule)} />
              )) : <EmptyScheduleMessage message="No schedules for this date." />}
            </section>
          )}
        </div>
      )}

      {mode === 'form' && draft && (
        <div className="staff-schedule-form-page">
          <button type="button" className="staff-schedule-back" onClick={() => setConfirmDiscard(true)}>‹ <span>Calendar</span></button>
          <div className="staff-schedule-form-heading"><span>DRAFT</span><h1>Create Schedule</h1><p>Plan an equipment session, inspection, or maintenance appointment.</p></div>
          <form className="staff-schedule-form" onSubmit={saveSchedule}>
            <label>Title *<input value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} placeholder="e.g. Projector inspection" required /></label>
            <label>Schedule type
              <select value={draft.type} onChange={(event) => updateDraft('type', event.target.value)}>
                <option>Inspection appointment</option>
                <option>Equipment session</option>
                <option>Maintenance</option>
                <option>Inspection</option>
                <option>Appointment</option>
              </select>
            </label>
            <label>Equipment *
              <select value={draft.equipment} onChange={(event) => updateDraft('equipment', event.target.value)} required>
                <option value="">Select equipment</option>
                {initialEquipment.map((asset) => <option key={asset.id} value={`${asset.name} · ${asset.id}`}>{asset.name} · {asset.id}</option>)}
              </select>
            </label>
            <label>Date *<input type="date" value={draft.date} onChange={(event) => updateDraft('date', event.target.value)} required /></label>
            <div className="staff-schedule-time-fields">
              <label>Start time *<input type="time" value={draft.start} onChange={(event) => updateDraft('start', event.target.value)} required /></label>
              <label>End time *<input type="time" value={draft.end} onChange={(event) => updateDraft('end', event.target.value)} required /></label>
            </div>
            <label>Location *
              <select value={draft.location} onChange={(event) => updateDraft('location', event.target.value)}>
                {labs.map((lab) => <option key={lab} value={lab}>{lab}</option>)}
              </select>
            </label>
            <label>Participant / coordinator *<input value={draft.coordinator} onChange={(event) => updateDraft('coordinator', event.target.value)} placeholder="Name" required /></label>
            <label className="staff-schedule-description">Description (optional)<textarea value={draft.description} onChange={(event) => updateDraft('description', event.target.value)} placeholder="Add a note about this schedule" rows="3" /></label>
            {formError && <p className="staff-schedule-form-error" role="alert">{formError}</p>}
            <div className="staff-schedule-form-actions">
              <button type="button" className="staff-schedule-cancel-button" onClick={() => setConfirmDiscard(true)}>Cancel</button>
              <button type="submit" className="staff-schedule-submit-button">Create Schedule</button>
            </div>
          </form>
        </div>
      )}

      {mode === 'detail' && selectedSchedule && (
        <div className="staff-schedule-detail-page">
          <button type="button" className="staff-schedule-back" onClick={() => setMode('calendar')}>‹ <span>Calendar</span></button>
          <div className={`staff-schedule-detail-banner ${eventClass(selectedSchedule)}`}>
            <span>Schedule details</span>
            <strong>{selectedSchedule.status}</strong>
          </div>
          <article className="staff-schedule-detail-card">
            <span className="staff-schedule-detail-type">{selectedSchedule.type}</span>
            <h1>{selectedSchedule.title}</h1>
            <p>{selectedSchedule.equipment}</p>
            <dl>
              <div><dt>Date</dt><dd>{formatDate(selectedSchedule.date)}</dd></div>
              <div><dt>Time</dt><dd>{formatTime(selectedSchedule.start)}–{formatTime(selectedSchedule.end)}</dd></div>
              <div><dt>Location</dt><dd>{selectedSchedule.location}</dd></div>
              <div><dt>Participant / coordinator</dt><dd>{selectedSchedule.coordinator || 'Not specified'}</dd></div>
            </dl>
          </article>
          <article className="staff-schedule-detail-description">
            <h2>Description</h2>
            <p>{selectedSchedule.description || 'No description provided.'}</p>
          </article>
          <button type="button" className="staff-schedule-submit-button staff-schedule-return" onClick={() => setMode('calendar')}>Return to calendar</button>
        </div>
      )}

      {confirmDiscard && (
        <div className="staff-schedule-modal-scrim" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setConfirmDiscard(false)}>
          <section className="staff-schedule-modal" role="dialog" aria-modal="true" aria-labelledby="discard-title">
            <span className="staff-schedule-modal-icon">!</span>
            <h2 id="discard-title">Discard this schedule draft?</h2>
            <p>Your unsaved changes will be lost. No schedule will be created.</p>
            <button type="button" className="staff-schedule-modal-primary" onClick={discardDraft}>Discard</button>
            <button type="button" className="staff-schedule-modal-secondary" onClick={() => setConfirmDiscard(false)}>Keep editing</button>
          </section>
        </div>
      )}

      {savedSchedule && (
        <div className="staff-schedule-modal-scrim" role="presentation">
          <section className="staff-schedule-modal staff-schedule-success" role="dialog" aria-modal="true" aria-labelledby="schedule-saved-title">
            <span className="staff-schedule-success-icon">✓</span>
            <h2 id="schedule-saved-title">{savedSchedule.type.toLowerCase().includes('maint') ? 'Scheduled Repair' : 'Schedule Created'}</h2>
            <p>{savedSchedule.title} has been added to your calendar.</p>
            <button type="button" className="staff-schedule-modal-primary" onClick={() => setSavedSchedule(null)}>Back to Calendar</button>
          </section>
        </div>
      )}
    </StaffLayout>
  )
}

function ScheduleCard({ schedule, onClick }) {
  return (
    <button type="button" className={`staff-schedule-event-card ${eventClass(schedule)}`} onClick={onClick}>
      <span className="staff-schedule-event-time">{formatTime(schedule.start)}–{formatTime(schedule.end)}</span>
      <span className="staff-schedule-event-content">
        <strong>{schedule.title}</strong>
        <small>{schedule.equipment} · {schedule.location}</small>
        <span className="staff-schedule-event-tags"><span>{schedule.type}</span><span>{schedule.status}</span></span>
      </span>
      <span className="staff-schedule-event-arrow" aria-hidden="true">›</span>
    </button>
  )
}

function EmptyScheduleMessage({ message }) {
  return (
    <div className="staff-schedule-empty">
      <span className="staff-schedule-empty-icon"><StaffIcon name="calendar" /></span>
      <strong>{message}</strong>
      <span>Use New schedule to add an event.</span>
    </div>
  )
}

export default Calendar
