const characterGroups = [
  'ABCDEFGHJKLMNPQRSTUVWXYZ',
  'abcdefghijkmnopqrstuvwxyz',
  '23456789',
  '!@#$%&*',
]
const allCharacters = characterGroups.join('')
const generatedPasswords = new Set()
const passwordLength = 14

function randomIndex(length) {
  const cryptoApi = globalThis.crypto
  if (!cryptoApi || typeof cryptoApi.getRandomValues !== 'function') {
    throw new Error('Secure password generation is not available in this browser.')
  }

  const maxValidByte = Math.floor(256 / length) * length
  const value = new Uint8Array(1)
  do {
    cryptoApi.getRandomValues(value)
  } while (value[0] >= maxValidByte)

  return value[0] % length
}

export function generateTemporaryPassword(previousPassword = '') {
  while (true) {
    const characters = characterGroups.map((group) => group[randomIndex(group.length)])
    while (characters.length < passwordLength) {
      characters.push(allCharacters[randomIndex(allCharacters.length)])
    }

    for (let index = characters.length - 1; index > 0; index -= 1) {
      const swapIndex = randomIndex(index + 1)
      const current = characters[index]
      characters[index] = characters[swapIndex]
      characters[swapIndex] = current
    }

    const password = characters.join('')
    if (password !== previousPassword && !generatedPasswords.has(password)) {
      generatedPasswords.add(password)
      return password
    }
  }
}
