import { AuthenticateCompanyUseCase } from '../authenticateCompanyUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupAuthenticateCompanyUseCase() {
  const companyRepository = new CompanyRepository()
  const authenticateCompanyUseCase = new AuthenticateCompanyUseCase(
    companyRepository,
  )

  return authenticateCompanyUseCase
}

export { setupAuthenticateCompanyUseCase }
