function validateDateOnRequests(dateAsString: string): boolean {
  return !isNaN(Date.parse(dateAsString))
}

export { validateDateOnRequests }
