import { UpdateCompanyHasCostUseCase } from '../updateCompanyHasCostUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupUpdateCompanyHasCostUseCase() {
  const companyRepository = new CompanyRepository()
  const updateCompanyHasCostUseCase = new UpdateCompanyHasCostUseCase(
    companyRepository,
  )

  return updateCompanyHasCostUseCase
}

export { setupUpdateCompanyHasCostUseCase }
