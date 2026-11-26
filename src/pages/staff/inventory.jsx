import { useState } from 'react'
import StaffLayout, { StaffIcon } from './StaffLayout.jsx'

function Inventory({ setPath }) {
  const [search, setSearch] = useState('')

  return (
    <StaffLayout setPath={setPath} activePath="inventory">
      <div className="staff-view-heading">
        <div><span className="staff-eyebrow">CAMPUS ASSETS</span><h1>Inventory</h1><p>Search and explore registered equipment.</p></div>
        <span className="staff-item-count">0 items</span>
      </div>
      <label className="staff-search">
        <span className="staff-search-icon" aria-hidden="true">⌕</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by name or asset tag" />
      </label>
      <section className="staff-empty-card staff-inventory-empty">
        <span className="staff-empty-icon"><StaffIcon name="inventory" /></span>
        <span className="staff-eyebrow">INVENTORY</span>
        <strong>{search ? 'No matching equipment' : 'Your inventory is clear'}</strong>
        <p>{search ? 'Try a different name or asset tag.' : 'Registered equipment will appear here when it is added.'}</p>
      </section>
    </StaffLayout>
  )
}

export default Inventory
