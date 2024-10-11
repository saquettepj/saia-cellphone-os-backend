class EmailAlreadyExistsError extends Error {
  constructor() {
    super('This Email already Exists!')
  }
}

export { EmailAlreadyExistsError }
