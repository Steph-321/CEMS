import { useState } from 'react'
import StaffLayout from './StaffLayout.jsx'

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function Calendar({ setPath }) {
  const [month, setMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDate, setSelectedDate] = useState(null)
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const leadingDays = new Date(month.getFullYear(), month.getMonth(), 1).getDay()
  const cells = [...Array(leadingDays).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  const changeMonth = (amount) => {
    setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1))
    setSelectedDate(null)
  }

  return (
    <StaffLayout setPath={setPath} activePath="calendar">
      <div className="staff-view-heading"><h1>Calendar</h1><span>Schedule</span></div>
      <section className="staff-calendar-card">
        <div className="staff-calendar-head">
          <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}>‹</button>
          <strong>{monthNames[month.getMonth()]} {month.getFullYear()}</strong>
          <button type="button" aria-label="Next month" onClick={() => changeMonth(1)}>›</button>
        </div>
        <div className="staff-calendar-week">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
        <div className="staff-calendar-grid">
          {cells.map((day, index) => (
            <button
              type="button"
              key={`${month.getFullYear()}-${month.getMonth()}-${index}`}
              className={day && selectedDate === day ? 'today' : ''}
              disabled={!day}
              onClick={() => setSelectedDate(day)}
              aria-pressed={Boolean(day && selectedDate === day)}
            >
              {day}
            </button>
          ))}
        </div>
      </section>
      <section className="staff-empty-card compact">
        <strong>{selectedDate ? `No events on ${monthNames[month.getMonth()]} ${selectedDate}` : 'No scheduled events'}</strong>
        <p>{selectedDate ? 'There are no equipment events for this date.' : 'Your equipment schedule is empty.'}</p>
      </section>
    </StaffLayout>
  )
}

export default Calendar
