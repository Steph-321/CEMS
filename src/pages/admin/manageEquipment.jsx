import { useMemo, useState } from 'react'
import AdminLayout from './adminLayout.jsx'
import { initialEquipment, initialTickets } from './adminData.jsx'

const emptyAsset = {
  id: '', name: '', category: 'Computer Equipment', location: '', condition: '',
  status: 'Available', date: new Date().toISOString().slice(0, 10), cost: '',
  model: '', serial: '', warranty: '', warrantyExpiry: '',
}

function ManageEquipment({ setPath }) {
  const [assets, setAssets] = useState(initialEquipment)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All status')
  const [mode, setMode] = useState('list')
  const [selectedId, setSelectedId] = useState(null)
  const [draft, setDraft] = useState(emptyAsset)
  const [showDelete, setShowDelete] = useState(false)

  const selected = assets.find((asset) => asset.id === selectedId)
  const visible = useMemo(() => assets.filter((asset) => {
    const matchesText = `${asset.id} ${asset.name} ${asset.category} ${asset.location}`.toLowerCase().includes(search.toLowerCase())
    return matchesText && (statusFilter === 'All status' || asset.status === statusFilter)
  }), [assets, search, statusFilter])

  const startAdd = () => {
    setDraft({ ...emptyAsset, id: `AST-${String(assets.length + 1).padStart(3, '0')}` })
    setMode('add')
  }

  const startEdit = (asset) => {
    setSelectedId(asset.id)
    setDraft({ ...asset })
    setMode('edit')
  }

  const saveAsset = (event) => {
    event.preventDefault()
    if (mode === 'add') {
      setAssets((current) => [...current, draft])
      setSelectedId(draft.id)
      setMode('detail')
    } else {
      setAssets((current) => current.map((asset) => asset.id === selectedId ? draft : asset))
      setMode('detail')
    }
  }

  const deleteBlocked = selected && initialTickets.some((ticket) => ticket.assetId === selected.id)

  return (
    <AdminLayout setPath={setPath} active="equipment" title={mode === 'list' ? 'Asset Inventory' : mode === 'detail' ? 'Asset Details' : `${mode === 'add' ? 'Add' : 'Edit'} Equipment`}>
      {mode === 'list' && (
        <>
          <div className="inventory-summary">
            <article><span>Total Assets</span><strong>{assets.length}</strong><small>All registered equipment</small></article>
            <article><span>Available</span><strong>{assets.filter((asset) => asset.status === 'Available').length}</strong><small>Ready for use</small></article>
            <article><span>Under Maintenance</span><strong>{assets.filter((asset) => asset.status === 'Under Maintenance').length}</strong><small>Currently being serviced</small></article>
            <article><span>Out of Service</span><strong>{assets.filter((asset) => asset.status === 'Out of Service').length}</strong><small>Not available</small></article>
          </div>
          <section className="admin-panel">
            <div className="page-toolbar">
              <div><h2>Asset List</h2><p>Manage and view all equipment and assets in the system</p></div>
              <button className="primary-action" onClick={startAdd}>Add New Equipment</button>
            </div>
            <div className="table-toolbar">
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search assets..." />
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option>All status</option><option>Available</option><option>Under Maintenance</option><option>Out of Service</option>
              </select>
            </div>
            <div className="data-table">
              <table>
                <thead><tr><th>ASSET ID</th><th>ASSET NAME</th><th>CATEGORY</th><th>ADDED ASSET DATE</th><th>LOCATION</th><th>WARRANTY EXPIRY</th><th>STATUS</th><th></th></tr></thead>
                <tbody>{visible.map((asset) => (
                  <tr key={asset.id}>
                    <td>{asset.id}</td><td><button className="table-action asset-name" onClick={() => { setSelectedId(asset.id); setMode('detail') }}>{asset.name}</button></td>
                    <td><span className="category-tag">{asset.category}</span></td><td>{asset.date}</td><td>{asset.location}</td><td>{asset.warrantyExpiry || 'Not recorded'}</td>
                    <td><span className={`status-badge ${asset.status === 'Available' ? 'available' : asset.status === 'Under Maintenance' ? 'maintenance' : 'inspection'}`}>{asset.status}</span></td>
                    <td><button className="table-action" onClick={() => { setSelectedId(asset.id); setMode('detail') }}>View</button></td>
                  </tr>
                ))}</tbody>
              </table>
              {!visible.length && <div className="empty-state">No assets match your search.</div>}
            </div>
          </section>
        </>
      )}

      {(mode === 'add' || mode === 'edit') && (
        <section className="admin-panel">
          <div className="page-toolbar"><div><h2>{mode === 'add' ? 'Add Equipment' : 'Edit Equipment'}</h2><p>Asset Inventory / {draft.name || draft.id}</p></div><button className="secondary-action" onClick={() => setMode(selected ? 'detail' : 'list')}>← Back</button></div>
          <form className="admin-form" onSubmit={saveAsset}>
            <div className="form-section-title">{mode === 'add' ? 'Equipment information' : 'Asset information'}</div>
            <div className="admin-form-grid">
              <label>Draft asset ID <input value={draft.id} onChange={(event) => setDraft({ ...draft, id: event.target.value })} required /></label>
              <label>Equipment name * <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} required /></label>
              <label>Category * <select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}><option>Computer Equipment</option><option>Networking Equipment</option><option>Presentation Equipment</option><option>Printing Equipment</option><option>Storage Device</option></select></label>
              <label>Asset date * <input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} required /></label>
              <label>Department / Location * <select value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} required><option value="">Select location</option><option>BSIT Department / Faculty</option><option>Computer Laboratory 1</option><option>Computer Laboratory 2</option><option>Computer Laboratory 3</option><option>Office</option></select></label>
              <label>Condition * <select value={draft.condition} onChange={(event) => setDraft({ ...draft, condition: event.target.value })} required><option value="">Select condition</option><option>Good / Working</option><option>Fair</option><option>Needs Repair</option></select></label>
              <label>Acquisition cost (₱) * <input type="number" min="0" value={draft.cost} onChange={(event) => setDraft({ ...draft, cost: event.target.value })} required /></label>
              <label>Availability status <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value })}><option>Available</option><option>Under Maintenance</option><option>Out of Service</option></select></label>
              <label>Model (optional) <input value={draft.model || ''} onChange={(event) => setDraft({ ...draft, model: event.target.value })} /></label>
              <label>Serial number (optional) <input value={draft.serial || ''} onChange={(event) => setDraft({ ...draft, serial: event.target.value })} /></label>
              <label>Warranty expiry (if covered) <input type="date" value={draft.warrantyExpiry || ''} onChange={(event) => setDraft({ ...draft, warrantyExpiry: event.target.value })} /></label>
              <label>Warranty coverage <select value={draft.warranty || ''} onChange={(event) => setDraft({ ...draft, warranty: event.target.value })}><option value="">Select coverage / No warranty / Unknown</option><option>1 year</option><option>2 years</option><option>No warranty</option><option>Unknown</option></select></label>
            </div>
            <p className="form-note">Required fields: complete the condition, cost, location, and asset information before saving.</p>
            <div className="form-actions"><button type="button" className="secondary-action" onClick={() => setMode(selected ? 'detail' : 'list')}>Cancel</button><button className="primary-action" type="submit">{mode === 'add' ? 'Save Equipment' : 'Save Changes'}</button></div>
          </form>
        </section>
      )}

      {mode === 'detail' && selected && (
        <div className="two-column-layout">
          <section className="admin-panel">
            <div className="page-toolbar"><div><h2>{selected.name}</h2><p>Asset Inventory / Staff asset reference / {selected.id}</p></div><button className="secondary-action" onClick={() => setMode('list')}>← Back</button></div>
            <div className="detail-pairs">
              <div><span>Staff asset tag</span><strong>{selected.id}</strong></div><div><span>Category</span><strong>{selected.category}</strong></div>
              <div><span>Department / location</span><strong>{selected.location}</strong></div><div><span>Recorded condition</span><strong>{selected.condition}</strong></div>
              <div><span>Model</span><strong>{selected.model || 'Not recorded'}</strong></div><div><span>Serial number</span><strong>{selected.serial || 'Not recorded'}</strong></div>
              <div><span>Acquisition cost</span><strong>₱{Number(selected.cost).toLocaleString()}</strong></div><div><span>Availability</span><strong>{selected.status}</strong></div>
            </div>
            <div className="action-row"><button className="primary-action" onClick={() => startEdit(selected)}>Edit Asset</button><button className="secondary-action" onClick={() => setShowDelete(true)}>Remove Asset</button></div>
          </section>
          <section className="admin-panel"><div className="form-section-title">Warranty record</div><div className="detail-pairs single"><div><span>Warranty expiry</span><strong>{selected.warrantyExpiry || 'Not supplied'}</strong></div><div><span>Warranty status</span><strong>{selected.warranty || 'Not established'}</strong></div></div><hr className="admin-rule" /><div className="form-section-title">Existing maintenance history</div>{initialTickets.filter((ticket) => ticket.assetId === selected.id).length ? initialTickets.filter((ticket) => ticket.assetId === selected.id).map((ticket) => <div className="linked-ticket" key={ticket.id}><strong>{ticket.id}</strong><span>{ticket.issue} · {ticket.severity}</span><button className="table-action" onClick={() => setPath('/admin/maintenance')}>View Ticket</button></div>) : <p className="form-note">No linked maintenance requests.</p>}</section>
        </div>
      )}

      {showDelete && (
        <div className="modal-scrim" role="presentation" onMouseDown={() => setShowDelete(false)}>
          <section className="admin-dialog" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
            <div className="dialog-heading"><div><h2>This asset cannot be removed</h2><p>{selected?.name} · {selected?.id}</p></div><button className="dialog-close" onClick={() => setShowDelete(false)}>×</button></div>
            <div className="info-callout"><strong>Use a status update instead.</strong>{deleteBlocked ? 'This asset has linked maintenance history. Keep the asset in the register to preserve accountability.' : 'Asset removal is not available in this page.'} Update its status when it is no longer available.</div>
            <div className="form-actions"><button className="secondary-action" onClick={() => setShowDelete(false)}>Cancel</button><button className="primary-action" onClick={() => setShowDelete(false)}>Back to Asset Details</button></div>
          </section>
        </div>
      )}
    </AdminLayout>
  )
}

export default ManageEquipment
