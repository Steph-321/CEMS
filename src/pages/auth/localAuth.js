import { initialUsers } from '../admin/adminData.jsx'

const usersStorageKey = 'cems-admin-users'
const currentUserStorageKey = 'cems-current-user'
const passwordHashIterations = 210000

const defaultAdmin = {
  id: 'demo-admin',
  name: 'Administrator',
  username: '@admin',
  email: 'admin@cems.edu',
  role: 'Administrator',
  status: 'Active',
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function hexToBytes(value) {
  if (!/^(?:[0-9a-f]{2})+$/i.test(value)) {
    throw new Error('Saved password credentials are invalid.')
  }
  return new Uint8Array(value.match(/.{2}/g).map((byte) => Number.parseInt(byte, 16)))
}

async function derivePasswordHash(password, salt) {
  const cryptoApi = globalThis.crypto
  if (!cryptoApi || !cryptoApi.subtle) {
    throw new Error('Secure password verification is not available in this browser.')
  }

  const key = await cryptoApi.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const hash = await cryptoApi.subtle.deriveBits({
    name: 'PBKDF2',
    salt,
    iterations: passwordHashIterations,
    hash: 'SHA-256',
  }, key, 256)
  return bytesToHex(new Uint8Array(hash))
}

export async function createLocalPasswordCredential(password) {
  const cryptoApi = globalThis.crypto
  if (!cryptoApi || !cryptoApi.subtle || typeof cryptoApi.getRandomValues !== 'function') {
    throw new Error('Secure password storage is not available in this browser.')
  }

  const salt = new Uint8Array(16)
  cryptoApi.getRandomValues(salt)
  return {
    passwordSalt: bytesToHex(salt),
    passwordHash: await derivePasswordHash(password, salt),
  }
}

export async function verifyLocalPassword(account, password) {
  if (account.passwordHash === undefined && account.passwordSalt === undefined) return true
  if (typeof account.passwordHash !== 'string' || typeof account.passwordSalt !== 'string') {
    throw new Error('Saved password credentials are incomplete.')
  }

  const expectedHash = hexToBytes(account.passwordHash)
  const salt = hexToBytes(account.passwordSalt)
  const actualHash = hexToBytes(await derivePasswordHash(password, salt))
  if (expectedHash.length !== actualHash.length) return false

  let difference = 0
  for (let index = 0; index < expectedHash.length; index += 1) {
    difference |= expectedHash[index] ^ actualHash[index]
  }
  return difference === 0
}

export async function updateLocalAccountPassword(accountId, currentPassword, newPassword) {
  const saved = localStorage.getItem(usersStorageKey)
  const storedUsers = saved ? JSON.parse(saved) : []
  if (!Array.isArray(storedUsers)) {
    throw new Error('Saved user accounts are not in the expected format.')
  }

  const storedAccount = storedUsers.find((account) => account.id === accountId)
  const account = storedAccount
    || [...initialUsers, defaultAdmin].find((candidate) => candidate.id === accountId)
  if (!account) {
    throw new Error('The account could not be found.')
  }
  if (!await verifyLocalPassword(account, currentPassword)) {
    throw new Error('The current password is incorrect.')
  }

  const credential = await createLocalPasswordCredential(newPassword)
  const updatedAccount = { ...account, ...credential }
  const updatedUsers = storedAccount
    ? storedUsers.map((candidate) => candidate.id === accountId ? updatedAccount : candidate)
    : [updatedAccount, ...storedUsers]
  localStorage.setItem(usersStorageKey, JSON.stringify(updatedUsers))
}

export function updateLocalAccountProfile(accountId, details) {
  const name = String(details.name || '').trim()
  const email = String(details.email || '').trim()
  if (!name || !email) {
    throw new Error('Name and email are required.')
  }

  const saved = localStorage.getItem(usersStorageKey)
  const storedUsers = saved ? JSON.parse(saved) : []
  if (!Array.isArray(storedUsers)) {
    throw new Error('Saved user accounts are not in the expected format.')
  }

  const storedAccount = storedUsers.find((account) => account.id === accountId)
  const account = storedAccount
    || [...initialUsers, defaultAdmin].find((candidate) => candidate.id === accountId)
  if (!account) {
    throw new Error('The account could not be found.')
  }

  const updatedAccount = { ...account, name, email }
  const updatedUsers = storedAccount
    ? storedUsers.map((candidate) => candidate.id === accountId ? updatedAccount : candidate)
    : [updatedAccount, ...storedUsers]
  localStorage.setItem(usersStorageKey, JSON.stringify(updatedUsers))
  return saveCurrentUser(updatedAccount)
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
    || (account.passwordHash !== undefined && typeof account.passwordHash !== 'string')
    || (account.passwordSalt !== undefined && typeof account.passwordSalt !== 'string')
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
