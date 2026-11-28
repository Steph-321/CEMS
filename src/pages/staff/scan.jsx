import { useCallback, useEffect, useRef, useState } from 'react'
import StaffLayout, { StaffIcon } from './StaffLayout.jsx'
import { createStaffTicket, getStaffEquipment } from './staffMaintenance.js'

const severityOptions = ['Low', 'Medium', 'High', 'Critical']

function findEquipment(value, equipmentList) {
  const candidates = value.trim().toLowerCase().split(/[^a-z0-9_-]+/).filter(Boolean)
  return equipmentList.find((item) => (
    candidates.includes(item.id.toLowerCase()) || candidates.includes(item.serial.toLowerCase())
  ))
}

function equipmentTypeLabel(asset) {
  if (/laptop/i.test(asset.name)) return 'Laptop'
  if (asset.category === 'Computer Equipment' || /\bcomputer\b|\bpc\b/i.test(asset.name)) return 'Computer'
  return asset.category
}

function Scan({ setPath }) {
  const videoRef = useRef(null)
  const reportPanelRef = useRef(null)
  const scannerControlsRef = useRef(null)
  const scanSessionRef = useRef(0)
  const scrollPositionRef = useRef(0)
  const [assetTag, setAssetTag] = useState('')
  const [asset, setAsset] = useState(null)
  const [lookupMessage, setLookupMessage] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [cameraState, setCameraState] = useState('idle')
  const [cameraMessage, setCameraMessage] = useState('')
  const [floatingButtonVisible, setFloatingButtonVisible] = useState(true)
  const [assetName, setAssetName] = useState('')
  const [issue, setIssue] = useState('Hardware Failure')
  const [severity, setSeverity] = useState('Medium')
  const [description, setDescription] = useState('')
  const [additionalDetails, setAdditionalDetails] = useState('')
  const [additionalOpen, setAdditionalOpen] = useState(false)
  const [attachmentName, setAttachmentName] = useState('')
  const [reportError, setReportError] = useState('')
  const [equipmentList] = useState(getStaffEquipment)
  const [suggestionsOpen, setSuggestionsOpen] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)

  const serialSuggestions = assetTag.trim()
    ? equipmentList.filter((item) => item.serial?.toLowerCase().includes(assetTag.trim().toLowerCase()))
    : []

  const updateFloatingButtonVisibility = useCallback((scrollTop) => {
    const previousPosition = scrollPositionRef.current
    if (scrollTop <= 0 || scrollTop < previousPosition - 2) {
      setFloatingButtonVisible(true)
    } else if (scrollTop > previousPosition + 2) {
      setFloatingButtonVisible(false)
    }
    scrollPositionRef.current = scrollTop
  }, [])

  useEffect(() => {
    const handleWindowScroll = () => updateFloatingButtonVisibility(window.scrollY)
    window.addEventListener('scroll', handleWindowScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [updateFloatingButtonVisibility])

  useEffect(() => () => scannerControlsRef.current?.stop(), [])

  useEffect(() => {
    if (!reportOpen) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    reportPanelRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
      block: 'start',
    })
  }, [reportOpen])

  const handleContentScroll = (event) => {
    updateFloatingButtonVisibility(event.currentTarget.scrollTop)
  }

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  const applyScannedCode = (value) => {
    const code = value.trim()
    const match = findEquipment(code, equipmentList)
    setAsset(match || null)
    setAssetName(match?.name || '')
    setAssetTag(match?.id || code)
    setLookupMessage(match
      ? `${match.name} identified in ${match.location}.`
      : 'QR code scanned. Add the equipment name and confirm the asset tag below.')
    setReportOpen(true)
    setReportError('')
    setCameraState('detected')
    setCameraMessage('QR code detected. Confirm the equipment details below.')
  }

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState('error')
      setCameraMessage('Camera access requires HTTPS or localhost. Open this site securely, or use manual asset lookup.')
      return
    }

    const session = scanSessionRef.current + 1
    scanSessionRef.current = session
    setCameraState('starting')
    setCameraMessage('Connecting to your camera…')

    try {
      const { BrowserQRCodeReader } = await import('@zxing/browser')
      const reader = new BrowserQRCodeReader()
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current,
        (result, error, callbackControls) => {
          if (session !== scanSessionRef.current) {
            callbackControls?.stop()
            return
          }

          if (result) {
            scanSessionRef.current += 1
            callbackControls?.stop()
            scannerControlsRef.current = null
            applyScannedCode(result.getText())
          } else if (error && !['NotFoundException', 'ChecksumException', 'FormatException'].includes(error.name)) {
            scanSessionRef.current += 1
            callbackControls?.stop()
            scannerControlsRef.current = null
            setCameraState('error')
            setCameraMessage('QR scanning stopped unexpectedly. Try again or use manual asset lookup.')
          }
        },
      )

      if (session !== scanSessionRef.current) {
        controls.stop()
        return
      }

      scannerControlsRef.current = controls
      setCameraState('scanning')
      setCameraMessage('Point your camera at an equipment QR code.')
    } catch (error) {
      if (session !== scanSessionRef.current) return
      scannerControlsRef.current?.stop()
      scannerControlsRef.current = null
      setCameraState('error')
      if (error instanceof Error && (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')) {
        setCameraMessage('Camera access was denied. Allow camera access in your browser settings, or use manual asset lookup.')
      } else if (error instanceof Error && error.name === 'NotFoundError') {
        setCameraMessage('No camera was found. Use manual asset lookup instead.')
      } else if (error instanceof Error && error.name === 'NotReadableError') {
        setCameraMessage('Your camera is already in use by another app. Close it and try again.')
      } else {
        setCameraMessage('Unable to start the camera. Check your camera connection and try again.')
      }
    }
  }

  const stopCamera = () => {
    scanSessionRef.current += 1
    scannerControlsRef.current?.stop()
    scannerControlsRef.current = null
    setCameraState('idle')
    setCameraMessage('')
  }

  const toggleManualReport = () => {
    if (reportOpen) {
      setReportOpen(false)
      return
    }
    setAsset(null)
    setAssetName('')
    setAssetTag('')
    setLookupMessage('')
    setReportError('')
    setReportOpen(true)
  }

  const lookupAsset = (event) => {
    event.preventDefault()
    const query = assetTag.trim()
    if (!query) {
      setLookupMessage('Enter an asset ID or serial number to search.')
      return
    }

    const match = findEquipment(query, equipmentList)
    setAsset(match || null)
    setAssetName(match?.name || '')
    setAssetTag(match?.id || query)
    setLookupMessage(match
      ? `${match.name} found in ${match.location}.`
      : `No equipment found for “${query}”. Enter the equipment details below.`)
    setReportOpen(true)
    setReportError('')
    setSuggestionsOpen(false)
  }

  const chooseSuggestion = (suggestion) => {
    setAssetTag(suggestion.serial)
    setAsset(null)
    setAssetName('')
    setLookupMessage('')
    setActiveSuggestion(-1)
    setSuggestionsOpen(false)
  }

  const handleSuggestionKeyDown = (event) => {
    if (!serialSuggestions.length) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSuggestionsOpen(true)
      setActiveSuggestion((current) => Math.min(current + 1, serialSuggestions.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveSuggestion((current) => Math.max(current - 1, -1))
    } else if (event.key === 'Escape') {
      setSuggestionsOpen(false)
      setActiveSuggestion(-1)
    } else if (event.key === 'Enter' && suggestionsOpen && activeSuggestion >= 0) {
      event.preventDefault()
      chooseSuggestion(serialSuggestions[activeSuggestion])
    }
  }

  const saveReport = (event) => {
    event.preventDefault()
    setReportError('')
    try {
      const ticket = createStaffTicket({
        asset: assetName,
        assetId: assetTag,
        issue,
        severity,
        description: [description.trim(), additionalDetails.trim()].filter(Boolean).join('\n\n'),
        attachmentName,
      })
      navigate(`/staff/notifications/${ticket.id}`)
    } catch (error) {
      setReportError(error instanceof Error ? error.message : 'The maintenance request could not be saved.')
    }
  }

  const cameraIsActive = cameraState === 'starting' || cameraState === 'scanning'
  const cameraTitle = {
    idle: 'Ready to scan',
    starting: 'Connecting to camera',
    scanning: 'Camera is active',
    detected: 'QR code detected',
    error: 'Camera unavailable',
  }[cameraState]
  const cameraDescription = cameraMessage || 'Allow camera access, then point your camera at an equipment QR code.'
  const floatingAction = (
    <button
      type="button"
      className={`staff-scan-fab ${floatingButtonVisible ? 'visible' : 'hidden'} ${reportOpen ? 'open' : ''}`}
      aria-label={reportOpen ? 'Close report details' : 'Add equipment manually'}
      aria-expanded={reportOpen}
      aria-hidden={!floatingButtonVisible}
      tabIndex={floatingButtonVisible ? 0 : -1}
      onClick={toggleManualReport}
    >
      <span aria-hidden="true">{reportOpen ? '×' : '+'}</span>
    </button>
  )

  return (
    <StaffLayout
      setPath={setPath}
      activePath="scan"
      onContentScroll={handleContentScroll}
      floatingAction={floatingAction}
    >
      <div className="staff-view-heading">
        <div><span className="staff-eyebrow">EQUIPMENT SUPPORT</span><h1>Scan equipment</h1><p>Find an asset, then log a maintenance request.</p></div>
      </div>

      <section className="staff-scan-camera-card" aria-label="QR code scanner">
        <div className={`staff-scan-camera-stage ${cameraIsActive ? 'active' : ''}`}>
          <video ref={videoRef} className="staff-scan-camera-video" autoPlay muted playsInline aria-label="Live camera preview" />
          {cameraIsActive ? (
            <span className="staff-scan-target" aria-hidden="true" />
          ) : (
            <div className="staff-scan-camera-placeholder">
              <span><StaffIcon name="scan" /></span>
              <strong>Position a QR code in view</strong>
            </div>
          )}
        </div>
        <div className="staff-scan-camera-copy">
          <span className="staff-eyebrow">LIVE QR SCAN</span>
          <h2>{cameraTitle}</h2>
          <p role={cameraState === 'error' ? 'alert' : 'status'}>{cameraDescription}</p>
          <button
            type="button"
            className={`staff-scan-camera-button ${cameraIsActive ? 'secondary' : ''}`}
            onClick={cameraIsActive ? stopCamera : startCamera}
          >
            {cameraIsActive
              ? 'Stop scanning'
              : cameraState === 'detected'
                ? 'Scan another QR code'
                : cameraState === 'error'
                  ? 'Try camera again'
                  : 'Start camera scan'}
          </button>
        </div>
      </section>

      <form className="staff-report-form staff-scan-form" onSubmit={lookupAsset}>
        <label>Find by asset ID or serial number
          <div
            className="staff-scan-lookup-wrap"
            onBlur={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setSuggestionsOpen(false)
                setActiveSuggestion(-1)
              }
            }}
          >
            <div className="staff-scan-lookup">
              <input
                value={assetTag}
                onChange={(event) => {
                  setAssetTag(event.target.value)
                  setLookupMessage('')
                  setAsset(null)
                  setActiveSuggestion(-1)
                  setSuggestionsOpen(true)
                }}
                placeholder="e.g. AST-001 or serial number"
                aria-label="Asset ID or serial number"
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={suggestionsOpen && serialSuggestions.length > 0}
                aria-controls="staff-scan-serial-suggestions"
                aria-activedescendant={suggestionsOpen && activeSuggestion >= 0
                  ? `staff-scan-suggestion-${serialSuggestions[activeSuggestion].id}`
                  : undefined}
                onFocus={() => setSuggestionsOpen(true)}
                onKeyDown={handleSuggestionKeyDown}
              />
              <button type="submit">Look up</button>
            </div>
            {suggestionsOpen && serialSuggestions.length > 0 && (
              <div
                id="staff-scan-serial-suggestions"
                className="staff-scan-suggestions"
                role="listbox"
                aria-label="Matching inventory serial numbers"
              >
                {serialSuggestions.map((suggestion, index) => (
                  <button
                    id={`staff-scan-suggestion-${suggestion.id}`}
                    key={suggestion.id}
                    type="button"
                    role="option"
                    aria-selected={activeSuggestion === index}
                    className={activeSuggestion === index ? 'active' : ''}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => chooseSuggestion(suggestion)}
                  >
                    <span>{suggestion.serial}</span>
                    <small>{equipmentTypeLabel(suggestion)} · {suggestion.name}</small>
                  </button>
                ))}
              </div>
            )}
          </div>
        </label>
      </form>
      {lookupMessage && <p className="staff-scan-message" role="status">{lookupMessage}</p>}

      {asset && (
        <section className="staff-scan-asset-card" aria-label="Equipment found">
          <span className="staff-scan-asset-icon"><StaffIcon name="computer" /></span>
          <div><strong>{asset.name}</strong><small>{asset.id} · {asset.location}</small></div>
          <span className={`staff-inventory-status status-${asset.status.toLowerCase().replaceAll(' ', '-')}`}>{asset.status}</span>
        </section>
      )}

      {reportOpen && (
        <section ref={reportPanelRef} className="staff-scan-report" aria-label="Maintenance report details">
          <form className="staff-report-form" onSubmit={saveReport}>
            <div className="staff-scan-form-heading">
              <span><strong>Report details</strong><small>Required fields are marked with *</small></span>
            </div>
            <label>Equipment name *
              <input value={assetName} onChange={(event) => setAssetName(event.target.value)} placeholder="Enter equipment name" required />
            </label>
            <label>Asset tag
              <input value={assetTag} onChange={(event) => setAssetTag(event.target.value)} placeholder="e.g. AST-001" />
            </label>
            <label>Issue category *
              <select value={issue} onChange={(event) => setIssue(event.target.value)}>
                <option>Hardware Failure</option><option>Damage</option><option>Software Issue</option><option>Preventive Maintenance</option><option>Other</option>
              </select>
            </label>
            <fieldset className="staff-scan-severity">
              <legend>Severity level *</legend>
              <div role="radiogroup" aria-label="Severity level">
                {severityOptions.map((option) => (
                  <button
                    type="button"
                    key={option}
                    role="radio"
                    aria-checked={severity === option}
                    className={`severity-${option.toLowerCase()} ${severity === option ? 'selected' : ''}`}
                    onClick={() => setSeverity(option)}
                  >{option}</button>
                ))}
              </div>
            </fieldset>
            <label>Describe the issue *
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe what happened and any visible damage" required />
            </label>
            {additionalOpen && (
              <label>Additional details
                <textarea value={additionalDetails} onChange={(event) => setAdditionalDetails(event.target.value)} placeholder="Add any other useful information" />
              </label>
            )}
            <label className="staff-scan-attachment">Photo capture / attachment
              <input type="file" accept="image/*" capture="environment" onChange={(event) => setAttachmentName(event.target.files?.[0]?.name || '')} />
              <small>{attachmentName ? `Selected: ${attachmentName} (file upload is not connected)` : 'Choose or capture an image; uploads require a connected service.'}</small>
            </label>
            {reportError && <p className="staff-scan-error" role="alert">{reportError}</p>}
            <button type="submit">Log Maintenance Request</button>
            <button type="button" className="staff-scan-more-details" onClick={() => setAdditionalOpen((open) => !open)}>
              {additionalOpen ? 'Hide additional details' : 'Provide further details'}
            </button>
          </form>
        </section>
      )}
    </StaffLayout>
  )
}

export default Scan
