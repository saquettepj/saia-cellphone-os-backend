import { UpdateCompanyPasswordUseCase } from '../updateCompanyPasswordUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupUpdateCompanyPasswordUseCase() {
  const companyRepository = new CompanyRepository()
  const updateCompanyPasswordUseCase = new UpdateCompanyPasswordUseCase(
    companyRepository,
  )

  return updateCompanyPasswordUseCase
}

export { setupUpdateCompanyPasswordUseCase }
