import { UpdateCompanyTermsDateUseCase } from '../updateCompanyTermsDateUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupUpdateCompanyTermsDateUseCase() {
  const companyRepository = new CompanyRepository()
  const updateCompanyTermsDateUseCase = new UpdateCompanyTermsDateUseCase(
    companyRepository,
  )

  return updateCompanyTermsDateUseCase
}

export { setupUpdateCompanyTermsDateUseCase }
