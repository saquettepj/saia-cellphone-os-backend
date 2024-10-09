class CompanyCNPJAlreadyExistsError extends Error {
  constructor() {
    super('This CNPJ already Exists!')
  }
}

export { CompanyCNPJAlreadyExistsError }
