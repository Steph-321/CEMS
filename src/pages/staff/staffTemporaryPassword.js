import { generateTemporaryPassword } from '../admin/temporaryPassword.js'

export function generateStaffTemporaryPassword(previousPassword = '') {
  return generateTemporaryPassword(previousPassword)
}
