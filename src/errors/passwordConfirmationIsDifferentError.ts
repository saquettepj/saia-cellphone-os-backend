class PasswordConfirmationIsDifferentError extends Error {
  constructor() {
    super('New password password is different of password confirmation!')
  }
}

export { PasswordConfirmationIsDifferentError }
