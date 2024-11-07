import { UpdateCompanyTermsUseCase } from '../updateCompanyTermsUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupUpdateCompanyTermsUseCase() {
  const companyRepository = new CompanyRepository()
  const updateCompanyTermsUseCase = new UpdateCompanyTermsUseCase(
    companyRepository,
  )

  return updateCompanyTermsUseCase
}

export { setupUpdateCompanyTermsUseCase }
