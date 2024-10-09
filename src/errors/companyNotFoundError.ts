class CompanyNotFoundError extends Error {
  constructor() {
    super('Company not found!')
  }
}

export { CompanyNotFoundError }
