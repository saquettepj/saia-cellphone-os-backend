class PasswordConfirmationIsDifferentError extends Error {
  constructor() {
    super('Password is different of passwordConfirmation!')
  }
}

export { PasswordConfirmationIsDifferentError }
