function validateDateOnRequests(dateAsString: string): boolean {
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/

  if (!isoRegex.test(dateAsString)) {
    return false
  }

  return !isNaN(Date.parse(dateAsString))
}

export { validateDateOnRequests }
