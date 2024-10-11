import { DeleteCompanyUseCase } from '../deleteCompanyUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupDeleteCompanyUseCase() {
  const companyRepository = new CompanyRepository()

  const deleteCompanyUseCase = new DeleteCompanyUseCase(companyRepository)

  return deleteCompanyUseCase
}

export { setupDeleteCompanyUseCase }
