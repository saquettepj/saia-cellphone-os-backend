import { UpdateForgotCompanyPasswordUseCase } from '../updateForgotCompanyPasswordUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupUpdateForgotCompanyPasswordUseCase() {
  const companyRepository = new CompanyRepository()
  const updateForgotCompanyPasswordUseCase =
    new UpdateForgotCompanyPasswordUseCase(companyRepository)

  return updateForgotCompanyPasswordUseCase
}

export { setupUpdateForgotCompanyPasswordUseCase }
