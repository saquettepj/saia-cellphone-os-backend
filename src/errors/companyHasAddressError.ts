class CompanyHasAddressError extends Error {
  constructor() {
    super('Address already exists for this company!')
  }
}

export { CompanyHasAddressError }
