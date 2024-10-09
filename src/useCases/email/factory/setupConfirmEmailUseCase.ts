import { ConfirmEmailUseCase } from '../confirmEmailUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupConfirmEmailUseCase() {
  const companyRepository = new CompanyRepository()
  const confirmEmailUseCase = new ConfirmEmailUseCase(companyRepository)

  return confirmEmailUseCase
}

export { setupConfirmEmailUseCase }
