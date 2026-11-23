import { initialUsers } from '../admin/adminData.jsx'

const usersStorageKey = 'cems-admin-users'
const currentUserStorageKey = 'cems-current-user'

const defaultAdmin = {
  id: 'demo-admin',
  name: 'Administrator',
  username: '@admin',
  email: 'admin@cems.edu',
  role: 'Administrator',
  status: 'Active',
}

function normalizeUsername(value) {
  return String(value || '').trim().replace(/^@/, '').toLowerCase()
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

export function findLocalDemoAccount(identifier) {
  const saved = localStorage.getItem(usersStorageKey)
  const storedUsers = saved ? JSON.parse(saved) : []
  if (!Array.isArray(storedUsers)) {
    throw new Error('Saved user accounts are not in the expected format.')
  }
  const requiredFields = ['id', 'name', 'username', 'email', 'role', 'status']
  if (storedUsers.some((account) => (
    !account
    || typeof account !== 'object'
    || requiredFields.some((field) => typeof account[field] !== 'string')
  ))) {
    throw new Error('One or more saved user accounts are incomplete.')
  }

  const normalizedUsername = normalizeUsername(identifier)
  const normalizedEmail = normalizeEmail(identifier)
  const accounts = [...storedUsers, ...initialUsers, defaultAdmin]

  return accounts.find((account) => (
    normalizeUsername(account.username) === normalizedUsername
    || normalizeEmail(account.email) === normalizedEmail
  )) || null
}

export function saveCurrentUser(account) {
  const currentUser = {
    id: String(account.id),
    name: String(account.name),
    username: String(account.username),
    email: String(account.email),
    role: String(account.role),
    status: String(account.status),
  }
  localStorage.setItem(currentUserStorageKey, JSON.stringify(currentUser))
  return currentUser
}

export function getCurrentUser() {
  const saved = localStorage.getItem(currentUserStorageKey)
  if (!saved) return null

  const account = JSON.parse(saved)
  const requiredFields = ['id', 'name', 'username', 'email', 'role', 'status']
  if (!account || typeof account !== 'object' || requiredFields.some((field) => typeof account[field] !== 'string')) {
    throw new Error('The saved login session is not in the expected format.')
  }
  return account
}

export function getAccountProfileStorageKey(accountId) {
  return `cems-user-profile-${accountId}`
}

export function clearCurrentUser() {
  localStorage.removeItem(currentUserStorageKey)
}
