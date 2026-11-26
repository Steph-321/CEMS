import { useState } from 'react'
import StaffLayout, { StaffIcon } from './StaffLayout.jsx'

function Inventory({ setPath }) {
  const [search, setSearch] = useState('')

  return (
    <StaffLayout setPath={setPath} activePath="inventory">
      <div className="staff-view-heading"><h1>Inventory</h1><span>0 items</span></div>
      <label className="staff-search">
        <span aria-hidden="true">⌕</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search equipment" />
      </label>
      <section className="staff-empty-card">
        <span className="staff-empty-icon"><StaffIcon name="inventory" /></span>
        <strong>{search ? 'No matching equipment' : 'No equipment recorded'}</strong>
        <p>{search ? 'Try another search term.' : 'Registered equipment will appear here.'}</p>
      </section>
    </StaffLayout>
  )
}

export default Inventory
