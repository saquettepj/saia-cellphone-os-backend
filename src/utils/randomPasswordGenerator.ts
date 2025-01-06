export function randomPasswordGenerator(): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const allCharacters = lowercase + uppercase + numbers

  const getRandomCharacter = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)]

  const passwordArray = [
    getRandomCharacter(lowercase),
    getRandomCharacter(uppercase),
    getRandomCharacter(numbers),
  ]

  const passwordLength = Math.floor(Math.random() * (25 - 12 + 1)) + 12

  while (passwordArray.length < passwordLength) {
    passwordArray.push(getRandomCharacter(allCharacters))
  }

  return passwordArray.sort(() => Math.random() - 0.5).join('')
}
