import { UpdateCompanyUseCase } from '../updateCompanyUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupUpdateCompanyUseCase() {
  const companyRepository = new CompanyRepository()
  const updateCompanyUseCase = new UpdateCompanyUseCase(companyRepository)

  return updateCompanyUseCase
}

export { setupUpdateCompanyUseCase }
