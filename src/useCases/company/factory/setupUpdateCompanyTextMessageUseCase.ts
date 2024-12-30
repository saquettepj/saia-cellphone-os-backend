import { UpdateCompanyTextMessageUseCase } from '../updateCompanyTextMessageUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupUpdateCompanyTextMessageUseCase() {
  const companyRepository = new CompanyRepository()
  const updateCompanyTextMessageUseCase = new UpdateCompanyTextMessageUseCase(
    companyRepository,
  )

  return updateCompanyTextMessageUseCase
}

export { setupUpdateCompanyTextMessageUseCase }
