export function checkIfCreationDateExceeded(createdAt: Date): boolean {
  const currentTime = new Date().getTime()
  const creationTime = createdAt.getTime()
  const timeDifference = currentTime - creationTime
  const twentyFourHoursInMilliseconds = 24 * 60 * 60 * 1000

  return timeDifference > twentyFourHoursInMilliseconds
}
