import { GetCompanyUseCase } from '../getCompanyUseCase'

import { CompanyRepository } from '@/repositories/company/companyRepository'

function setupGetCompanyUseCase() {
  const companyRepository = new CompanyRepository()
  const getCompanyUseCase = new GetCompanyUseCase(companyRepository)

  return getCompanyUseCase
}

export { setupGetCompanyUseCase }
