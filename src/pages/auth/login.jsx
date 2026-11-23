import { useState } from 'react'
import seal from '../../assets/campus-seal.png'
import { findLocalDemoAccount, saveCurrentUser } from './localAuth.js'

function Login({ setPath }) {
  const [error, setError] = useState('')

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setPath(path)
  }

  const submit = (event) => {
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

    navigate(account.role === 'Staff' ? '/staff' : '/admin')
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-label="CEMS login">
        <img className="login-seal" src={seal} alt="Campus seal" />
        <h1>Campus Equipment<br />Management System</h1>
        <p className="login-subtitle">Sign in to continue</p>

        <form onSubmit={submit}>
          <label htmlFor="username">Username or email</label>
          <input id="username" name="username" type="text" placeholder="Enter your username" autoComplete="username" required onChange={() => setError('')} />

          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" placeholder="Enter your password" autoComplete="current-password" required onChange={() => setError('')} />

          <button className="login-submit" type="submit">Log In</button>
          {error && <p className="login-error" role="alert">{error}</p>}
        </form>
        <p className="login-hint">Demo email:@admin Password: anything</p>
      </section>
    </main>
  )
}

export default Login