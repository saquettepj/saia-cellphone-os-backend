class PasswordConfirmationIsDifferentError extends Error {
  constructor() {
    super('Current password is different of password confirmation!')
  }
}

export { PasswordConfirmationIsDifferentError }
