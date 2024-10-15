class AddressNotFoundError extends Error {
  constructor() {
    super('Address not found!')
  }
}

export { AddressNotFoundError }
