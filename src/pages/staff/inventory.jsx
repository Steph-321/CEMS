import { useMemo, useState } from 'react'
import StaffLayout, { StaffIcon } from './StaffLayout.jsx'
import EquipmentUpdateButton from './EquipmentUpdateButton.jsx'
import { getStaffEquipment, getStaffTickets } from './staffMaintenance.js'

const statusFilters = [
  { value: 'All', label: 'All equipment' },
  { value: 'Available', label: 'Usable' },
  { value: 'Under Maintenance', label: 'Under maintenance' },
  { value: 'Out of Service', label: 'Out of service' },
]

const locationOrder = [
  'Computer Laboratory 1',
  'Computer Laboratory 2',
  'Computer Laboratory 3',
  'BSIT Department / Faculty',
  'Media Room',
]

const logExportColumns = [
  ['Asset ID', (asset) => asset.id],
  ['Equipment', (asset) => asset.name],
  ['Category', (asset) => asset.category],
  ['Location', (asset) => asset.location],
  ['Condition', (asset) => asset.condition],
  ['Status', (asset) => asset.status],
  ['Recorded date', (asset) => asset.date],
  ['Model', (asset) => asset.model],
  ['Serial number', (asset) => asset.serial],
  ['Cost', (asset) => asset.cost],
  ['Warranty', (asset) => asset.warranty],
]

function categoryLabel(category) {
  const labels = {
    'Computer Equipment': 'Computers',
    'Presentation Equipment': 'Presentation',
    'Networking Equipment': 'Networking',
    'Computer Accessories': 'Accessories',
    'Storage Device': 'Storage',
    'Not categorized': 'Uncategorized',
  }
  return labels[category] || category
}

function statusLabel(status) {
  return status === 'Available' ? 'Usable' : status
}

function compareEquipment(first, second, sortMode) {
  if (sortMode === 'name') {
    return first.name.localeCompare(second.name) || first.id.localeCompare(second.id)
  }
  if (sortMode === 'status') {
    return first.status.localeCompare(second.status)
      || first.name.localeCompare(second.name)
      || first.id.localeCompare(second.id)
  }

  const dateDifference = Date.parse(second.date) - Date.parse(first.date)
  return Number.isNaN(dateDifference) || dateDifference === 0
    ? first.name.localeCompare(second.name) || first.id.localeCompare(second.id)
    : dateDifference
}

function downloadEquipmentLogs() {
  const equipmentList = getStaffEquipment()
  const escapeCsv = (value) => {
    const text = value == null ? '' : String(value)
    const safeText = /^[\s]*[=+@-]/.test(text) ? `'${text}` : text
    return `"${safeText.replaceAll('"', '""')}"`
  }
  const rows = [
    logExportColumns.map(([heading]) => escapeCsv(heading)).join(','),
    ...equipmentList.map((asset) => logExportColumns.map(([, getValue]) => escapeCsv(getValue(asset))).join(',')),
  ]
  const blob = new Blob([`\uFEFF${rows.join('\r\n')}`], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'CEMS_All_Equipment_Logs.csv'
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

function printEquipmentLogs() {
  const equipmentList = getStaffEquipment()
  const printWindow = window.open('', '_blank')
  if (!printWindow) {
    window.alert('Allow pop-ups for this site to open the PDF-ready equipment report.')
    return
  }

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
  const headers = logExportColumns.map(([heading]) => `<th>${escapeHtml(heading)}</th>`).join('')
  const rows = equipmentList.map((asset) => (
    `<tr>${logExportColumns.map(([, getValue]) => `<td>${escapeHtml(getValue(asset))}</td>`).join('')}</tr>`
  )).join('')

  printWindow.document.open()
  printWindow.document.write(`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>CEMS All Equipment Logs</title>
        <style>
          @page { size: A4 landscape; margin: 12mm; }
          body { color: #26364d; font: 10px Arial, sans-serif; }
          h1 { margin: 0 0 5px; font-size: 19px; }
          p { margin: 0 0 15px; color: #64748b; font-size: 10px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #dfe5ec; padding: 6px; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
          th { background: #f1f5f9; color: #26364d; }
          tr { break-inside: avoid; }
          @media screen { body { margin: 24px; } }
        </style>
      </head>
      <body>
        <h1>CEMS All Equipment Logs</h1>
        <p>${equipmentList.length} equipment records · Generated ${escapeHtml(new Date().toLocaleDateString())}</p>
        <table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>
      </body>
    </html>`)
  printWindow.document.close()
  printWindow.document.title = 'CEMS_All_Equipment_Logs'
  printWindow.setTimeout(() => {
    printWindow.focus()
    printWindow.print()
  }, 250)
}

function Inventory({ setPath }) {
  const staffTickets = getStaffTickets()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLocation, setSelectedLocation] = useState('All')
  const [sortMode, setSortMode] = useState('recent')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [expandedLocations, setExpandedLocations] = useState({ 'Computer Laboratory 1': true })
  const [expandedAsset, setExpandedAsset] = useState(null)
  const [equipmentList, setEquipmentList] = useState(getStaffEquipment)

  const availableCount = equipmentList.filter((asset) => asset.status === 'Available').length
  const maintenanceCount = equipmentList.filter((asset) => asset.status === 'Under Maintenance').length
  const outOfServiceCount = equipmentList.filter((asset) => asset.status === 'Out of Service').length
  const categories = [...new Set(equipmentList.map((asset) => asset.category))]
  const locations = [...new Set(equipmentList.map((asset) => asset.location))]

  const filteredEquipment = useMemo(() => {
    const query = search.trim().toLowerCase()
    const matching = equipmentList.filter((asset) => {
      const matchesSearch = !query || [
        asset.name,
        asset.id,
        asset.serial,
        asset.model,
        asset.category,
        asset.location,
      ].some((value) => value?.toLowerCase().includes(query))
      const matchesStatus = statusFilter === 'All' || asset.status === statusFilter
      const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory
      const matchesLocation = selectedLocation === 'All' || asset.location === selectedLocation
      return matchesSearch && matchesStatus && matchesCategory && matchesLocation
    })

    return matching.sort((first, second) => compareEquipment(first, second, sortMode))
  }, [equipmentList, search, statusFilter, selectedCategory, selectedLocation, sortMode])

  const equipmentGroups = useMemo(() => {
    const groups = filteredEquipment.reduce((result, asset) => {
      if (!result[asset.location]) result[asset.location] = []
      result[asset.location].push(asset)
      return result
    }, {})

    return Object.entries(groups).sort(([firstLocation, firstItems], [secondLocation, secondItems]) => {
      const equipmentOrder = compareEquipment(firstItems[0], secondItems[0], sortMode)
      if (equipmentOrder !== 0) return equipmentOrder

      const first = firstLocation
      const second = secondLocation
      const firstOrder = locationOrder.indexOf(first)
      const secondOrder = locationOrder.indexOf(second)
      return (firstOrder < 0 ? locationOrder.length : firstOrder) - (secondOrder < 0 ? locationOrder.length : secondOrder)
        || first.localeCompare(second)
    })
  }, [filteredEquipment, sortMode])

  const hasActiveFilters = Boolean(search.trim())
    || statusFilter !== 'All'
    || selectedCategory !== 'All'
    || selectedLocation !== 'All'
    || sortMode !== 'recent'

  const resetFilters = () => {
    setSearch('')
    setStatusFilter('All')
    setSelectedCategory('All')
    setSelectedLocation('All')
    setSortMode('recent')
  }

  const navigateToScan = () => {
    window.history.pushState({}, '', '/staff/scan')
    setPath('/staff/scan')
  }

  const openItemLog = (assetId) => {
    window.history.pushState({}, '', `/staff/inventory/${assetId}`)
    setPath(`/staff/inventory/${assetId}`)
  }

  const openRepairDetails = (ticketId) => {
    window.history.pushState({}, '', `/staff/repair/${ticketId}`)
    setPath(`/staff/repair/${ticketId}`)
  }

  const toggleLocation = (location, autoExpanded) => {
    setExpandedLocations((current) => ({ ...current, [location]: !(current[location] ?? autoExpanded) }))
  }

  return (
    <StaffLayout setPath={setPath} activePath="inventory">
      <div className="staff-inventory-page">
        <section className="staff-inventory-hero">
          <div className="staff-inventory-hero-content">
            <span className="staff-inventory-hero-icon"><StaffIcon name="computer" /></span>
            <div>
              <h1>Equipment</h1>
              <span>CTU Campus</span>
              <small>Inventory</small>
            </div>
          </div>
          <button type="button" className="staff-inventory-scan" onClick={navigateToScan}>
            <StaffIcon name="scan" />
            <span>Scan equipment</span>
          </button>
        </section>

        <div className="staff-inventory-search-row">
          <label className="staff-search staff-inventory-search">
            <span className="staff-search-icon" aria-hidden="true"><StaffIcon name="search" /></span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, asset ID, serial, lab or room"
              aria-label="Search equipment by name, asset ID, serial, lab or room"
            />
          </label>
          <button
            type="button"
            className={`staff-inventory-filter-button ${filtersOpen ? 'active' : ''}`}
            aria-label="Toggle inventory filters"
            aria-expanded={filtersOpen}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <StaffIcon name="filter" />
          </button>
        </div>

        {filtersOpen && (
          <div className="staff-inventory-filter-panel">
            <label>
              Equipment type
              <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
                <option value="All">All categories</option>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </label>
            <label>
              Location
              <select value={selectedLocation} onChange={(event) => setSelectedLocation(event.target.value)}>
                <option value="All">All locations</option>
                {locations.map((location) => <option key={location} value={location}>{location}</option>)}
              </select>
            </label>
          </div>
        )}

        <div className="staff-inventory-stats" role="group" aria-label="Filter by equipment status">
          {statusFilters.map((filter) => {
            const count = filter.value === 'All'
              ? equipmentList.length
              : filter.value === 'Available'
                ? availableCount
                : filter.value === 'Under Maintenance'
                  ? maintenanceCount
                  : outOfServiceCount

            return (
              <button
                type="button"
                key={filter.value}
                className={`staff-inventory-stat ${statusFilter === filter.value ? 'active' : ''}`}
                aria-pressed={statusFilter === filter.value}
                onClick={() => setStatusFilter(filter.value)}
              >
                <span className={`staff-inventory-stat-mark status-${filter.value.toLowerCase().replaceAll(' ', '-')}`} aria-hidden="true" />
                <strong>{count}</strong>
                <span>{filter.label}</span>
              </button>
            )
          })}
        </div>

        <div className="staff-inventory-toolbar">
          <p>
            Showing <strong>{filteredEquipment.length}</strong>
            {hasActiveFilters && <> of {equipmentList.length}</>} items
          </p>
          <label className="staff-inventory-sort">
            <span>Sort:</span>
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value)} aria-label="Sort equipment">
              <option value="recent">Recently added</option>
              <option value="name">Name A–Z</option>
              <option value="status">Status</option>
            </select>
          </label>
          <button type="button" className="staff-inventory-reset" onClick={resetFilters} disabled={!hasActiveFilters}>
            Reset filters
          </button>
        </div>

        <div className="staff-inventory-export-actions" aria-label="Export all equipment logs">
          <span>{equipmentList.length} equipment records</span>
          <div>
            <button type="button" className="staff-inventory-export-button" onClick={downloadEquipmentLogs}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3" />
              </svg>
              CSV
            </button>
            <button type="button" className="staff-inventory-export-button pdf" onClick={printEquipmentLogs}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 3h7l5 5v13H7zM14 3v5h5M9 14h8M9 17h8" />
              </svg>
              Save as PDF
            </button>
          </div>
        </div>

        {equipmentGroups.length ? (
          <div className="staff-inventory-groups">
            {equipmentGroups.map(([location, items]) => {
              const allAtLocation = equipmentList.filter((asset) => asset.location === location)
              const categoryCounts = allAtLocation.reduce((result, asset) => {
                result[asset.category] = (result[asset.category] || 0) + 1
                return result
              }, {})
              const categoryEntries = Object.entries(categoryCounts)
              const usableInGroup = items.filter((asset) => asset.status === 'Available').length
              const maintenanceInGroup = items.filter((asset) => asset.status === 'Under Maintenance').length
              const issuesInGroup = items.filter((asset) => asset.status === 'Out of Service').length
              const autoExpanded = hasActiveFilters && equipmentGroups.length === 1
              const expanded = expandedLocations[location] ?? autoExpanded

              return (
                <section className="staff-inventory-location" key={location}>
                  <button
                    type="button"
                    className="staff-inventory-location-header"
                    aria-expanded={expanded}
                    onClick={() => toggleLocation(location, autoExpanded)}
                  >
                    <span className="staff-inventory-location-icon"><StaffIcon name="computer" /></span>
                    <span className="staff-inventory-location-copy">
                      <strong>{location}</strong>
                      <small>{items.length} registered · {categoryEntries.length} {categoryEntries.length === 1 ? 'category' : 'categories'}</small>
                      <span className="staff-inventory-location-status">
                        <span>{usableInGroup} usable</span>
                        {maintenanceInGroup > 0 && <span>{maintenanceInGroup} maint.</span>}
                        {issuesInGroup > 0 && <span>{issuesInGroup} issues</span>}
                      </span>
                    </span>
                    <span className={`staff-inventory-collapse ${expanded ? 'expanded' : ''}`} aria-hidden="true">⌄</span>
                  </button>

                  {expanded && (
                    <div className="staff-inventory-location-content">
                      <div className="staff-inventory-categories" aria-label={`${location} equipment types`}>
                        {categoryEntries.map(([category, count]) => (
                          <button
                            type="button"
                            key={category}
                            className={`staff-inventory-category ${selectedCategory === category ? 'active' : ''}`}
                            aria-pressed={selectedCategory === category}
                            onClick={() => setSelectedCategory((current) => current === category ? 'All' : category)}
                          >
                            <StaffIcon name={category === 'Computer Equipment' ? 'computer' : 'inventory'} />
                            <span>{categoryLabel(category)}</span>
                            <small>{count}</small>
                          </button>
                        ))}
                      </div>

                      <div className="staff-inventory-equipment-list">
                        {items.map((asset) => {
                          const assetExpanded = expandedAsset === asset.id
                          const statusClass = asset.status.toLowerCase().replaceAll(' ', '-')

                          return (
                            <article className="staff-inventory-equipment" key={asset.id}>
                              <div className="staff-inventory-equipment-row">
                                <button
                                  type="button"
                                  className="staff-inventory-equipment-button"
                                  aria-expanded={assetExpanded}
                                  onClick={() => setExpandedAsset((current) => current === asset.id ? null : asset.id)}
                                >
                                  <span className="staff-inventory-equipment-icon">
                                    <StaffIcon name={asset.category === 'Computer Equipment' ? 'computer' : 'inventory'} />
                                  </span>
                                  <span className="staff-inventory-equipment-copy">
                                    <strong>{asset.name}</strong>
                                    <small>{asset.id}</small>
                                    <span className="staff-inventory-equipment-meta">
                                      <span className={`staff-inventory-status status-${statusClass}`}>
                                        <i aria-hidden="true" />
                                        {statusLabel(asset.status)}
                                      </span>
                                      <span className="staff-inventory-added">
                                        <StaffIcon name="calendar" />
                                        Added {asset.date.split(' ').slice(0, 3).join(' ')}
                                      </span>
                                    </span>
                                  </span>
                                  <span className="staff-inventory-equipment-arrow" aria-hidden="true">›</span>
                                </button>
                                <EquipmentUpdateButton
                                  asset={asset}
                                  className="staff-inventory-update-button"
                                  onUpdated={() => setEquipmentList(getStaffEquipment())}
                                  relatedTasks={staffTickets.filter((ticket) => ticket.assetId === asset.id)}
                                  onOpenRepair={openRepairDetails}
                                />
                              </div>
                              {assetExpanded && (
                                <>
                                  <dl className="staff-inventory-equipment-details">
                                    <div><dt>Category</dt><dd>{asset.category}</dd></div>
                                    <div><dt>Location</dt><dd>{asset.location}</dd></div>
                                    <div><dt>Model</dt><dd>{asset.model || 'Not recorded'}</dd></div>
                                    <div><dt>Serial number</dt><dd>{asset.serial || 'Not recorded'}</dd></div>
                                    <div><dt>Condition</dt><dd>{asset.condition || 'Not recorded'}</dd></div>
                                  </dl>
                                  <button type="button" className="staff-item-log-open" onClick={() => openItemLog(asset.id)}>
                                    Open item log <span aria-hidden="true">→</span>
                                  </button>
                                </>
                              )}
                            </article>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        ) : (
          <section className="staff-inventory-empty">
            <span className="staff-empty-icon"><StaffIcon name="inventory" /></span>
            <strong>No matching equipment</strong>
            <p>Try another search or reset your filters to see all registered equipment.</p>
            <button type="button" className="staff-inventory-empty-reset" onClick={resetFilters}>Reset filters</button>
          </section>
        )}
      </div>
    </StaffLayout>
  )
}

export default Inventory
