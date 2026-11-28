import { useState } from 'react'
import StaffLayout, { StaffIcon } from './StaffLayout.jsx'
import { getStaffEquipment } from './staffMaintenance.js'

const tabs = [
  { id: 'usage', label: 'Usage' },
  { id: 'maintenance', label: 'Maintenance' },
  { id: 'repairs', label: 'Repairs' },
  { id: 'transfers', label: 'Transfers' },
]

function ItemLog({ setPath, assetId }) {
  const [activeTab, setActiveTab] = useState('maintenance')
  const equipmentList = getStaffEquipment()

  const equipment = equipmentList.find((asset) => asset.id === assetId) || {
    id: 'AC-301',
    name: 'Air Conditioner',
    category: 'Air Conditioner',
    location: 'Room 301',
    condition: 'Good',
    status: 'Under Maintenance',
    date: 'Nov 14, 2025',
    model: 'Split Type',
  }

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  const isMaintenance = activeTab === 'maintenance'
  const tabCopy = {
    usage: {
      title: 'Usage log',
      status: 'Available',
      statusClass: 'available',
      detail: 'No usage schedule is recorded.',
      date: 'No booking was supplied.',
    },
    maintenance: {
      title: 'Under Maintenance',
      status: 'Under Maintenance',
      statusClass: 'maintenance',
      detail: 'Compressor inspection and basic filter cleaning.',
      date: 'Mar 14, 2026',
    },
    repairs: {
      title: 'Recent repairs',
      status: 'Repair history',
      statusClass: 'repair',
      detail: 'Compressor coil cleaning and thermostat calibration.',
      date: 'Mar 15, 2026',
    },
    transfers: {
      title: 'Transfer log',
      status: 'Transferred',
      statusClass: 'transfer',
      detail: 'Moved between storage and the assigned room.',
      date: 'Feb 28, 2026',
    },
  }
  const copy = tabCopy[activeTab]

  const exportAllLogs = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      window.alert('Allow pop-ups for this site to open the PDF-ready item log.')
      return
    }

    const escapeHtml = (value) => String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;')
    const logSections = tabs.map((tab) => {
      const log = tabCopy[tab.id]
      return `<section class="log-section">
        <h2>${escapeHtml(tab.label)}</h2>
        <div class="log-meta"><strong>${escapeHtml(log.status)}</strong><span>${escapeHtml(log.date)}</span></div>
        <p>${escapeHtml(log.detail)}</p>
        ${tab.id === 'maintenance' ? '<p>Compressed capacity inspection and filter cleaning.</p><ul><li>Compressor noise assessment</li><li>Cooling performance check</li><li>Filter and drainage inspection</li></ul><small>No notes or service cost were supplied in the report.</small>' : `<small>No additional ${escapeHtml(tab.label.toLowerCase())} details were supplied.</small>`}
      </section>`
    }).join('')

    printWindow.document.open()
    printWindow.document.write(`<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <title>CEMS Item Log ${escapeHtml(equipment.id)}</title>
          <style>
            @page { size: A4; margin: 16mm; }
            body { color: #26364d; font: 11px Arial, sans-serif; }
            h1 { margin: 0 0 5px; font-size: 20px; }
            h2 { margin: 0 0 9px; font-size: 14px; }
            p { margin: 7px 0; line-height: 1.5; }
            .subtitle, small { color: #64748b; }
            .item-summary { margin: 16px 0; border: 1px solid #dfe5ec; border-radius: 8px; padding: 12px; }
            .item-summary p { margin: 4px 0; }
            .log-section { margin: 12px 0; border: 1px solid #dfe5ec; border-radius: 8px; padding: 12px; break-inside: avoid; }
            .log-meta { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px solid #edf0f3; padding-bottom: 8px; }
            .log-meta strong { color: #d93038; }
            ul { margin: 6px 0; padding-left: 20px; }
            @media screen { body { max-width: 760px; margin: 24px auto; } }
          </style>
        </head>
        <body>
          <h1>Item Log</h1>
          <p class="subtitle">All log categories · Generated ${escapeHtml(new Date().toLocaleDateString())}</p>
          <div class="item-summary">
            <h2>${escapeHtml(equipment.name)}</h2>
            <p><strong>Asset ID:</strong> ${escapeHtml(equipment.id)} · <strong>Model:</strong> ${escapeHtml(equipment.model || equipment.category)}</p>
            <p><strong>Location:</strong> ${escapeHtml(equipment.location)} · <strong>Condition:</strong> ${escapeHtml(equipment.condition)}</p>
          </div>
          ${logSections}
        </body>
      </html>`)
    printWindow.document.close()
    printWindow.document.title = `CEMS_Item_Log_${equipment.id}`
    printWindow.setTimeout(() => {
      printWindow.focus()
      printWindow.print()
    }, 250)
  }

  return (
    <StaffLayout setPath={setPath} activePath="inventory">
      <div className="staff-item-log">
        <button type="button" className="staff-item-log-back" onClick={() => navigate('/staff/inventory')}>
          <span aria-hidden="true">←</span>
          Item Log
        </button>

        <section className="staff-item-log-summary">
          <span className="staff-item-log-summary-icon"><StaffIcon name="computer" /></span>
          <div>
            <h1>{equipment.name}</h1>
            <p>{equipment.model || equipment.category}</p>
            <dl>
              <div><dt>Asset ID</dt><dd>{equipment.id}</dd></div>
              <div><dt>Location</dt><dd>{equipment.location}</dd></div>
              <div><dt>Cost</dt><dd>Not recorded</dd></div>
              <div><dt>Maintenance</dt><dd>{equipment.date.split(' ')[0]} {equipment.date.split(' ')[1]} 2026</dd></div>
            </dl>
          </div>
        </section>

        <div className="staff-item-log-tabs" role="tablist" aria-label="Item log categories">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <section className="staff-item-log-card">
          <div className="staff-item-log-card-heading">
            <span className="staff-item-log-card-icon"><StaffIcon name={isMaintenance ? 'inventory' : activeTab === 'usage' ? 'calendar' : activeTab === 'repairs' ? 'computer' : 'filter'} /></span>
            <div>
              <h2>{equipment.name}</h2>
              <p>{equipment.model || equipment.category}</p>
            </div>
          </div>
          <dl className="staff-item-log-card-meta">
            <div><dt>Asset ID</dt><dd>{equipment.id}</dd></div>
            <div><dt>Condition</dt><dd>{equipment.condition}</dd></div>
            <div><dt>Cost</dt><dd>Not recorded</dd></div>
            <div><dt>Warranty</dt><dd>{equipment.warranty || 'Not recorded'}</dd></div>
          </dl>

          <article className={`staff-item-log-event ${copy.statusClass}`}>
            <span className="staff-item-log-event-date">
              {copy.status === 'Under Maintenance' ? 'Under Maintenance' : copy.status}
              <small>{copy.date}</small>
            </span>
            <p>{copy.detail}</p>
          </article>

          <div className="staff-item-log-notes">
            <strong>{copy.title}</strong>
            {activeTab === 'maintenance' ? (
              <>
                <p>Compressed capacity inspection and filter cleaning.</p>
                <ul>
                  <li>Compressor noise assessment</li>
                  <li>Cooling performance check</li>
                  <li>Filter and drainage inspection</li>
                </ul>
                <small>No notes or service cost were supplied in the report.</small>
              </>
            ) : (
              <p>No additional {activeTab} details were supplied.</p>
            )}
          </div>
        </section>

        <button type="button" className="staff-item-log-export" onClick={exportAllLogs}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 17v3h14v-3" />
          </svg>
          Export Log
        </button>
      </div>
    </StaffLayout>
  )
}

export default ItemLog
