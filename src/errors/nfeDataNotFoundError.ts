class NfeDataNotFoundError extends Error {
  constructor() {
    super('NFe data not found.')
  }
}

export { NfeDataNotFoundError }
