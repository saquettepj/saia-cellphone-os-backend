import { UpdateCompanyListsUseCase } from '../updateCompanyListsUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupUpdateCompanyListsUseCase() {
  const companyRepository = new CompanyRepository()
  const updateCompanyListsUseCase = new UpdateCompanyListsUseCase(
    companyRepository,
  )

  return updateCompanyListsUseCase
}

export { setupUpdateCompanyListsUseCase }
