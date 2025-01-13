import { DeleteInactiveCompaniesUseCase } from '../deleteInactiveCompaniesUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupDeleteInactiveCompaniesUseCase() {
  const companyRepository = new CompanyRepository()
  const deleteInactiveCompaniesUseCase = new DeleteInactiveCompaniesUseCase(
    companyRepository,
  )

  return deleteInactiveCompaniesUseCase
}

export { setupDeleteInactiveCompaniesUseCase }
