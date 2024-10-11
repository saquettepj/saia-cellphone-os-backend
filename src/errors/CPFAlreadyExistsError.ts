class CPFAlreadyExistsError extends Error {
  constructor() {
    super('This CPF already exists!')
  }
}

export { CPFAlreadyExistsError }
