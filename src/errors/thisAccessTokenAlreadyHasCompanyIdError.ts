class ThisAccessTokenAlreadyHasCompanyIdError extends Error {
  constructor() {
    super('This AccessToken already has a companyId and cannot be updated!')
  }
}

export { ThisAccessTokenAlreadyHasCompanyIdError }
