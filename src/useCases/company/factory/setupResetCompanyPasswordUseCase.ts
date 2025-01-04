import { ResetCompanyPasswordUseCase } from '../resetCompanyPasswordUseCase.ts'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupResetCompanyPasswordUseCase() {
  const companyRepository = new CompanyRepository()
  const resetCompanyPasswordUseCase = new ResetCompanyPasswordUseCase(
    companyRepository,
  )

  return resetCompanyPasswordUseCase
}

export { setupResetCompanyPasswordUseCase }
