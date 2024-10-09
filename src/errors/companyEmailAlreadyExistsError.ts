class CompanyEmailAlreadyExistsError extends Error {
  constructor() {
    super('This Email already Exists!')
  }
}

export { CompanyEmailAlreadyExistsError }
