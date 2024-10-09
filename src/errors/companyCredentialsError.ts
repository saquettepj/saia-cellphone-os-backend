class CompanyCredentialsError extends Error {
  constructor() {
    super('CNPJ or password incorrect!')
  }
}

export { CompanyCredentialsError }
