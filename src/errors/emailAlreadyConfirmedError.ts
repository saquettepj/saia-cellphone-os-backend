class EmailAlreadyConfirmedError extends Error {
  constructor() {
    super('Email already confirmed!')
  }
}

export { EmailAlreadyConfirmedError }
