export function randomPasswordGenerator(): string {
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const numbers = '0123456789'
  const specialCharacters = '@$!%*?#%'
  const allCharacters = lowercase + uppercase + numbers + specialCharacters

  const getRandomCharacter = (chars: string) =>
    chars[Math.floor(Math.random() * chars.length)]

  const passwordArray = [
    getRandomCharacter(lowercase),
    getRandomCharacter(uppercase),
    getRandomCharacter(numbers),
    getRandomCharacter(specialCharacters),
  ]

  while (passwordArray.length < 12) {
    passwordArray.push(getRandomCharacter(allCharacters))
  }

  return passwordArray.sort(() => Math.random() - 0.5).join('')
}
