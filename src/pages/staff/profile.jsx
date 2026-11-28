import { useState } from 'react'
import StaffLayout from './StaffLayout.jsx'
import {
  clearCurrentUser,
  getCurrentUser,
  updateLocalAccountPassword,
  updateLocalAccountProfile,
} from '../auth/localAuth.js'

const initialPasswordForm = {
  current: '',
  next: '',
  confirm: '',
}

function Profile({ setPath }) {
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser())
  const [page, setPage] = useState('profile')
  const [modal, setModal] = useState('')
  const [editingProfile, setEditingProfile] = useState(false)
  const [profileForm, setProfileForm] = useState(() => ({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
  }))
  const [profileError, setProfileError] = useState('')
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm)
  const [passwordError, setPasswordError] = useState('')
  const [passwordVisible, setPasswordVisible] = useState({})
  const [savingPassword, setSavingPassword] = useState(false)
  const name = currentUser?.name || 'Staff Member'
  const email = currentUser?.email || 'staff@ctu.edu.ph'
  const initials = name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase()

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  const logout = () => {
    clearCurrentUser()
    navigate('/')
  }

  const updatePassword = async (event) => {
    event.preventDefault()
    setPasswordError('')

    if (passwordForm.next.length < 12
      || !/[A-Z]/.test(passwordForm.next)
      || !/[a-z]/.test(passwordForm.next)
      || !/[0-9]/.test(passwordForm.next)
      || !/[!@#$%^&*(),.?":{}|<>_\-+=/\\[\];'`~]/.test(passwordForm.next)) {
      setPasswordError('Use at least 12 characters with uppercase and lowercase letters, a number, and a symbol.')
      return
    }
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError('The new passwords do not match.')
      return
    }
    if (passwordForm.next === passwordForm.current) {
      setPasswordError('Choose a new password that is different from your current password.')
      return
    }

    setSavingPassword(true)
    try {
      await updateLocalAccountPassword(currentUser?.id, passwordForm.current, passwordForm.next)
      setPasswordForm(initialPasswordForm)
      setModal('password-updated')
    } catch (error) {
      console.error('Unable to update the staff password.', error)
      setPasswordError(error.message === 'The current password is incorrect.'
        ? error.message
        : 'Could not update your password. Please try again.')
    } finally {
      setSavingPassword(false)
    }
  }

  const changePage = (nextPage) => {
    setPage(nextPage)
    setPasswordError('')
  }

  const beginProfileEdit = () => {
    setProfileForm({ name, email })
    setProfileError('')
    setEditingProfile(true)
  }

  const requestProfileSave = () => {
    const updatedName = profileForm.name.trim()
    const updatedEmail = profileForm.email.trim()
    if (!updatedName || !updatedEmail) {
      setProfileError('Name and email are required.')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedEmail)) {
      setProfileError('Enter a valid email address.')
      return
    }
    if (updatedName === name && updatedEmail === email) {
      setModal('no-changes')
      return
    }
    setProfileError('')
    setModal('save-profile')
  }

  const saveProfileChanges = () => {
    try {
      const updatedUser = updateLocalAccountProfile(currentUser?.id, profileForm)
      setCurrentUser(updatedUser)
      setProfileForm({ name: updatedUser.name, email: updatedUser.email })
      setEditingProfile(false)
      setProfileError('')
      setModal('profile-updated')
    } catch (error) {
      console.error('Unable to save the staff profile.', error)
      setModal('')
      setProfileError(error.message === 'Name and email are required.'
        ? error.message
        : 'Could not save your profile. Please try again.')
    }
  }

  const cancelProfileEdit = () => {
    if (profileForm.name.trim() !== name || profileForm.email.trim() !== email) {
      setModal('discard-profile')
      return
    }
    setEditingProfile(false)
    setProfileError('')
  }

  const discardProfileChanges = () => {
    setProfileForm({ name, email })
    setProfileError('')
    setEditingProfile(false)
    setModal('')
  }

  const confirmModalAction = () => {
    if (modal === 'logout') {
      logout()
    } else if (modal === 'save-profile') {
      saveProfileChanges()
    } else if (modal === 'discard-profile') {
      discardProfileChanges()
    } else {
      setModal('')
      if (modal === 'password-updated') changePage('profile')
    }
  }

  return (
    <StaffLayout setPath={setPath} activePath="profile">
      {page === 'profile' && (
        <div className="staff-profile-page">
          <div className="staff-view-heading">
            <div><span className="staff-eyebrow">YOUR ACCOUNT</span><h1>Profile</h1></div>
          </div>

          <section className="staff-profile-account-card">
            <div className="staff-profile-account-header">
              <span className="staff-profile-section-label">Account</span>
              <button type="button" className="staff-profile-edit-button" onClick={editingProfile ? cancelProfileEdit : beginProfileEdit}>
                {editingProfile ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {editingProfile ? (
              <div className="staff-profile-edit-fields">
                <label>Full name
                  <input
                    type="text"
                    autoComplete="name"
                    value={profileForm.name}
                    onChange={(event) => setProfileForm((form) => ({ ...form, name: event.target.value }))}
                    required
                  />
                </label>
                <label>Email address
                  <input
                    type="email"
                    autoComplete="email"
                    value={profileForm.email}
                    onChange={(event) => setProfileForm((form) => ({ ...form, email: event.target.value }))}
                    required
                  />
                </label>
                {profileError && <p className="staff-profile-error" role="alert">{profileError}</p>}
              </div>
            ) : (
              <>
                <div className="staff-profile-identity">
                  <div className="staff-profile-avatar">{initials}</div>
                  <div><h2>{name}</h2><p>{email}</p></div>
                </div>
                <button type="button" className="staff-profile-row-action" onClick={() => changePage('password')}>
                  Change Password
                </button>
              </>
            )}
          </section>

          <section className="staff-profile-info-card">
            <span className="staff-profile-section-label">About CEMS</span>
            <p>Version 2.4.0 (2026 Build)</p>
          </section>

          <section className="staff-profile-links" aria-label="Policies and account actions">
            <button type="button" className="staff-profile-option" onClick={() => changePage('privacy')}>
              <span>Privacy Policy</span><span aria-hidden="true">›</span>
            </button>
            <button type="button" className="staff-profile-option" onClick={() => changePage('terms')}>
              <span>Terms of Service</span><span aria-hidden="true">›</span>
            </button>
          </section>

          {editingProfile ? (
            <div className="staff-profile-actions">
              <button type="button" className="staff-profile-save-button" onClick={requestProfileSave}>Save Changes</button>
            </div>
          ) : (
            <div className="staff-profile-actions">
              <button type="button" className="staff-profile-logout-button" onClick={() => setModal('logout')}>Log Out</button>
            </div>
          )}
        </div>
      )}

      {page === 'password' && (
        <div className="staff-subpage">
          <button type="button" className="staff-profile-back" onClick={() => changePage('profile')}><span aria-hidden="true">←</span> Profile</button>
          <div className="staff-view-heading">
            <div><h1>Change password</h1><p>Manage the password for {email}.</p></div>
          </div>

          <form className="staff-password-form" onSubmit={updatePassword}>
            <h2>Account security</h2>
            <PasswordField
              id="staff-current-password"
              label="Current password"
              value={passwordForm.current}
              visible={Boolean(passwordVisible.current)}
              autoComplete="current-password"
              onChange={(value) => setPasswordForm((form) => ({ ...form, current: value }))}
              onToggle={() => setPasswordVisible((visible) => ({ ...visible, current: !visible.current }))}
            />
            <PasswordField
              id="staff-new-password"
              label="New password"
              value={passwordForm.next}
              visible={Boolean(passwordVisible.next)}
              autoComplete="new-password"
              onChange={(value) => setPasswordForm((form) => ({ ...form, next: value }))}
              onToggle={() => setPasswordVisible((visible) => ({ ...visible, next: !visible.next }))}
            />
            <PasswordField
              id="staff-confirm-password"
              label="Confirm new password"
              value={passwordForm.confirm}
              visible={Boolean(passwordVisible.confirm)}
              autoComplete="new-password"
              onChange={(value) => setPasswordForm((form) => ({ ...form, confirm: value }))}
              onToggle={() => setPasswordVisible((visible) => ({ ...visible, confirm: !visible.confirm }))}
            />
            <p className="staff-password-hint">Use at least 12 characters, with uppercase and lowercase letters, a number, and a symbol.</p>
            {passwordError && <p className="staff-profile-error" role="alert">{passwordError}</p>}
            <div className="staff-profile-actions">
              <button type="button" className="staff-profile-logout-button" onClick={() => changePage('profile')}>Cancel</button>
              <button type="submit" className="staff-profile-save-button" disabled={savingPassword}>
                {savingPassword ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {(page === 'privacy' || page === 'terms') && (
        <PolicyPage page={page} onBack={() => changePage('profile')} />
      )}

      {modal && (
        <ProfileModal
          type={modal}
          onClose={() => setModal('')}
          onConfirm={confirmModalAction}
        />
      )}
    </StaffLayout>
  )
}

function PasswordField({ id, label, value, visible, autoComplete, onChange, onToggle }) {
  return (
    <label className="staff-password-label" htmlFor={id}>
      <span>{label} *</span>
      <span className="staff-password-input-wrap">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          required
        />
        <button type="button" aria-label={`${visible ? 'Hide' : 'Show'} ${label.toLowerCase()}`} onClick={onToggle}>
          {visible ? 'Hide' : 'Show'}
        </button>
      </span>
    </label>
  )
}

function PolicyPage({ page, onBack }) {
  const isPrivacy = page === 'privacy'

  return (
    <div className="staff-subpage">
      <button type="button" className="staff-profile-back" onClick={onBack}><span aria-hidden="true">←</span> Back to Profile</button>
      <div className="staff-view-heading"><div><h1>{isPrivacy ? 'Privacy Policy' : 'Terms of Service'}</h1></div></div>
      <p className="staff-policy-draft">Draft — For campus review</p>
      {isPrivacy ? (
        <article className="staff-policy-card">
          <h2>Information in CEMS</h2>
          <p>The system may contain account names and email addresses, equipment identifiers, issue descriptions, attachments, repair notes, assignments, and inspection records.</p>
          <h2>Why it is used</h2>
          <p>This information supports identifying equipment, coordinating maintenance, reviewing safety, and attributing work to the staff member who recorded it.</p>
          <h2>Access and responsibilities</h2>
          <p>Access should follow campus-assigned roles. Staff report issues, assign follow-up, and update equipment records only as needed. Protect your sign-in details and avoid recording unnecessary personal information.</p>
          <h2>Questions and corrections</h2>
          <p>If a record appears inaccurate or you have a privacy question, use your campus’s established support process. A designated contact may request procedure review or confirm policy requirements.</p>
          <h2>Before publication</h2>
          <p>Campus reviewers should establish retention, security, sharing arrangements, and request-handling procedures before publishing this policy.</p>
        </article>
      ) : (
        <article className="staff-policy-card">
          <h2>Using your account</h2>
          <p>Use your CEMS account for authorized campus equipment work. Keep your sign-in details private and sign out when you finish on a shared device.</p>
          <h2>Accurate records</h2>
          <p>Provide clear, accurate equipment and maintenance information. Update only records you are authorized to manage.</p>
          <h2>Responsible access</h2>
          <p>Do not attempt to access another person’s account or use CEMS to disrupt services, misuse records, or disclose information without authorization.</p>
          <h2>Campus administration</h2>
          <p>Account access and data handling remain subject to campus policies. Contact your administrator if your account or a record needs attention.</p>
          <h2>Service status</h2>
          <p>Features and information may change as the campus reviews and updates the system.</p>
        </article>
      )}
    </div>
  )
}

function ProfileModal({ type, onClose, onConfirm }) {
  const content = {
    logout: {
      title: 'Log out of CEMS?',
      message: 'You’ll return to the login page. Sign in again to access campus equipment and your assigned tasks.',
      confirm: 'Log Out',
      cancel: 'Cancel',
    },
    'no-changes': {
      title: 'No changes to save',
      message: 'Your name and email are already up to date. Nothing has been changed.',
      confirm: 'Got it',
    },
    'password-updated': {
      title: 'Password updated',
      message: 'Your new password is ready. Use it the next time you sign in.',
      confirm: 'Back to Profile',
    },
    'save-profile': {
      title: 'Save profile changes?',
      message: 'Your updated name and email address will be saved to your staff account.',
      confirm: 'Save Changes',
      cancel: 'Cancel',
    },
    'discard-profile': {
      title: 'Discard profile changes?',
      message: 'Your unsaved name and email changes will be lost.',
      confirm: 'Discard Changes',
      cancel: 'Keep Editing',
    },
    'profile-updated': {
      title: 'Profile updated',
      message: 'Your name and email address have been saved.',
      confirm: 'Done',
    },
  }[type]

  return (
    <div className="staff-modal-scrim" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="staff-profile-modal" role="dialog" aria-modal="true" aria-labelledby="staff-profile-modal-title">
        <div className="staff-profile-modal-icon" aria-hidden="true">{type === 'logout' ? '↗' : type === 'password-updated' ? '✓' : 'i'}</div>
        <h2 id="staff-profile-modal-title">{content.title}</h2>
        <p>{content.message}</p>
        <div className="staff-profile-modal-actions">
          {content.cancel && <button type="button" className="staff-profile-modal-secondary" onClick={onClose}>{content.cancel}</button>}
          <button type="button" className={type === 'logout' || type === 'discard-profile' ? 'staff-profile-modal-danger' : 'staff-profile-modal-primary'} onClick={onConfirm}>{content.confirm}</button>
        </div>
      </section>
    </div>
  )
}

export default Profile
