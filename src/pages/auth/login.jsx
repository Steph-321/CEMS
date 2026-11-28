import { useState } from 'react'
import seal from '../../assets/campus-seal.png'
import { findLocalDemoAccount, saveCurrentUser, verifyLocalPassword } from './localAuth.js'

function Login({ setPath }) {
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  const submit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    let account
    try {
      account = findLocalDemoAccount(String(form.get('username')))
    } catch (loadError) {
      console.error('Unable to read local demo accounts.', loadError)
      setError('Could not load user accounts. Please check the saved account data.')
      return
    }

    if (!account) {
      setError('No account matches that username or email.')
      return
    }
    try {
      const passwordIsValid = await verifyLocalPassword(account, String(form.get('password')))
      if (!passwordIsValid) {
        setError('Incorrect password.')
        return
      }
    } catch (passwordError) {
      console.error('Unable to verify the account password.', passwordError)
      setError('Could not verify the password. Please try again.')
      return
    }

    if (account.status !== 'Active') {
      setError('This account is deactivated. Contact an administrator.')
      return
    }
    if (!['Administrator', 'Staff'].includes(account.role)) {
      setError('This account has an unsupported role.')
      return
    }

    try {
      saveCurrentUser(account)
    } catch (saveError) {
      console.error('Unable to save the local demo login session.', saveError)
      setError('Could not save your login session. Please try again.')
      return
    }

    navigate(account.role === 'Staff' ? '/staff/dashboard' : '/admin/dashboard')
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* ── Left panel — branding ── */}
        <div className="auth-left">
          <div className="auth-left-orb auth-left-orb-1" />
          <div className="auth-left-orb auth-left-orb-2" />
          <div className="auth-left-orb auth-left-orb-3" />

          <div className="auth-left-content">
            <img src={seal} alt="Campus seal" className="auth-seal" />
            <span className="auth-eyebrow">COTE — BSIT DEPARTMENT</span>
            <h1 className="auth-headline">Campus Equipment<br />Management System</h1>
            <p className="auth-desc">
              A centralized platform for managing campus assets, maintenance requests, equipment schedules, and system users.
            </p>

            <div className="auth-features">
              <div className="auth-feature-item">
                <span className="auth-feature-dot" />
                Asset inventory &amp; lifecycle tracking
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-dot" />
                Maintenance request management
              </div>
              <div className="auth-feature-item">
                <span className="auth-feature-dot" />
                Equipment scheduling &amp; inspections
              </div>
            </div>
          </div>
        </div>

        {/* ── Right panel — form ── */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <div className="auth-form-header">
              <h2>Welcome back</h2>
              <p>Sign in to your account to continue</p>
            </div>

            <form className="auth-form" onSubmit={submit} noValidate>
              <div className="auth-field">
                <label htmlFor="username">Username or Email</label>
                <div className="auth-input-wrap">
                  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username or email"
                    autoComplete="username"
                    required
                    onChange={() => setError('')}
                  />
                </div>
              </div>

              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <div className="auth-input-wrap">
                  <svg className="auth-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    onChange={() => setError('')}
                  />
                  <button
                    type="button"
                    className="auth-show-pw"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <p className="auth-error" role="alert">{error}</p>
              )}

              <button type="submit" className="auth-submit">
                Sign In
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>

            <p className="auth-hint">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
              </svg>
              Demo: username <strong>@admin</strong> · any password
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
