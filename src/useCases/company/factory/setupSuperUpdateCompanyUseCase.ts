import { SuperUpdateCompanyUseCase } from '../superUpdateCompanyUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupSuperUpdateCompanyUseCase() {
  const companyRepository = new CompanyRepository()
  const superUpdateCompanyUseCase = new SuperUpdateCompanyUseCase(
    companyRepository,
  )

  return superUpdateCompanyUseCase
}

export { setupSuperUpdateCompanyUseCase }
