class ClientHasAddressError extends Error {
  constructor() {
    super('Address already exists for this client!')
  }
}

export { ClientHasAddressError }
