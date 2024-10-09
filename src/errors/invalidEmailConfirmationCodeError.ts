class InvalidEmailConfirmationCodeError extends Error {
  constructor() {
    super('Invalid email confirmation code!')
  }
}

export { InvalidEmailConfirmationCodeError }
