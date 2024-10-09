import { CreateCompanyUseCase } from '../createCompanyUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupCreateCompanyUseCase() {
  const companyRepository = new CompanyRepository()
  const createCompanyUseCase = new CreateCompanyUseCase(companyRepository)

  return createCompanyUseCase
}

export { setupCreateCompanyUseCase }
