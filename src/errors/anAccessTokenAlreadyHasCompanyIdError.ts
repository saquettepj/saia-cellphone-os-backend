class AnAccessTokenAlreadyHasCompanyIdError extends Error {
  constructor() {
    super('An AccessToken already has a companyId and cannot be updated!')
  }
}

export { AnAccessTokenAlreadyHasCompanyIdError }
